import React, { useEffect, useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import formatPhoneNumber from "../utils/format-phone-number";
import { listReservations } from "../utils/api";
import ReservationsList from "../reservations/ReservationsList";

function SearchForm() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [error, setError] = useState(null);
  const [reservations, setReservations] = useState("");
  const [reservationsDisplay, setReservationsDisplay] = useState("");

  useEffect(() => {
    const abortController = new AbortController();
    setError(null);
    async function listMatchingReservations() {
      try {
        if (reservations.length) {
          setReservationsDisplay(
            <ReservationsList reservations={reservations} searchMode={true} />
          );
        } else if(reservations !== "") {
          setReservationsDisplay(
            <div className="alert alert-info">No reservations found</div>
          );
        }
      } catch (error) {
        setError(error);
      }
    }
    listMatchingReservations();
    return () => abortController.abort();
  }, [reservations]);

  function loadReservations() {
    const abortController = new AbortController();
    setError(null);
    listReservations(
      { mobile_number: mobileNumber },
      abortController.signal
    )
      .then(setReservations)
      .catch(error);
    return () => abortController.abort();
  }

  const handleChange = (event) => {
    const formattedPhoneNumber = formatPhoneNumber(event.target.value);
    setMobileNumber(formattedPhoneNumber);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    loadReservations();
  };

  return (
    <div>
      <ErrorAlert error={error} />
      <form onSubmit={handleSubmit}>
        <div className="input-group mb-3">
          <label className="sr-only" htmlFor="mobile_number">
            Mobile Number
          </label>
          <input
            name="mobile_number"
            type="text"
            id="mobile_number"
            placeholder="Enter a customer's phone number"
            className="form-control"
            style={{ maxWidth: 300 }}
            required={true}
            value={mobileNumber}
            onChange={handleChange}
          />
          <div className="input-group-append">
            <button type="submit" className="btn btn-primary mb-3">
              <span className="oi oi-magnifying-glass mr-2" />
              Find
            </button>
          </div>
        </div>
      </form>
      <div>
        <ErrorAlert error={error} />
        {reservationsDisplay}
      </div>
    </div>
  );
}

export default SearchForm;
