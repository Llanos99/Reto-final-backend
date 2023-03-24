import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Formularios extends BaseSchema {
  protected tableName = 'formularios'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().index('user_id')
      table.foreign('user_id').references('id').inTable('usuarios')
      table.boolean('state').notNullable().defaultTo(true)
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
