const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function checkId(req, res, next) {
  const { reservation_id } = req.params;
  const data = await service.read(reservation_id);

  if (!data) {
    return next({ status: 404, message: `Reservation id: ${reservation_id} cannot be found.` });
  };

  res.locals.reservation = data;
  next();
};

async function validReservation(req, res, next) {
  if (!req.body) return next({ status: 400, message: "Missing data." });

  const {
      first_name,
      last_name,
      mobile_number,
      reservation_date,
      reservation_time,
      people,
      status,
    } = req.body.data;

  if (
    !first_name ||
    !last_name ||
    !mobile_number ||
    !reservation_date ||
    !reservation_time ||
    !people
  )
    return next({
      status: 400,
      message:
        'Must include first name, last name, mobile number, people, reservation date, and reservation time.',
    });

  let today = new Date();
  if (reservation_date.slice(0, 4) < today.getFullYear()) {
    return next({ status: 400, message: "You must choose a future date." });
  }

  let day = new Date(reservation_date).getDay() + 1;
  if (day === 2)
    return next({ status: 400, message: "We are closed on Tuesdays." });

  if (!reservation_date.match(/\d{4}-\d{2}-\d{2}/))
    return next({ status: 400, message: "The reservation date is invalid." });

  if (!reservation_time.match(/\d{2}:\d{2}/))
    return next({ status: 400, message: "The reservation time is invalid." });

  if (typeof people !== 'number')
    return next({ status: 400, message: "People must be a number." });

  if (status === 'seated')
    return next({ status: 400, message: "Status cannot be seated." });

  if (status === 'finished')
    return next({ status: 400, message: "Status cannot be finished." });

  res.locals.newReservation = {
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
  };

  next();
};

function isDuringBusinessHours(req, res, next) {
  const time = Number(req.body.data.reservation_time.replace(":", ""));
  if (time < 1030 || time > 2130) {
    return next({ status: 400, message: "Reservations are only applicable from 10:30AM to 9:30PM." });
  }

  next();
};

async function isValidStatus(req, res, next) {
  const currentStatus = res.locals.reservation.status;
  const { status } = req.body.data;

  if (status === "cancelled") return next();
  
  if (currentStatus === "finished") {
    return next({ status: 400, message: "A finished reservation cannot be updated." });
  };

  if (status !== "booked" && status !== "seated" && status !== "finished") {
    return next({ status: 400, message: "Unknown status." });
  };

  next();
};

async function updateStatus(req, res, next) {
  const { reservation_id } = req.params;
  const { status } = req.body.data;
  const data = await service.updateStatus(reservation_id, status);

  res.status(200).json({ data: { status: data[0] }});
};

async function validUpdate(req, res, next) {
  if (!req.body.data) return next({ status: 400, message: "Missing data." });

  const {
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
  } = req.body.data;

  if (
    !first_name ||
    !last_name ||
    !mobile_number ||
    !reservation_date ||
    !reservation_time ||
    !people
  ) {
    return next({
      status: 400,
      message:
        "Must include first name, last name, mobile number, reservation date, reservation time, and people.",
    });
  };

  if (!reservation_date.match(/\d{4}-\d{2}-\d{2}/)) {
    return next({ status: 400, message: "Invalid reservation date." });
  };

  if (!reservation_time.match(/\d{2}:\d{2}/)) {
    return next({ status: 400, message: "Invalid reservation time." });
  };

  if (typeof people !== "number") {
    return next({ status: 400, message: "People must be a number." });
  };

  res.locals.reservation = {
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
  };
  
  next();
};


async function create(req, res, next) {
  const validReservation = res.locals.validReservation;
  const newReservation = await service.create(validReservation);
  res.status(201).json({ data: newReservation[0] });
};

async function read(req, res, next) {
  res.status(200).json({ data: res.locals.reservation });
};

async function update(req, res, next) {
  const { reservation_id } = req.params;
  const data = await service.update(reservation_id, res.locals.reservation);
  res.status(200).json({ data: data[0] });
};

async function list(req, res, next) {
  const { date, mobile_number } = req.query;

  if (date) {
    const data = await service.list(date);
    res.json({ data: data });
    return;
  };

  if (mobile_number) {
    const data = await service.listByMobileNumber(mobile_number);
    return res.json({ data: data });
  };

  res.json({ data: [] });
};


module.exports = {
  updateStatus: [
    asyncErrorBoundary(checkId),
    asyncErrorBoundary(isValidStatus),
    asyncErrorBoundary(updateStatus),
  ],
  create: [
    asyncErrorBoundary(validReservation),
    asyncErrorBoundary(isDuringBusinessHours),
    asyncErrorBoundary(create),
  ],
  read: [
    asyncErrorBoundary(checkId), 
    asyncErrorBoundary(read)],
  update: [
    asyncErrorBoundary(checkId),
    asyncErrorBoundary(validUpdate),
    asyncErrorBoundary(update),
  ],
  list: [asyncErrorBoundary(list)],
};