const tablesService = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const reservationsService = require("../reservations/reservations.service");

const hasRequiredProperties = hasProperties("table_name", "capacity");
const hasReservationId = hasProperties("reservation_id");

function tableNameIsValid(req, res, next) {
  const { table_name } = req.body.data;
  if (table_name.length > 1) {
    return next();
  } else {
    return next({
      status: 400,
      message: `table_name must be at least two characters long`,
    });
  }
}

function capacityIsValid(req, res, next) {
  const { capacity } = req.body.data;
  if (typeof capacity === "number" && capacity > 0) {
    return next();
  } else {
    return next({
      status: 400,
      message: `capacity must be at least 1`,
    });
  }
}

async function tableExists(req, res, next) {
  const tableId = req.params.table_id;
  const table = await tablesService.read(tableId);
  if (table) {
    res.locals.table = table;
    return next();
  } else {
    return next({
      status: 404,
      message: `Table ${tableId} does not exists.`,
    });
  }
}

async function reservationExists(req, res, next) {
  const reservationId = req.body.data.reservation_id;
  const existingReservation = await reservationsService.read(
    reservationId
  );
  if (existingReservation) {
    res.locals.reservation = existingReservation;
    return next();
  } else {
    return next({
      status: 404,
      message: `Reservation ${reservationId} does not exist.`,
    });
  }
}

function tableHasSufficientCapacity(req, res, next) {
  const capacity = res.locals.table.capacity;
  const people = res.locals.reservation.people;
  if (capacity >= people) {
    return next();
  } else {
    return next({
      status: 400,
      message: `This table does not have sufficient capacity for this reservation.`,
    });
  }
}

function tableIsAvailable(req, res, next) {
  const reserved = res.locals.table.reservation_id;
  if (!reserved) {
    return next();
  } else {
    return next({
      status: 400,
      message: `This table is occupied!`,
    });
  }
}

function tableIsOccupied(req, res, next) {
  const occupied = res.locals.table.reservation_id;
  if (occupied) {
    return next();
  } else {
    return next({
      status: 400,
      message: `This table is not occupied.`,
    });
  }
}

function tableIsNotSeated(req, res, next) {
  const status = res.locals.reservation.status;
  if (status !== "seated") {
    return next();
  } else {
    return next({
      status: 400,
      message: `Table is already seated.`,
    });
  }
}

//handlers for 'table' resources

async function list(req, res){
    const data = await tablesService.list();
    res.json({ data });
}

async function read(req, res){
    const data = res.locals.table;
    res.json({ data });
}

async function create(req, res){
    const data = await tablesService.create(req.body.data);
    res.status(201).json({ data });
}

async function updateTableAsSeated(req, res){
    const tableId = res.locals.table.table_id;
    const reservationId = res.locals.reservation.reservation_id;
    const data = await tablesService.updateTableAsSeated(tableId, reservationId);
    res.status(200).json({ data });
}

async function updateTableAsFinished(req, res){
    const tableId = req.params.table_id;
    const reservationId = res.locals.table.reservation_id;
    const data = await tablesService.updateTableAsFinished(tableId, reservationId);
    res.status(200).json({ data });
}


module.exports = {
    list: asyncErrorBoundary(list),
    read: [asyncErrorBoundary(tableExists), asyncErrorBoundary(read)],
    create: [
        hasRequiredProperties,
        tableNameIsValid,
        capacityIsValid,
        asyncErrorBoundary(create),
    ],
    updateAsSeated: [
        hasReservationId,
        asyncErrorBoundary(tableExists),
        asyncErrorBoundary(reservationExists),
        tableHasSufficientCapacity,
        tableIsAvailable,
        tableIsNotSeated,
        asyncErrorBoundary(updateTableAsSeated),
    ],
    updateAsFinished: [
        asyncErrorBoundary(tableExists),
        tableIsOccupied,
        asyncErrorBoundary(updateTableAsFinished),
    ],
}