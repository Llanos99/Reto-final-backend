import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import Role from "App/Models/Role";

export default class RolesController {

  public async registrarRole({request, response}: HttpContextContract) {
    const dataRole = request.only(['id', 'name']);
    try {
      const idRole = dataRole.id;
      const roleExistente: number = await this.validarRole(idRole);
      if(roleExistente === 0){
        await Role.create(dataRole);
        return response.status(200).json({"msg": "Role registrado con exito"});
      } else {
        return response.status(400).json({"msg": "El rol ya se encuentra registrado."});
      }
    } catch (e) {
      return response.status(500).json({"msg": "Error en el servidor"});
    }
  }

  public async obtenerRole({request}: HttpContextContract){
    const id = request.param('id');
    const role = await Role.find(id);
    return role;
  }

  private async validarRole(id: number): Promise<number> {
    const ptr = await Role.query().where({"id": id}).from('roles')
    return ptr.length;
  }

}
