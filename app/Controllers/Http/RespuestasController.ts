import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import Respuesta from "App/Models/Respuesta";

export default class RespuestasController {

  public async registrarRespuesta({request, response}: HttpContextContract) {
    const dataRespuesta = request.only(['id', 'answer', 'is_correct', 'question_id']);
    try {
      const respuestaValida = await this.validarRepuesta(dataRespuesta.question_id, dataRespuesta.is_correct);
      if (respuestaValida == 0) {
        const respuesta = new Respuesta();
        respuesta.id = dataRespuesta.id;
        respuesta.answer = dataRespuesta.answer;
        respuesta.is_correct = dataRespuesta.is_correct;
        respuesta.question_id = dataRespuesta.question_id;
        await respuesta.save();
        return response.status(200).json({"msg": "Respuesta registrada con exito"});
      } else {
        return response.status(400).json({"msg": "No puede haber mas de una respuesta verdadera"});
      }
    } catch (e) {
      return response.status(500).json({"msg": "Error en el servidor"});
    }
  }

  public async leerRespuesta({request, response}: HttpContextContract) {
    const id = request.param('id');
    const respuesta = await Respuesta.findBy("id", id);
    if (!respuesta) {
      return response.status(400).json({"msg": "La respuesta no existe"});
    }
    return response.status(200).json(respuesta);
  }

  public async validarRepuesta(question_id: number, veredict: boolean): Promise<number> {
    const ptr = await Respuesta.query().where({"question_id": question_id}).andWhere({"is_correct": true}).from('respuestas');
    if (ptr.length > 0 && !veredict) {
      return 0;
    }
    return ptr.length;
  }

}
