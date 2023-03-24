import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Preguntas extends BaseSchema {
  protected tableName = 'preguntas'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('question', 300).notNullable().unique()
      table.boolean('state').notNullable().defaultTo(true)
      table.integer('form_id').unsigned().index('form_id')
      table.foreign('form_id').references('id').inTable('formularios').onDelete('cascade')
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
