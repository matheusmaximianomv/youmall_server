exports.up = (knex) => {
  return knex.schema.createTable('denuciations', (table) => {
    table.increments('id').unique().primary();
    table.string('message').notNullable();

    table.integer('id_category').notNullable();
    table
      .foreign('id_category')
      .references('id')
      .inTable('category_denuciations');

    table.integer('id_denunciator').notNullable();
    table.foreign('id_denunciator').references('id').inTable('users');

    table.integer('id_denounced').notNullable();
    table.foreign('id_denounced').references('id').inTable('users');

    table.integer('id_product').notNullable();
    table.foreign('id_product').references('id').inTable('products');

    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('denuciations');
};
