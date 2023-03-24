import {DateTime} from 'luxon'
import {BaseModel, column, hasMany, HasMany} from '@ioc:Adonis/Lucid/Orm'
import Respuesta from "App/Models/Respuesta";

export default class Pregunta extends BaseModel {
  @column({isPrimary: true})
  public id: number

  @column()
  public question: string

  @column()
  public state: boolean

  @column()
  public form_id: number

  @hasMany(() => Respuesta, {
    foreignKey: 'question_id'
  })
  public answer_list: HasMany<typeof Respuesta>

  @column.dateTime({autoCreate: true})
  public createdAt: DateTime

  @column.dateTime({autoCreate: true, autoUpdate: true})
  public updatedAt: DateTime
}
