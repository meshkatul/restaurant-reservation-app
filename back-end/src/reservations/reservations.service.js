const knex = require("../db/connection");

function list(reservation_date){
    return knex("reservations")
        .select("*")
        .where({ reservation_date })
        .whereNot({ status: "finished" })
        .orderBy("reservation_time");
}

function search(mobile_number) {
    return knex("reservations")
      .whereRaw(
        "translate(mobile_number, '() -', '') like ?",
        `%${mobile_number.replace(/\D/g, "")}%`
      )
      .orderBy("reservation_date");
  }

  function create(reservation){
    return knex("reservations")
        .insert(reservation)
        .returning("*")
        .then((createdRecords) => createdRecords[0]);
  }

  function read(reservationId){
    return knex("reservations")
        .select("*")
        .where({ reservation_id: reservationId })
        .first();
  }

  function update(updatedReservation){
    return knex("reservations")
        .select("*")
        .where({ reservation_id: updatedReservation.reservation_id})
        .update(updatedReservation, "*")
        .then((updatedRecords) => updatedRecords[0]);
  }

  function updateStatus(reservationId, updatedStatus){
    return knex("reservations")
        .select("*")
        .where({ reservation_id: reservationId })
        .update({ status: updatedStatus }, "*")
        .then((updatedRecords) => updatedRecords[0]);
  }

module.exports = {
    list,
    search,
    create,
    read,
    update,
    updateStatus
}