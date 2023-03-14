import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import axios from "axios";
import ReservationForm from "./ReservationForm";
import ErrorAlert from "../layout/ErrorAlert";
import { formatAsDate } from "../utils/date-time";

function EditReservation() {
  const url = process.env.REACT_APP_API_BASE_URL;
  const { reservation_id } = useParams();
  const [existingReservation, setExistingReservation] = useState(null);
  const[error, setError] = useState(null);
  
  //get the record that matches the "reservation_id"
  //if any matching record found, set it as existingReservation and if not set the error to display
  useEffect(() => {
    const abortController = new AbortController();
    axios
      .get(`${url}/reservations/${reservation_id}`, {
        signal: abortController.signal,
      })
      .then((response) =>
        setExistingReservation({
          ...response.data.data,
          reservation_date: formatAsDate(response.data.data.reservation_date),
        })
      )
      .catch(setError);

    return () => abortController.abort();
  }, [url, reservation_id]);

  //if an existing reservation is found, display the reservationForm in "editMode"
  return (
    <div>
      <h1 className="my-4">Edit Reservation</h1>
      <ErrorAlert error={error} />
      {existingReservation && (
        <ReservationForm
          existingReservation={existingReservation}
          editMode={true}
        />
      )}
    </div>
  );
}

export default EditReservation;
