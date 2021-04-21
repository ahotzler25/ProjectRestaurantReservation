const knex = require("../db/connection");

async function list(date) {
    return await knex('reservations')
        .select('*')
        .where({ reservation_date: date })
        .whereNotIn('status', ['cancelled', 'finished'])
        .orderBy('reservation_time');
};

function create(newReservation) {
    return knex('reservations')
        .insert(newReservation)
        .returning('*');
};

function listByMobileNumber(mobile_number) {
    return knex('reservations')
        .whereRaw(
            "translate(mobile_number, '() -', '') like ?",
            `%${mobile_number.replace(/\D/g, '')}%`
        )
        .orderBy('reservation_date');
};

module.exports = {
    list,
    create,
    listByMobileNumber,
}