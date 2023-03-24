import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Usuarios extends BaseSchema {
  protected tableName = 'usuarios'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('first_name').notNullable()
      table.string('second_name').notNullable()
      table.string('sur_name').notNullable()
      table.string('second_sur_name').notNullable()
      table.string('document_number').notNullable().unique()
      table.string('email').notNullable().unique()
      table.string('password').notNullable()
      table.string('phone').notNullable()
      table.boolean('state').notNullable().defaultTo(true)
      table.integer('type_document').unsigned().index('type_document')
      table.foreign('type_document').references('id').inTable('tipo_documentos')
      table.integer('role_id').unsigned().index('role_id')
      table.foreign('role_id').references('id').inTable('roles')
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
