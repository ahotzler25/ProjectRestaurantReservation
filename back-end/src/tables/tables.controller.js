const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const reservation = require("../reservations/reservations.service");

async function checkId(req, res, next) {
    const { table_id } = req.params;
    const data = await service.read(table_id);
    if (!data.length) {
        return next({ status: 404, message: `Table ID: ${table_id} not found.` });
    };

    res.locals.table = data;
    next();
};

async function isValidTable(req, res, next) {
    if (!req.body.data) {
        return next({ status: 400, message: "Data is missing." });
    };

    const newTable = req.body.data;

    if (!table_name || !newTable.capacity || !newTable.table_name) {
        return next({ status: 400, message: "Invalid table params, table_name, or the capacity is incorrect." });
    };

    if (newTable.capacity < 1) {
        return next({ status: 400, message: "Must be able to accomodate at least one." });
    };

    if (newTable.table_name.length < 2) {
        return next({ status: 400, message: "Table name must be at least two characters." });
    };

    next();
};

async function create(req, res, next) {
    const data = await service.create(res.locals.newTable);
    res.status(201).json({ data: data[0] });
};

async function read(req, res, next) {
    res.json({ data: res.locals.table });
};

async function update(req, res, next) {
    const data = await service
        .update(req.params.table_id, res.locals.reservation.reservation_id);

    await reservation
        .updateStatus(res.locals.reservation.reservation_id, "seated");

    res.status(200).json({ data: data });
};

async function destroy(req, res, next) {
    const table = await service.read(req.params.table_id);

    if (!table.occupied) {
        return next({ status: 400, message: `${table.table_name} is not occupied.`});
    };

    const data = await service.destroy(table.table_id);
    await reservation.updateStatus(table.reservation_id, "finished");

    res.status(200).json({ data: data });
};

async function list(req, res, next) {
    const data = await service.list();
    res.json({ data: data });
};

module.exports = {
    create: [asyncErrorBoundary(create)],
    read: [asyncErrorBoundary(isValidTable), asyncErrorBoundary(read)],
    update: [
        asyncErrorBoundary(update)
    ],
    delete: [asyncErrorBoundary(checkId), asyncErrorBoundary(destroy)],
    list: [asyncErrorBoundary(list)],
}