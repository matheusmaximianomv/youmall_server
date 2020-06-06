import Knex from 'knex';

import configKnex from '../../knexfile';

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Knex(configKnex.development);
  }
}

export default new Database().connection;
