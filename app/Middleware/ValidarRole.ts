import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import UsuariosController from "App/Controllers/Http/UsuariosController";
import Usuario from "App/Models/Usuario";

export default class ValidarRole {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    const authorizationHeader = ctx.request.header('authorization')
    if (authorizationHeader == undefined) {
      return ctx.response.status(400).send({
        msg: "No se ha añadido el token de autorizacion",
        state: 401
      })
    }
    try {
      const usuariosController = new UsuariosController()
      const {id} = await usuariosController.obtenerPayload(authorizationHeader)
      const usuario = await Usuario.find(id)
      if (!usuario) {
        return ctx.response.status(401).json({
          msg: "Token invalido"
        })
      }
      if (usuario.role_id != 1) {
        return ctx.response.status(401).json({
          msg: "Sin permisos para acceder a esta ruta"
        })
      }
      await next()
    } catch (error) {
      ctx.response.status(400).json({"msg": "Token no valido"})
    }
  }
}
