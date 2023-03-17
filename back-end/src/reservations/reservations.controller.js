const reservationsService = require("./reservations.service.js");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");

const hasRequiredProperties = hasProperties(
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people"
);

function datePropertyIsValid(req, res, next) {
  const { reservation_date } = req.body.data;
  const dateFormat = /^\d{4}-\d{1,2}-\d{1,2}$/;
  if (dateFormat.test(reservation_date)) {
    return next();
  } else {
    return next({
      status: 400,
      message: `Invalid field: 'reservation_date' must be a valid date.`,
    });
  }
}

function timePropertyIsValid(req, res, next) {
  const { reservation_time } = req.body.data;
  const timeFormat = /\d\d:\d\d/;
  if (timeFormat.test(reservation_time)) {
    return next();
  } else {
    return next({
      status: 400,
      message: `Invalid field: 'reservation_time' must be a valid date.`,
    });
  }
}

function reservationIsNotForTuesday(req, res, next) {
  const { reservation_date } = req.body.data;
  const date = new Date(reservation_date);
  if (date.getUTCDay() !== 2) {
    return next();
  } else {
    return next({
      status: 400,
      message: `Sorry! We are closed on Tuesdays.`,
    });
  }
}

function reservationIsForFuture(req, res, next) {
  const { reservation_date, reservation_time } = req.body.data;
  const now = new Date();
  const reservation = new Date(`${reservation_date} ${reservation_time}`);
  if (reservation > now) {
    return next();
  } else {
    return next({
      status: 400,
      message: `Sorry! Reservations must be for a future time or date.`,
    });
  }
}

function reservationIsForOpenHours(req, res, next) {
  const { reservation_time } = req.body.data;
  if (reservation_time >= "10:30" && reservation_time <= "21:30") {
    return next();
  } else {
    return next({
      status: 400,
      message: `Sorry! Reservations are only available from 10:30am to 9:30pm.`,
    });
  }
}

function peoplePropertyIsValid(req, res, next) {
  const { people } = req.body.data;
  if (typeof people === "number" && people > 0) {
    return next();
  } else {
    return next({
      status: 400,
      message: `Invalid field: 'people' must be at least 1.`,
    });
  }
}

function hasValidStatus(req, res, next) {
  const { status } = req.body.data;
  const currentStatus = res.locals.reservation.status;

  if (currentStatus === "finished" || currentStatus === "cancelled") {
    return next({
      status: 400,
      message: `Reservation status is finished`,
    });
  }
  if (
    status === "booked" ||
    status === "seated" ||
    status === "finished" ||
    status === "cancelled"
  ) {
    res.locals.status = status;
    return next();
  }
  next({
    status: 400,
    message: `Invalid status: ${status}`,
  });
}

function isBooked(req, res, next) {
  const { status } = req.body.data;

  if (status && status !== "booked") {
    return next({
      status: 400,
      message: `Invalid status: ${status}`,
    });
  }
  next();
}

async function reservationExists(req, res, next) {
  const reservation_id =
    req.params.reservation_id || (req.body.data || {}).reservation_id;

  const reservation = await reservationsService.read(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `Reservation ${reservation_id} cannot be found.`,
  });
}

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  const date = req.query.date;
  const mobile_number = req.query.mobile_number;
  const data = await (date
    ? reservationsService.list(date)
    : reservationsService.search(mobile_number));
  res.json({ data });
}

async function read(req, res) {
  const data = res.locals.reservation;
  res.json({ data });
}

async function create(req, res) {
  const data = await reservationsService.create(req.body.data);
  res.status(201).json({ data });
}

async function update(req, res) {
  const updatedRes = {
    ...req.body.data,
    reservation_id: res.locals.reservation.reservation_id,
  };
  const data = await reservationsService.update(updatedRes);
  res.status(200).json({ data });
}

async function updateStatus(req, res) {
  const { status } = res.locals;
  const { reservation_id } = res.locals.reservation;
  const data = await reservationsService.updateStatus(reservation_id, status);
  res.status(200).json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [reservationExists, asyncErrorBoundary(read)],
  create: [
    hasRequiredProperties,
    datePropertyIsValid,
    timePropertyIsValid,
    peoplePropertyIsValid,
    reservationIsNotForTuesday,
    reservationIsForFuture,
    reservationIsForOpenHours,
    isBooked,
    asyncErrorBoundary(create),
  ],
  update: [
    hasRequiredProperties,
    datePropertyIsValid,
    timePropertyIsValid,
    peoplePropertyIsValid,
    reservationIsNotForTuesday,
    reservationIsForFuture,
    reservationIsForOpenHours,
    reservationExists,
    hasValidStatus,
    asyncErrorBoundary(update),
  ],
  updateStatus: [
    reservationExists,
    hasValidStatus,
    asyncErrorBoundary(updateStatus),
  ],
  reservationExists,
};