import {DateTime} from 'luxon'
import {BaseModel, column, hasOne, HasOne} from '@ioc:Adonis/Lucid/Orm'
import Role from "App/Models/Role";
import TipoDocumento from "App/Models/TipoDocumento";

export default class Usuario extends BaseModel {
  @column({isPrimary: true})
  public id: number

  @column()
  public first_name: string

  @column()
  public second_name: string

  @column()
  public sur_name: string

  @column()
  public second_sur_name: string

  @column()
  public document_number: string

  @column()
  public email: string

  @column()
  public password: string

  @column()
  public phone: string

  @column()
  public state: boolean

  @column()
  public role_id: number

  @hasOne(() => Role, {
    localKey: 'role_id',
    foreignKey: 'id'
  })
  public role: HasOne<typeof Role>

  @column()
  public type_document: number

  @hasOne(() => TipoDocumento, {
    localKey: 'type_document',
    foreignKey: 'id'
  })
  public tipoDocumento: HasOne<typeof TipoDocumento>

  @column.dateTime({autoCreate: true})
  public createdAt: DateTime

  @column.dateTime({autoCreate: true, autoUpdate: true})
  public updatedAt: DateTime

  public name() {
    return this.first_name + " " + this.second_name + " " + this.sur_name + " " + this.second_sur_name;
  }

  public toJSON() {
    const json = super.toJSON();
    delete json.$extras;
    delete json.id;
    delete json.password;
    delete json.created_at;
    delete json.updated_at;
    return json;
  }
}
