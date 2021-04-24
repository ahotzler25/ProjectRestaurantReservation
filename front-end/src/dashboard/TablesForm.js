import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import axios from "axios";

export default function TablesForm() {
    let history = useHistory();

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

    const [ tableError, setTableError ] = useState(null);
    const [ newTable, setNewTable ] = useState({
        table_name: "",
        capacity: "",
        table_nameError: "",
        capacityError: "",
    });

    const { table_name, capacity } = newTable;

    const changeHandler = ({ target }) => { 
        setNewTable({
            ...newTable,
            [target.name]: target.value
        });
    };

    const submitHandler = (event) => {
        event.preventDefault();

        const table = {table_name, capacity: Number(capacity)};
        axios
            .post(`${API_BASE_URL}/tables`, { data: table })
            .then((response) => response.status === 201 ? history.push("/dashboard") : null )
            .catch((err) => {
                console.error(err.response.data.error);
                setTableError({ message: err.response.data.error });
            });
    };

    const cancelHandler = () => {
        history.goBack();
    };

    return (
        <div className="container pt-5">
            <div className="container bg-secondary text-light p-0" 
                style={{ maxWidth: "550px", borderRadius: "10px", height: "240px" }}
            >
                <h1 className="card-header text-center border-info">Create a table</h1>
                <form onSubmit={submitHandler}>
                    <div className="row justify-content-center mt-2">
                        <input
                            type="name"
                            name="table_name"
                            placeholder="Enter a table name"
                            className="form-control"
                            value={table_name}
                            onChange={changeHandler}
                            style={{ width: "75%" }}
                        />
                        <input
                            type="number"
                            name="capacity"
                            placeholder="Capacity"
                            className="form-control my-3"
                            value={capacity}
                            onChange={changeHandler}
                            style={{ width: "75%" }}
                        />
                    </div>
                    <div className="text-center">
                        <button type="submit" className="btn btn-info text-dark mr-1">
                            Submit
                        </button>
                        <button onClick={cancelHandler} className="btn btn-dark ml-1">
                            Cancel
                        </button>
                    </div>
                </form>
                <ErrorAlert error={tableError} />
            </div>
        </div>
    );
};