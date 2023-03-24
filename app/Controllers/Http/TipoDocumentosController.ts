import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import TipoDocumento from "App/Models/TipoDocumento";

export default class TipoDocumentosController {

  public async registrarTipoDocumento({request, response}: HttpContextContract) {
    const dataDocumento = request.only(['id', 'name']);
    try {
      const idTipoDocumento = dataDocumento.id;
      const tipoDocumentoExistente: number = await this.validarTipoDocumento(idTipoDocumento);
      if (tipoDocumentoExistente == 0) {
        await TipoDocumento.create(dataDocumento);
        response.status(200).json({"msg": "Tipo de documento registrado con exito"})
      } else {
        response.status(400).json({"msg": "El tipo de documento ya se encuentra registrado."})
      }
    } catch (e) {
      response.status(500).json({"msg": "Error en el servidor"})
    }
  }

  public async obtenerTipoDocumento({request}: HttpContextContract){
    const id = request.param('id');
    const tipoDocumento = await TipoDocumento.find(id);
    return tipoDocumento;
  }

  private async validarTipoDocumento(id: number): Promise<number> {
    const ptr = await TipoDocumento.query().where({"id": id}).from('tipo_documentos')
    return ptr.length;
  }
}
