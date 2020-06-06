exports.up = (knex) => {
  return knex.schema.createTable('notifications', (table) => {
    table.increments('id').unique().primary();
    table.string('message').notNullable();

    table.integer('id_product').notNullable();
    table.foreign('id_product').references('id').inTable('products');

    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('notifications');
};
