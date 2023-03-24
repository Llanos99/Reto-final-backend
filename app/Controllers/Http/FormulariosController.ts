import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import Formulario from "App/Models/Formulario";
import Respuesta from "App/Models/Respuesta";
import Pregunta from "App/Models/Pregunta";

export default class FormulariosController {

  public async registrarFormulario({request, response}: HttpContextContract) {
    const {id, user_id} = request.all();
    try {
      const validarFormulario: number = await this.validarFormulario(id);
      if (validarFormulario == 0) {
        const formulario = new Formulario();
        formulario.user_id = user_id;
        await formulario.save();
        return response.status(200).json({"msg": "Formulario creado con exito"});
      } else {
        return response.status(400).json({"msg": "El formulario ya se encuentra creado"});
      }
    } catch (e) {
      return response.status(500).json({"msg": "Error en el servidor"});
    }
  }

  public async leerFormulario({request, response}: HttpContextContract) {
    const id = request.param('id');
    const formulario = await Formulario.query().where('id', id)
      .preload("question_list", (query) => {
        query.preload('answer_list')
      })
      .from('formularios')
      .first();
    if (!formulario) {
      return response.status(400).json({"msg": "El formulario no existe"});
    }
    return response.status(200).json(formulario);
  }

  public async listarFormularios({response}: HttpContextContract) {
    const formularios = await Formulario.query()
      .preload("question_list", (query) => {
        query.preload('answer_list')
      })
      .from('formularios');
    if (!formularios) {
      return response.status(400).json({"state": false, "msg": "Error al obtener el listado"});
    }
    return response.status(200).json({"state": true, "forms": formularios});
  }

  public async actualizarFormulario({request, response}: HttpContextContract) {
    const id = request.param('id');
    const newData = request.all();
    try {
      const formulario = await Formulario.findOrFail(id);
      if (formulario) {
        formulario.state = newData.state, formulario.user_id = newData.user_id
        await formulario.save();
        return response.status(200).json({"msg": "Formulario actualizado con exito"});
      } else {
        return response.status(400).json({"msg": "El formulario no existe"});
      }
    } catch (e) {
      return response.status(500).json({"msg": "Error en el servidor"});
    }
  }

  public async eliminarFormulario({request, response}: HttpContextContract) {
    const id = request.param('id');
    const formulario = await Formulario.find(id);
    if (!formulario) {
      return response.status(400).json({"msg": "El formulario no existe"});
    }
    await formulario.delete();
    return response.status(200).json({"msg": "Formulario eliminado con exito"});
  }

  public async guardarRespuestas({request, response}: HttpContextContract) {
    const {user_id, answers} = request.all();
    try {
      const new_form = new Formulario();
      new_form.user_id = user_id;
      await new_form.save();
      for (const option of answers) {
        const temp_answer = await Respuesta.findOrFail(option);
        const temp_question = await Pregunta.findOrFail(temp_answer.question_id);
        temp_answer.is_choosen = true;
        temp_question.form_id = new_form.id;
        await temp_answer.save();
        await temp_question.save();
      }
      return response.status(200).json({"state": true, "msg": "Respuestas almacenadas con exito"});
    } catch (e) {
      return response.status(400).json({"staye": false, "msg": "No se pudieron almacenar las respuestas"});
    }
  }

  public async listarRespuestas({request, response}: HttpContextContract) {
    const id = request.param('id');
    const formulario = await Formulario.query().where('id', id)
      .preload('question_list', (query) => {
        query.preload('answer_list', (query) => {
          query.where('is_choosen', true)
        })
      })
      .from('formularios')
    if (!formulario) {
      return response.status(400).json({"msg": "El formulario no existe"});
    }
    return response.status(200).json(formulario);
  }
  
  private async validarFormulario(id: number): Promise<number> {
    const ptr = await Formulario.query().where({'id': id}).from('formularios');
    return ptr.length;
  }

}
