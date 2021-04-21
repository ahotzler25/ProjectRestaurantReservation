const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

function isValidReservation(req, res, next) {
  if (!req.body.data) return next({ status: 400, message: "No date selected." });

  const { reservation_date, reservation_time, people, status } = req.body.data;
  const requiredFields = [
    "first_name",
    "last_name",
    "mobile_number",
    "reservation_date",
    "reservation_time",
    "people"
  ];

  for (const field of requiredFields) {
    if (!req.body.data[field]) {
      return next({ status: 400, message: `Invalid input for ${field}.`})
    };
  };

  if (
    !reservation_date.match(/\d{4}-\d{2}-\d{2}/g) ||
    typeof people !== "number" ||
    !reservation_time.match(/[0-9]{2}:[0-9]{2}/g)
  ) {
    return next({ status: 400, message: "Invalid input for reservation_date, reservation_time, or people."
    });
  };

  if (status === "seated") {
    return next({ status: 400, message: "Status can not be seated." });
  };

  if (status === "finished") {
    return next({ status: 400, message: "Status can not be finished." });
  };

  res.locals.validReservation = req.body.data;
  next();
};

function isFutureDate(req, res, next) {
  let newDate = new Date(`${req.body.data.reservation_date} ${req.body.data.reservation_time}`);

  const currentDate = new Date();
  if (newDate.getDay() === 2 || newDate.valueOf() < currentDate.valueOf()) {
    return next({ status: 400, message: "You can only reserve for future dates or when the restaurant is open."});
  };

  next();
};

function isDuringWorkingHours(req, res, next) {
  let time = Number(req.body.data.reservation_time.replace(":", ""));

  if (time < 1030 || time > 2130) {
    return next({ status: 400, message: "Reservations are only applicable from 10:30AM to 9:30PM." });
  };

  next();
};

async function list(req, res, next) {
  const { date, mobile_number } = req.query;
  if (mobile_number) {
    const data = await service.listByMobileNumber(mobile_number);
    return res.json({ data: data });
  };

  const data = await service.list(date);
  res.json({ data });
};

async function create(req, res, next) {
  const validReservation = res.locals.validReservation;
  const newReservation = await service.create(validReservation);
  res.status(201).json({ data: newReservation[0] });
};

module.exports = {
  list,
  create: [
    asyncErrorBoundary(isValidReservation),
    asyncErrorBoundary(isFutureDate),
    asyncErrorBoundary(isDuringWorkingHours),
    asyncErrorBoundary(create),
  ],
};
