import React, { useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

export default function SearchReservation() {
    const [ mobile_number, setMobileNumber ] = useState("");
    const [ reservations, setReservations ] = useState([]);
    const [ reservationError, setReservationError ] = useState(null);

    const changeHandler = ({ target }) => {
        setMobileNumber(target.value);
    };

    const reservationsByNumber = reservations.map((reservation, index) => {
        return (
            <div key={index} className="card text-center bg-dark border-info mb-1">
                <div className="card-body p-0">
                    <h5 className="card-header border-info text-light p-2">
                        {reservation.first_name} {reservation.last_name}
                    </h5>
                    <p className="card-text p-1 text-light">
                        Number: {reservation.mobile_number} Date: {" "}
                        {reservation.reservation_date} Time: {reservation.reservation_time}{" "}
                        Party Size: { reservation.people }
                    </p>
                </div>
            </div>
        );
    });

    const searchHandler = (event) => {
        event.preventDefault();

        const abortController = new AbortController();

        listReservations({ mobile_number }, abortController.signal)
            .then(setReservations)
            .then(() => 
                reservationsByNumber.length === 0 
                ? setReservationError({ message: "No reservations found." })
                : setReservationError(null)
            )
            .catch(setReservationError);
    };

    return (
        <div className="container pt-5">
            <div className="card container bg-secondary" style={{ borderRadius: "10px" }}>
                <form onSubmit={searchHandler}>
                    <div className="form-group">
                        <label htmlFor="mobile_number" className="text-light mt-1 h4">
                            Search:
                        </label>
                        <input
                            name="mobile_number"
                            placeholder="Enter the customer's phone number"
                            onChange={changeHandler}
                            className="form-control"
                            required
                        />
                    </div>
                    <button className="btn btn-info mb-2 text-dark" type="submit">
                        Find
                    </button>
                </form>
                {reservationsByNumber.length === 0 && (
                    <ErrorAlert error={reservationError} />
                )}
                <div className="mb-2">{reservationsByNumber}</div>
            </div>
        </div>
    );
};
