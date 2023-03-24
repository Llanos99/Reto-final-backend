import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import Pregunta from "App/Models/Pregunta";
import Respuesta from "App/Models/Respuesta";
import RespuestasController from "App/Controllers/Http/RespuestasController";

export default class PreguntasController {

  public async registrarPregunta({request, response}: HttpContextContract) {
    const {question, options} = request.all();
    try {
      const validarPregunta: number = await this.validarPregunta(question);
      if (validarPregunta == 0) {
        const pregunta = new Pregunta();
        pregunta.question = question;
        await pregunta.save();
        for (const answer of options) {
          const respuestaController = new RespuestasController();
          const respuesta = new Respuesta();
          respuesta.answer = answer.answer;
          respuesta.is_correct = answer.is_correct;
          respuesta.question_id = pregunta.id;
          const respuestaValida: number = await respuestaController.validarRepuesta(pregunta.id, answer.is_correct);
          if (respuestaValida == 0) {
            await respuesta.save();
          }
        }
        return response.status(200).json({"msg": "Pregunta creada exitosamente"});
      } else {
        return response.status(400).json({"msg": "Pregunta repetida"});
      }
    } catch (e) {
      return response.status(200).json({"msg": "Error al crear la pregunta"});
    }
  }

  public async listarPreguntas({response}: HttpContextContract): Promise<void> {
    try {
      const preguntas = await Pregunta.all();
      return response.status(200).json({"state": true, "questions": preguntas});
    } catch (e) {
      return response.status(400).json({"state": false, "msg": "Error al listar las preguntas"});
    }
  }

  public async leerPregunta({request, response}: HttpContextContract) {
    const id = request.param('id');
    const pregunta = await Pregunta.query().preload('answer_list').where({"id": id}).from('preguntas');
    if (!pregunta) {
      return response.status(400).json({"msg": "La pregunta no existe"});
    }
    return response.status(200).json(pregunta);
  }

  public async actualizarPregunta({request, response}: HttpContextContract) {
    const id = request.param('id');
    const nueva_pregunta = request.input('question');
    try {
      const antigua_pregunta = await Pregunta.findOrFail(id);
      if (antigua_pregunta) {
        antigua_pregunta.question = nueva_pregunta;
        await antigua_pregunta.save();
        return response.status(200).json({"msg": "Pregunta editada con exito"});
      } else {
        return response.status(400).json({"msg": "La pregunta no existe"});
      }
    } catch (e) {
      return response.status(500).json({"msg": "Error al editar la pregunta"});
    }
  }

  public async eliminarPregunta({request, response}: HttpContextContract) {
    const id = request.param('id');
    const pregunta = await Pregunta.find(id);
    if (!pregunta) {
      return response.status(400).json({"state": false, "msg": "Error al eliminar la pregunta"});
    }
    await pregunta.delete();
    return response.status(200).json({"state": true, "msg": "Pregunta eliminada con exito"});
  }

  public async actualizarRespuesta({request, response}: HttpContextContract) {
    const id = request.param('id');
    const nueva_respuesta = request.all();
    try {
      const respuestaController = new RespuestasController();
      const antigua_respuesta = await Respuesta.findOrFail(id);
      const respuestaValida: number = await respuestaController.validarRepuesta(antigua_respuesta.question_id, nueva_respuesta.is_correct);
      if (antigua_respuesta && respuestaValida == 0) {
        antigua_respuesta.answer = nueva_respuesta.answer
        antigua_respuesta.is_correct = nueva_respuesta.is_correct
        await antigua_respuesta.save();
        return response.status(200).json({"state": true, "msg": "Opcion editada con exito"});
      } else {
        return response.status(400).json({"status": false, "msg": "Error al editar la opcion"});
      }
    } catch (e) {
      return response.status(400).json({"status": false, "msg": "Error al editar la opcion"});
    }
  }

  public async listaOpciones({request, response}: HttpContextContract) {
    const id = request.param('id');
    try{
      const lista_opciones = await Respuesta.query().where('question_id', id).from('respuestas');
      return response.status(200).json({"state": true, "msg": "Listado de opciones", "options": lista_opciones});
    } catch (e){
      return response.status(400).json({"state": false, "msg": "Error al obtener el listado de opciones"});
    }
  }

  private async validarPregunta(question: string): Promise<number> {
    const ptr = await Pregunta.query().where({"question": question}).from('preguntas');
    return ptr.length;
  }
}
