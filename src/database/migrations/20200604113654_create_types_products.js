exports.up = (knex) => {
  return knex.schema.createTable('types_products', (table) => {
    table.increments('id').unique().primary();
    table.string('type').notNullable().unique();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('types_products');
};
