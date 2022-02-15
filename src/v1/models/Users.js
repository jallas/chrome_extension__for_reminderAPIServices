const Model = require('objection').Model;
const knex = require('./db');

Model.knex(knex);

class Users extends Model {
    static get tableName() {
        return 'users';
    }
}

module.exports = Users;