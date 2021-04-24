import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import axios from "axios";

export default function ReservationForm() {
    let history = useHistory();
    const [ reservationsError, setReservationsError ] = useState(null);

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

    const initialState = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: ""
    };

    // Must initialize this state after initialState declaration
    const [ newReservation, setNewReservation ] = useState(initialState);
    
    const { 
        first_name,
        last_name,
        mobile_number,
        reservation_date,
        reservation_time,
        people
    } = newReservation;

    const changeHandler = ({ target }) => {
        setNewReservation({ ...newReservation, [target.name]: target.value });
    };

    const submitHandler = async(event) => {
        event.preventDefault();

        const reservation = {
            first_name,
            last_name,
            mobile_number,
            reservation_date,
            reservation_time,
            people: Number(people)
        };

        axios
            .post(`${API_BASE_URL}/reservations`, { data: reservation })
            .then((response) => response.status === 201 ? history.push(`/dashboard?date=${reservation_date}`) : null)
            .catch((err) => {
                console.log(err.response.data.error);
                setReservationsError({ message: err.response.data.error });
            });
    };

    const cancelHandler = (event) => {
        event.preventDefault();
        history.goBack();
    };

    return (
        <div className="container pt-5">
            <div className="container card bg-secondary p-0 pb-2" style={{ maxWidth: "600px", borderRadius: "10px", height: "100%" }}>
                <h1 className="card-header text-center text-light border-info p-0 pb-2">
                    Create a Reservation
                </h1>
                <form onSubmit={submitHandler}>
                    <div className="form-row font-weight-bold pl-2 pr-2 mt-1" style={{ color: "#222831" }}>
                        <div className="form-group col-md-6">
                            <label htmlFor="first_name">First Name: </label>
                            <input
                                type="name"
                                id="first_name"
                                name="first_name"
                                placeholder="First Name"
                                className="form-control"
                                value={first_name}
                                onChange={(event) => changeHandler(event)}
                                required 
                            />
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="last_name">Last Name: </label>
                            <input
                                type="name"
                                name="last_name"
                                id="last_name"
                                placeholder="Last Name"
                                className="form-control"
                                value={last_name}
                                onChange={(event) => changeHandler(event)}
                                required 
                            />
                        </div>
                    </div>
                    <div className="form-row font-weight-bold pl-2 pr-2" style={{ color: "#222831" }}>
                        <div className="form-group col-md-6">
                            <label htmlFor="mobile_number">Phone Number: </label>
                            <input
                                type="tel"
                                name="mobile_number"
                                id="mobile_number"
                                placeholder="xxx-xxx-xxxx"
                                className="form-control"
                                value={mobile_number}
                                onChange={(event) => changeHandler(event)}
                                required
                            />
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="people">Party Size: </label>
                            <input
                                type="number"
                                min="1"
                                name="people"
                                id="people"
                                placeholder="10"
                                className="form-control"
                                value={people}
                                onChange={(event) => changeHandler(event)}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-row font-weight-bold pl-2 pr-2" style={{ color: "#222831" }}>
                        <div className="form-group col-md-6">
                            <label htmlFor="reservation_date">Reservation Date: </label>
                            <input
                                type="date"
                                id="reservation_date"
                                name="reservation_date"
                                className="form-control"
                                value={reservation_date}
                                onChange={(event) => changeHandler(event)}
                                required
                            />
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="reservation_time">Enter a Time: </label>
                            <input
                                type="time"
                                name="reservation_time"
                                className="form-control"
                                value={reservation_time}
                                onChange={(event) => changeHandler(event)}
                                pattern="[0-9]{2}:[0-9]{2}"
                                required
                            />
                        </div>
                    </div>
                    <div className="text-center">
                        <button type="submit" className="btn btn-info mr-1 text-dark">
                            Submit
                        </button>
                        <button className="btn btn-dark ml-1" onClick={cancelHandler}>
                            Cancel
                        </button>
                    </div>
                </form>
                <ErrorAlert error={reservationsError} />
            </div>
        </div>
    );
};