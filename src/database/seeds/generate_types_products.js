exports.seed = async (knex) => {
  return knex('types_products').insert([
    {
      type: 'Camisas',
    },
    {
      type: 'Blusas',
    },
    {
      type: 'Shorts',
    },
    {
      type: 'Tẽnis',
    },
    {
      type: 'Sandálias',
    },
    {
      type: 'Calças',
    },
  ]);
};
