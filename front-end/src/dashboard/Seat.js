import React from "react";
import axios from "axios";

export default function Seat({table}) {
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

    const finishHandler = (event) => {
        event.preventDefault();

        if(window.confirm(
            "Is this table ready to seat new guests? This cannot be undone."
            )
        ) {
            axios
                .delete(`${API_BASE_URL}/tables/${table.table_id}/seat`)
                .then((response) => response.status === 200 ? window.location.reload() : 0
            )
                .catch(console.error);
        };
    };

    return (
        <div className="card bg-secondary col-lg-3 p-0 m-1 border-info text-center">
            <div className="card-header border-info text-light">
                {table.table_name}
            </div>
            <div className="card-body text-light">
                <h4 data-table-id-status={`${table.table_id}`}>
                    This table is:{' '}
                    <span className="badge badge-info">
                        {table.occupied ? "Occupied" : "Free"}
                    </span>
                </h4>
                <h6 className="card-subtitle mb-2 text-light">
                    Capacity: {table.capacity}
                </h6>
                {table.reservation_id && (
                    <button
                        data-table-id-finish={table.table_id}
                        className="btn btn-info text-dark"
                        onClick={finishHandler}
                    >
                    Finish
                    </button>
                )}
            </div>
        </div>
    );
};