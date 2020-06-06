exports.up = (knex) => {
  return knex.schema.createTable('files', (table) => {
    table.increments('id').unique().primary();
    table.string('originalName').notNullable();
    table.string('path').notNullable().unique();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('files');
};
