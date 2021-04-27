import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import ErrorAlert from '../layout/ErrorAlert';

const EditReservation = () => {
  const [reservation, setReservation] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const { reservation_id } = useParams();
  const history = useHistory();

  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

  const initialState = {
    first_name: '',
    last_name: '',
    mobile_number: '',
    reservation_date: '',
    reservation_time: '',
    people: 0,
  };

  const [formData, setFormData] = useState(initialState);

  const {
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
  } = formData;

  const changeHandler = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const updatedReservation = {
      first_name,
      last_name,
      mobile_number,
      reservation_date,
      reservation_time,
      people: Number(people),
    };

    axios
      .put(`http://localhost:5000/reservations/${reservation_id}`, {
        data: updatedReservation,
      })
      .then((response) =>
        response.status === 200
          ? history.push(`/dashboard?date=${reservation_date.slice(0, 10)}`)
          : null
      )
      .catch((err) => {
        console.log(err.response.data.error);
        setReservationsError({ message: err.response.data.error });
      });
  };

  const cancelHandler = () => {
    history.goBack();
  };

  useEffect(() => {
    const getReservation = async () => {
      const response = await fetch(`http://localhost:5000/reservations/${reservation_id}`);
      const infoFromAPI = await response.json();
      setReservation(infoFromAPI);

      const {
        first_name,
        last_name,
        mobile_number,
        reservation_date,
        reservation_time,
        people,
      } = infoFromAPI.data;

      setFormData({
        first_name: first_name,
        last_name: last_name,
        mobile_number: mobile_number,
        reservation_date: reservation_date,
        reservation_time: reservation_time,
        people: Number(people),
      });
    };
    getReservation();
  }, [API_BASE_URL, reservation_id]);

  return (
    <div className='container pt-5'>
      <div
        className='card container bg-secondary p-0 pb-2'
        style={{ maxWidth: '600px', height: '100%', borderRadius: '10px' }}
      >
        <h1 className='card-header text-center text-light border-info'>
          Edit Reservation
        </h1>
        {reservation.data && (
          <form onSubmit={submitHandler} className='mt-2'>
            <div
              className='form-row font-weight-bold pl-2 pr-2'
              style={{ color: '#222831' }}
            >
              <div className='form-group col-md-6'>
                <label htmlFor='first_name'>First Name:</label>
                <input
                  type='name'
                  id='first_name'
                  name='first_name'
                  placeholder='John'
                  className='form-control'
                  defaultValue={reservation.data.first_name}
                  onChange={changeHandler}
                  required
                />
              </div>
              <div className='form-group col-md-6'>
                <label htmlFor='last_name'>Last Name:</label>
                <input
                  type='name'
                  name='last_name'
                  placeholder='Doe'
                  className='form-control'
                  onChange={changeHandler}
                  defaultValue={reservation.data.last_name}
                  required
                />
              </div>
            </div>
            <div
              className='form-row font-weight-bold pl-2 pr-2'
              style={{ color: '#222831' }}
            >
              <div className='form-group col-md-6'>
                <label htmlFor='mobile_number'>Phone Number:</label>
                <input
                  type='tel'
                  name='mobile_number'
                  placeholder='123-456-7890'
                  className='form-control'
                  onChange={changeHandler}
                  defaultValue={reservation.data.mobile_number}
                  required
                />
              </div>
              <div className='form-group col-md-6'>
                <label htmlFor='people'>Party Size:</label>
                <input
                  type='number'
                  min='1'
                  name='people'
                  placeholder='10'
                  className='form-control'
                  onChange={changeHandler}
                  defaultValue={reservation.data.people}
                  required
                />
              </div>
            </div>
            <div
              className='form-row font-weight-bold pl-2 pr-2'
              style={{ color: '#222831' }}
            >
              <div className='form-group col-md-6'>
                <label htmlFor='reservation_date'>Reservation Date:</label>
                <input
                  type='date'
                  name='reservation_date'
                  className='form-control'
                  onChange={changeHandler}
                  defaultValue={reservation.data.reservation_date.slice(0, 10)}
                  pattern='\d{4}-\d{2}-\d{2}'
                  required
                />
              </div>
              <div className='form-group col-md-6'>
                <label htmlFor='reservation_time'>Enter a time:</label>
                <input
                  type='time'
                  name='reservation_time'
                  className='form-control'
                  onChange={changeHandler}
                  defaultValue={reservation.data.reservation_time}
                  pattern='[0-9]{2}:[0-9]{2}'
                  required
                />
              </div>
            </div>
            <div className='text-center'>
              <button type='submit' className='btn btn-info text-dark mr-1'>
                Submit
              </button>
              <button
                className='btn btn-dark text-light ml-1'
                onClick={cancelHandler}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
        <ErrorAlert error={reservationsError} />
      </div>
    </div>
  );
};

export default EditReservation;