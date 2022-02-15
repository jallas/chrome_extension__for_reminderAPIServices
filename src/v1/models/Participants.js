const Model = require('objection').Model;
const knex = require('./db');

Model.knex(knex);

class Participants extends Model {
  static get tableName() {
    return 'participants';
  }
}

module.exports = Participants;
