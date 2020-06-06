exports.up = (knex) => {
  return knex.schema.createTable('address', (table) => {
    table.string('country').notNullable();
    table.string('uf', 2).notNullable();
    table.string('city').notNullable();
    table.string('zipcode').notNullable();
    table.string('neighborhood').notNullable();
    table.string('street').notNullable();
    table.integer('number').notNullable();
    table.string('complement').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.integer('id_user').notNullable();
    table.foreign('id_user').references('id').inTable('users');
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('address');
};
