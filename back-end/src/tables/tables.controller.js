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
    const { table_id } = req.params;
    const table = await service.read(Number(table_id));
    const reservedTable = res.locals.reservation;

    if (table[0].occupied || reservedTable.people > table[0].capacity) {
        return next({ status: 400, message: "Table is occupied or over-capacity." });
    };

    next();
};

async function isValidUpdate(req, res, next) {
    if (!req.body.data || !req.body.data.reservation_id) {
        return next({ status: 400, message: "No data or no reservation_id was sent." });
    };

    const reservation_id = await reservation.read(req.body.data.reservation_id);

    if (!reservation_id.length) {
        return next({ status: 404, message: `${req.body.data.reservation_id} was not found.` });
    };

    if (reservation_id[0].status === "seated") {
        return next({ status: 400, message: `${req.body.data.reservation_id} is already seated.` });
    };

    res.locals.reservation = reservation_id[0];
    next();
};

async function validateTable(req, res, next) {
    const { table_id } = req.params;
    const table = await service.read(Number(table_id));
    const reservated = res.locals.reservation;

    if (table[0].occupied || reservated.people > table[0].capacity) {
        return next({ status: 400, message: "This is over capacity or currently occupied." });
    };

    next();
};

async function validClear(req, res, next) {
    const { table_id } = req.params;
    const table = await service.read(Number(table_id));
    if (!table.length) {
        return next({ status: 404, message: `${table_id} was not found.` });
    };

    if (!table[0].reservation_id) {
        return next({ status: 400, message: `Table ${table_id} is not occupied.` });
    };

    next();
};

// CRUDL Operations
// 
async function create(req, res, next) {
    const newTable = req.body.data;
    const table = await service.create(newTable);
    res.status(201).json({ data: table[0] });
};

async function read(req, res, next) {
    res.json({ data: res.locals.table });
};

async function update(req, res, next) {
    const { table_id }= req.params;
    const reservation_id = req.body.data.reservation_id;
    let updated;

    try {
        updated = await service.update(table_id, reservation_id);
        await reservation.updateStatus(reservation_id, "seated");
    } catch (err) {
        next(err);
    };

    res.status(200).json({ data: updated });
};

async function destroy(req, res, next) {
    const { table_id } = req.params;
    const checkReservation = await service.read(table_id);
    const updatedTable = await service.clearTable(table_id);
    await reservation.updateStatus(checkReservation[0].reservation_id, "finished");

    res.status(200).json({ data: updatedTable });
};

async function list(req, res, next) {
    const data = await service.list();
    res.json({ data: data });
};

module.exports = {
    create: [asyncErrorBoundary(isValidTable), asyncErrorBoundary(create)],
    read: [asyncErrorBoundary(checkId), asyncErrorBoundary(read)],
    update: [
        asyncErrorBoundary(isValidUpdate),
        asyncErrorBoundary(validateTable),
        asyncErrorBoundary(update),
    ],
    delete: [asyncErrorBoundary(validClear), asyncErrorBoundary(destroy)],
    list: [asyncErrorBoundary(list)],
}