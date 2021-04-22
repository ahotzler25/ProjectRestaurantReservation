const knex = require("../db/connection");

function create(newTable) {
    return knex("tables")
        .insert(newTable)
        .returning("*");
};

function read(table_id) {
    return knex("tables")
        .select("*")
        .where({ table_id: table_id })
        .first();
};

function update(table_id, reservation_id) {
    return knex("tables")
        .where("table_id", table_id)
        .update({ reservation_id: reservation_id, occupied: true })
        .returning("*");
};

function destroy(table_id) {
    return knex("tables")
        .where("table_id", table_id)
        .update({ reservation_id: null, occupied: false })
        .returning("*");
};

function list() {
    return knex("tables")
        .select("*")
        .orderBy("table_name");
};

module.exports = {
    create,
    list,
    read,
    update,
    destroy
};