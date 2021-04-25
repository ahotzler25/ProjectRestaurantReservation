const tablesService = require("./tables.service");
const reservationService = require("../reservations/reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function checkId(req, res, next) {
    const { table_id } = req.params;
    const data = await tablesService.read(table_id);
    
    if (!data) {
        return next({ status: 404, message: `Table ID: ${table_id} not found.` });
    };

    res.locals.table = data;
    next();
};

async function isValidCapacity(req, res, next) {
    const { table_id } = req.params;
    const table = await tablesService.read(table_id);
    const reservation = res.locals.reservation;

    if (table.capacity < reservation.people) {
        return next({ status: 400, message: `${table.table_name} does not have large enough capacity.` });
    };

    if (table.occupied) {
        return next({ status: 400, message: `${table.table_name} is currently occupied.` });
    };

    next();
};

async function isValidUpdate(req, res, next) {
    if (!req.body.data) return next({ status: 400, message: "Missing data." });

    const { reservation_id } = req.body.data;
    if (!reservation_id) {
        return next({ status: 400, message: "Missing reservation_id." });
    };

    const reservation = await reservationService.read(reservation_id);

    if (!reservation) {
        return next({ status: 404, message: `${reservation_id} was not found.` });
    };

    if (reservation.status === "seated") {
        return next({ status: 400, message: "This reservation has already been seated." });
    };

    res.locals.reservation = reservation;
    next();
};

async function isValidTable(req, res, next) {
    if (!req.body.data) return next({ status: 400, message: "Missing data." });

    const { table_name, capacity, reservation_id } = req.body.data;

    if (!table_name || table_name === "" || table_name.length === 1) {
        return next({ status: 400, message: "Invalid table_name." });
    };

    if (!capacity || capacity < 1 || typeof capacity !== "number") {
        return next({ status: 400, message: "Invalid capacity provided." });
    };

    res.locals.newTable = { table_name, capacity };

    if (reservation_id) {
        res.locals.newTable.reservation_id = reservation_id;
        res.locals.newTable.occupied = true;
    };

    next();
};


// CRUDL Operations
// 
async function create(req, res, next) {
    const data = await tablesService.create(res.locals.newTable);
    res.status(201).json({ data: data[0] });
};

async function read(req, res, next) {
    res.json({ data: res.locals.table });
};

async function update(req, res, next) {
    const table = await tablesService.update(req.params.table_id, res.locals.reservation.reservation_id);
    await reservationService.updateStatus(res.locals.reservation.reservation_id, "seated");

    res.status(200).json({ data: table });
};

async function destroy(req, res, next) {
    const table = await tablesService.read(req.params.table_id);

    if (!table.occupied) {
        return next({ status: 400, message: `${table.table_name} is not occupied.` });
    };

    const data = await tablesService.destroy(table.table_id);
    await reservationService.updateStatus(table.reservation_id, "finished");

    res.status(200).json({ data: data })
};

async function list(req, res, next) {
    const table = await tablesService.list();
    res.json({ data: table });
};

module.exports = {
    create: [
        asyncErrorBoundary(isValidTable), 
        asyncErrorBoundary(create)],
    read: [
        asyncErrorBoundary(checkId), 
        asyncErrorBoundary(read)],
    update: [
        asyncErrorBoundary(isValidUpdate),
        asyncErrorBoundary(isValidCapacity),
        asyncErrorBoundary(update),
    ],
    delete: [
        asyncErrorBoundary(checkId), 
        asyncErrorBoundary(destroy)],
    list: [asyncErrorBoundary(list)],
};