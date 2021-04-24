import React from "react";
import { Alert } from "react-bootstrap";

export default function NoReservation() {
    const showReservation = true;

    const showMessage = () => {
        if(showReservation) {
            return (
                <Alert show={showReservation}>
                    <Alert.Heading>
                        There are no reservations for this date.
                    </Alert.Heading>
                    <hr />
                </Alert>
            );
        }
    };

    return (
        <div className="d-flex justify-content-center mb-5">
            <div className="mt-5 mb-5" style={{ width: "70%" }}>
                {showMessage()}
            </div>
        </div>
    );
};