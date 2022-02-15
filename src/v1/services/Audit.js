const AuditLogs = require("../models/AuditLogs")

class Audit {
    constructor(user) {
        this.user = user;
    }

    static get types() {
        return {
            onboard: {
                name: 'User Onboard',
                description: 'User first time using extension'
            },
            login: {
                name: 'Login',
                description: 'User logged in'
            },
            create_reminder: {
                name: 'New Reminder Created',
                description: 'User create a new reminder'
            },
            update_reminder: {
                name: 'Reminder Updated',
                description: 'User update reminder'
            },
            delete_reminder: {
                name: 'Reminder Deleted',
                description: 'User delete reminder'
            }
        }
    }


    async log(record) {
        try {
            if (typeof record === "string") record = Audit.types[record]
            await AuditLogs.query().insert({
                user_id: this.user.id,
                action: record.name,
                description: record.description,
                ip: this.user.ip
            })
        } catch (error) {
            console.error(error)
            // @todo, write to a file.
        }
    }
}

module.exports = Audit