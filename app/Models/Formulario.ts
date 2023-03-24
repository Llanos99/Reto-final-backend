import {DateTime} from 'luxon'
import {BaseModel, column, hasMany, HasMany} from '@ioc:Adonis/Lucid/Orm'
import Pregunta from "App/Models/Pregunta";

export default class Formulario extends BaseModel {
  @column({isPrimary: true})
  public id: number

  @column()
  public state: boolean

  @column()
  public user_id: number

  @hasMany(() => Pregunta, {
    foreignKey: 'form_id'
  })
  public question_list: HasMany<typeof Pregunta>

  @column.dateTime({autoCreate: true})
  public createdAt: DateTime

  @column.dateTime({autoCreate: true, autoUpdate: true})
  public updatedAt: DateTime
}
