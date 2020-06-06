exports.up = (knex) => {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').unique().primary();
    table.string('fullname').notNullable();
    table.string('email').notNullable().unique();
    table.string('password').notNullable();
    table.string('username').notNullable().unique();
    table.string('cpf').notNullable().unique();
    table.boolean('isAdmin').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('users');
};
