import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import UsuariosController from "App/Controllers/Http/UsuariosController";

export default class AuthJwt {
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
      usuariosController.verificarToken(authorizationHeader)
      await next()
    } catch (error) {
      ctx.response.status(400).send("Falla interna en el token");
    }
  }
}
