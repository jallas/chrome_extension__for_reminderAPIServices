const Model = require('objection').Model;
const knex = require('./db');
const ParticipantsModel = require("./Participants");

Model.knex(knex);

class Reminders extends Model {
    static get tableName() {
        return 'reminders';
    }

    static get relationMappings() {
        return {
            participants: {
                relation: Model.HasManyRelation,
                modelClass: ParticipantsModel,
                filter: query => query.select('id', 'email'),
                join: {
                    from: 'reminders.id',
                    to: 'participants.reminders_id'
                }
            }
        }
    }
}

module.exports = Reminders;
