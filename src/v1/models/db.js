const Knex = require('knex');
const knex = Knex({
    client: 'mysql',
    useNullAsDefault: true,
    connection: {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        password: process.env.DB_PASSWORD,
        port:process.env.DB_PORT,
        database: process.env.DATABASE_NAME,
        decimalNumbers: true
    },
    pool: {
        min: 0,
        max: 150,
    }
});

module.exports = knex;
