import React from "react";
import ReservationForm from "./ReservationForm";

//use the "reservation form" to create new reservation
function CreateReservation(){
    return (
        <div>
            <h1 className="my-4">New Reservation</h1>
            <ReservationForm />
        </div>
    )
}

export default CreateReservation;