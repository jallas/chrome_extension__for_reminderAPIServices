const Model = require('objection').Model;
const knex = require('./db');

Model.knex(knex);

class Devices extends Model {
  static get tableName() {
    return 'devices';
  }
}

module.exports = Devices;
