import React from "react";
import ReservationCard from "./ReservationCard";

//need to build the ReservationsCard component to display the list of reservation
//reservation list is different based on search page and dashboard
//all reservations including the "cancelled" ones should return for search page
//for dashboard "cancelled" reservation should not return

function ReservationsList({ reservations, searchMode }) {
  if (searchMode) {
    const reservationsList = reservations.map((reservation) => {
      return (
        <ReservationCard
          key={reservation.reservation_id}
          reservation={reservation}
        />
      );
    });
    return <div>{reservationsList}</div>;
  } else {
    const reservationsList = reservations
      .filter((reservation) => {
        return reservation.status !== "cancelled";
      })
      .map((reservation) => {
        return (
          <ReservationCard
            key={reservation.reservation_id}
            reservation={reservation}
          />
        );
      });
    return <div>{reservationsList}</div>;
  }
}

export default ReservationsList;