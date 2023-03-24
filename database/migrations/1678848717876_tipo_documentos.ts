import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class TipoDocumentos extends BaseSchema {
  protected tableName = 'tipo_documentos'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('id').primary().unique()
      table.string('name', 50).notNullable()
      table.boolean('state').notNullable().defaultTo(true)
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
