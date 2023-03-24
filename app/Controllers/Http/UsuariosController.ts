import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import jwt from 'jsonwebtoken'
import Env from '@ioc:Adonis/Core/Env'
import Usuario from "App/Models/Usuario";
import TipoDocumento from "App/Models/TipoDocumento";
import Role from "App/Models/Role";

const bcryptjs = require('bcryptjs')

export default class UsuariosController {

  public async registrarUsuario({request, response}: HttpContextContract) {
    const dataUsuario = request.only(['first_name', 'second_name', 'sur_name', 'second_sur_name', 'document_number', 'email', 'password', 'phone', 'role_id', 'type_document']);
    try {
      const validarUsuario: number = await this.validarUsuario(dataUsuario.document_number);
      if (validarUsuario == 0) {
        const salt = await bcryptjs.genSaltSync();
        const usuario = new Usuario();
        usuario.first_name = dataUsuario.first_name;
        usuario.second_name = dataUsuario.second_name;
        usuario.sur_name = dataUsuario.sur_name;
        usuario.second_sur_name = dataUsuario.second_sur_name;
        usuario.document_number = dataUsuario.document_number;
        usuario.email = dataUsuario.email;
        usuario.password = await bcryptjs.hashSync(dataUsuario.password, salt);
        usuario.phone = dataUsuario.phone;
        usuario.role_id = dataUsuario.role_id;
        usuario.type_document = dataUsuario.type_document;
        const role = await Role.findOrFail(dataUsuario.role_id);
        const tipo_documento = await TipoDocumento.findOrFail(dataUsuario.type_document);
        usuario.$setRelated('role', role);
        usuario.$setRelated('tipoDocumento', tipo_documento);
        await usuario.save();
        return response.status(200).json({"state": true, "msg": "Usuario registrado con exito"});
      } else {
        return response.status(400).json({"msg": "Fallo en la creacion del usuario"});
      }
    } catch (e) {
      console.log(e)
      return response.status(500).json({"msg": "Fallo en la creacion del usuario"});
    }
  }

  public async listarUsuarios(): Promise<Usuario[]> {
    const usuarios = await Usuario.all()
    return usuarios;
  }

  public async leerUsuario({request, response}: HttpContextContract) {
    const id = request.param('id');
    const usuario = await Usuario.findBy('id', id);
    //const usuario = await Usuario.query().where('id', id).preload('role').preload('tipoDocumento').from('usuarios').firstOrFail();
    if (!usuario) {
      return response.status(400).json({"msg": "El usuario no existe"});
    }
    return response.status(200).json(usuario.toJSON());
  }

  public async actualizarUsuario({request, response}: HttpContextContract) {
    const id = request.param('id');
    const newData = request.all();
    try {
      const usuario = await Usuario.findOrFail(id);
      if (usuario) {
        usuario.first_name = newData.first_name, usuario.second_name = newData.second_name,
          usuario.sur_name = newData.surname, usuario.second_sur_name = newData.second_sur_name,
          usuario.document_number = newData.document_number, usuario.email = newData.email,
          usuario.phone = newData.phone, usuario.state = newData.state, usuario.role_id = newData.role_id,
          usuario.type_document = newData.type_document
        const equalPassword = await bcryptjs.compareSync(usuario.password, newData.password);
        if (!equalPassword) {
          const salt = await bcryptjs.genSaltSync();
          usuario.password = await bcryptjs.hashSync(newData.password, salt);
        }
        await usuario.save();
        return response.status(200).json({"msg": "Usuario actualizado con exito"});
      } else {
        return response.status(400).json({"msg": "El usuario no existe"});
      }
    } catch (e) {
      return response.status(500).json({"msg": "Error al actualizar"});
    }
  }

  public async eliminarUsuario({request, response}: HttpContextContract) {
    const id = request.param('id');
    const usuario = await Usuario.find(id);
    if (!usuario) {
      return response.status(400).json({"msg": "El usuario no existe"});
    }
    await usuario.delete();
    return response.status(200).json({"msg": "El usuario se elimino con exito"});
  }

  public async login({request, response}: HttpContextContract) {
    const email = request.input('email');
    const password = request.input('password');
    try {
      const usuario = await Usuario.findByOrFail('email', email);
      const role_type = await Role.findByOrFail('id', usuario.id);
      const role = role_type.name;
      if (!usuario) {
        return response.status(400).json({"msg": "El usuario no existe"});
      }
      const contrasenaValida = bcryptjs.compareSync(password, usuario.password);
      if (!contrasenaValida) {
        return response.status(400).json({"msg": "Datos de acceso incorrectos"});
      }
      const payload = {
        'nombre': usuario.first_name,
        'cedula': usuario.document_number,
        'email': usuario.email,
        'role': role
      }
      const token: string = this.generarToken(payload);
      return response.status(200).json({
        token,
        "state": true,
        "id": usuario.id,
        "name": usuario.name(),
        "role": role,
        "message": "Ingreso exitoso"
      });
    } catch (e) {
      return response.status(400).json({"state": false, "msg": "Credenciales invalidas"});
    }
  }

  public generarToken(payload: any): string {
    const opciones = {
      expiresIn: "60 mins"
    }
    return jwt.sign(payload, Env.get('JWT_SECRET_KEY'), opciones)
  }

  public verificarToken(authorizationHeader: string) {
    let token = authorizationHeader.split(' ')[1]
    token = jwt.verify(token, Env.get('JWT_SECRET_KEY'), (error) => {
      if (error) {
        throw new Error("Token expirado");

      }
    })
    return true
  }

  public obtenerPayload(authorizationHeader: string) {
    let token = authorizationHeader.split(' ')[1]
    const payload = jwt.verify(token, Env.get("JWT_SECRET_KEY"), {complete: true}).payload
    console.log(payload)
    return payload
  }

  private async validarUsuario(document_number: string): Promise<number> {
    const ptr = await Usuario.query().where({'document_number': document_number}).from('usuarios');
    return ptr.length;
  }

}
