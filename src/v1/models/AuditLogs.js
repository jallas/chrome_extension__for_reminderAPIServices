const Model = require('objection').Model;
const knex = require('./db');

Model.knex(knex);

class AuditLogs extends Model {
    static get tableName() {
        return 'audit_logs';
    }
}

module.exports = AuditLogs;
