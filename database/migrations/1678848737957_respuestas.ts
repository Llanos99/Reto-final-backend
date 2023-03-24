import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Respuestas extends BaseSchema {
  protected tableName = 'respuestas'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('answer', 500).notNullable()
      table.boolean('is_correct').notNullable()
      table.boolean('is_choosen').defaultTo(false)
      table.boolean('state').notNullable().defaultTo(true)
      table.integer('question_id').unsigned().index('question_id')
      table.foreign('question_id').references('id').inTable('preguntas').onDelete('cascade')
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
