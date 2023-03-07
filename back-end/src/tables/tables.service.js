const knex = require("../db/connection");

function list() {
  return knex("tables").select("*").orderBy("table_name");
}

function read(tableId) {
  return knex("tables").select("*").where({ table_id: tableId }).first();
}

function create(table) {
  return knex("tables")
    .insert(table)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

async function updateTableAsSeated(tableId, reservationId) {
  try {
    const trx = await knex.transaction();

    return trx("tables")
      .where({ table_id: tableId })
      .update({ reservation_id: reservationId })
      .then(function () {
        return trx("reservations")
          .where({ reservation_id: reservationId })
          .update({ status: "seated" });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  } catch (error) {
    return error;
  }
}

async function updateTableAsFinished(tableId, reservationId) {
  try {
    const trx = await knex.transaction();

    return knex("tables")
      .select("*")
      .where({ table_id: tableId })
      .update({ reservation_id: null })
      .then(function () {
        return trx("reservations")
          .where({ reservation_id: reservationId })
          .update({ status: "finished" });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  } catch (error) {
    return error;
  }
}

module.exports = {
    list,
    read,
    create,
    updateTableAsSeated,
    updateTableAsFinished
}
