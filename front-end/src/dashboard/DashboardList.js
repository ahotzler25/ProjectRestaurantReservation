import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function DashboardList({ reservation }) {

    // const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

    const cancelHandler = (event) => {
        event.preventDefault();

        if(window.confirm("Do you want to cancel this reservation?")) {
            axios
            .put(`http://localhost:5000/reservations/${reservation.reservation_id}/status`, {
                    data: { status: "cancelled" }
                })
                .then((response) => response.status === 200 ? window.location.reload() : null)
                .catch(console.error);
        }
    };

    return (
        <div className="card bg-dark col-lg-3 p-0 text-center border-info mt-2 ml-1">
            <div className="card-header text-light border-info">
                <h4>
                    {reservation.first_name} {reservation.last_name}
                </h4>
            </div>
            <div className="card-body">
                <h6 className="card-subtitle mb-2 text-light">
                    Phone Number:&nbsp;{reservation.mobile_number}
                </h6>
                <h6 className="text-light">
                    Reservation Time: &nbsp;{reservation.reservation_time}
                </h6>
                <h6 className="text-light">
                    Party Size: &nbsp;{reservation.people} {reservation.people > 1 ? "Guests" : "Guest"}
                </h6>
                <div data-reservation-id-status={reservation.reservation_id}>
                    <h6 className="text-light">Status: {reservation.status}</h6>
                </div>
                <div>
                    {reservation.status==="booked" && (
                        <div>
                            <Link to={`/reservations/${reservation.reservation_id}/edit`} className="btn btn-info mr-1 text-dark">
                                Edit
                            </Link>
                            <button onClick={cancelHandler} data-reservation-id-cancel={reservation.reservation_id} className="btn btn-info mr-1 text-dark">
                                Cancel
                            </button>
                            <Link to={`/reservations/${reservation.reservation_id}/seat`} className="btn btn-info text-dark">
                                Seat
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};