exports.up = (knex) => {
  return knex.schema.createTable('category_denuciations', (table) => {
    table.increments('id').unique().primary();
    table.string('category').unique().notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('category_denuciations');
};
