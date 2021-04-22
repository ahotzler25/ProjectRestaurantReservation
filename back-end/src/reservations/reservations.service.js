const knex = require("../db/connection");

function listByMobileNumber(mobile_number) {
    return knex("reservations")
        .whereRaw(
            "translate(mobile_number, '() -', '') like ?",
            `%${mobile_number.replace(/\D/g, '')}%`
        )
        .orderBy("reservation_date");
};

function updateStatus(reservation_id, status) {
    return knex("reservations")
        .where("reservation_id", reservation_id)
        .update({ status: status })
        .returning("status");
};

function create(newReservation) {
    return knex("reservations")
    .insert(newReservation)
    .returning("*");
};

function read(reservation_id) {
    return knex("reservations")
        .select("*")
        .where("reservation_id", reservation_id)
        .first();
};

function update(reservation_id, updatedReservated) {
    return knex("reservations")
        .where("reservation_id", reservation_id)
        .update(updatedReservation)
        .returning([
            "first_name",
            "last_name",
            "mobile_number",
            "people",
            "reservation_date",
            "reservation_time"
        ]);
};

function list(date) {
    return knex("reservations")
        .select("*")
        .whereNotIn("status", "finished")
        .andWhere( "reservation_date", date )
        .orderBy("reservation_time");
};

module.exports = {
    listByMobileNumber,
    updateStatus,
    create,
    read,
    update,
    list
};