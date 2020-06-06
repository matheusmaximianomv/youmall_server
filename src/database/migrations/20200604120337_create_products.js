exports.up = (knex) => {
  return knex.schema.createTable('products', (table) => {
    table.increments('id').unique().primary();
    table.string('name').notNullable();
    table.string('description').notNullable();
    table.integer('stock').notNullable().defaultTo(1);
    table.decimal('price').notNullable();
    table.string('size').notNullable();

    table.integer('id_file');
    table.foreign('id_file').references('id').inTable('files');

    table.integer('id_owner').notNullable();
    table.foreign('id_owner').references('id').inTable('users');

    table.integer('id_type').notNullable();
    table.foreign('id_type').references('id').inTable('types_products');

    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('products');
};
