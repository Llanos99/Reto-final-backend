/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.group(() => {
  Route.post("/login", "UsuariosController.login")
}).prefix("/api/v1")

Route.group(() => {
  Route.post("/registrar", "RolesController.registrarRole")
  Route.get("/obtener/:id", "RolesController.obtenerRole").middleware("auth")
}).prefix("/role")

Route.group(() => {
  Route.post("/create", "PreguntasController.registrarPregunta")
  Route.get("/obtener/:id", "PreguntasController.leerPregunta")
  Route.get("/getQuestions", "PreguntasController.listarPreguntas")
  Route.delete("/deleteQuestion/:id", "PreguntasController.eliminarPregunta")
  Route.put("/updateQuestion/:id", "PreguntasController.actualizarPregunta")
  Route.put("/updateAnswer/:id", "PreguntasController.actualizarRespuesta")
  Route.get("/getOptions/:id", "PreguntasController.listaOpciones")
}).prefix("/api/v1/questions").middleware("auth")

Route.group(() => {
  Route.post("/registrar", "RespuestasController.registrarRespuesta")
  Route.get("/obtener/:id", "RespuestasController.leerRespuesta")
}).prefix("/respuesta")

Route.group(() => {
  Route.post("/registrar", "TipoDocumentosController.registrarTipoDocumento")
  Route.get("/obtener/:id", "TipoDocumentosController.obtenerTipoDocumento").middleware("auth")
}).prefix("/tipo/documento")

Route.group(() => {
  Route.post("/create", "UsuariosController.registrarUsuario")
  Route.get("/getUser/:id", "UsuariosController.leerUsuario").middleware("auth")
  Route.get("/getUsers", "UsuariosController.listarUsuarios").middleware("auth")
  Route.put("/update/:id", "UsuariosController.actualizarUsuario").middleware("auth")
  Route.delete("/eliminar/:id", "UsuariosController.eliminarUsuario").middleware("auth")
}).prefix("/api/v1/user")

Route.group(() => {
  Route.post("/registrar", "FormulariosController.registrarFormulario")
  Route.post("/postquestions", "FormulariosController.guardarRespuestas")
  Route.get("/getAnswers/:id", "FormulariosController.listarRespuestas")
  Route.get("/obtener/:id", "FormulariosController.leerFormulario").middleware("admin")
  Route.get("/getquestions", "FormulariosController.listarFormularios")
  Route.put("/actualizar/:id", "FormulariosController.actualizarFormulario")
  Route.delete("/eliminar/:id", "FormulariosController.eliminarFormulario")
}).prefix("/api/v1/form").middleware("auth")
