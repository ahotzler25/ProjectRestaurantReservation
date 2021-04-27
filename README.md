# Thinkful Final Capstone: Restaurant Reservation System

> A restaurant reservation system for fine dining restaurants. The user is able to: create a new reservation for their customers, keep track of the reservations and tables in/not in use and search for specific reservations by phone number.

[Restaurant Reservation System](https://front-end-lime-one.vercel.app/)

## 💻 Technology Used

HTML, CSS, JavaScript, React, Express, Node.js, PostgreSQL, Knex.js, React Bootstrap, and Bootstrap 4.

## 📸 Screenshots

![Dashboard Tables and Reservations](https://i.imgur.com/Aq8OQVp.png)
![Create a New Reservation](https://i.imgur.com/KgXjmns.png)
![Reserved Tables](screenshots/us-06-seated-after.png)
![Search Through Reservations](screenshots\us-07-search-reservations-submit-valid-before.png)

## API Documentation

| Route                                | Method | Success Status Code | Description                                                                               |
| ------------------------------------ | ------ | ------------------- | ----------------------------------------------------------------------------------------- |
| /reservations                        | GET    | 200                 | Returns all reservations for specified date, ordered by reservation time.                 |
| /reservations                        | POST   | 201                 | Create a new reservation.                                                                 |
| reservations/:reservation_id         | GET    | 200                 | Return a specified reservation by ID.                                                     |
| reservations/:reservation_id         | PUT    | 200                 | Update an already existing reservation by ID.                                             |
| /reservations?date=YYYY-MM-DD        | GET    | 200                 | Returns all reservations for the specified date.                                          |
| /reservations/:reservation_id/status | PUT    | 200                 | Update status' of specified reservation between: booked, seated, cancelled, and finished. |
| /tables                              | GET    | 200                 | Returns all existing tables.                                                              |
| /tables                              | POST   | 201                 | Create a new table.                                                                       |
| /tables/:table_id                    | POST   | 201                 | Return a specified table by ID.                                                           |
| /tables/:table_id/seat               | PUT    | 200                 | Update status' of specified table between: occupied and free.                             |
| /tables/:table_id/seat               | DELETE | 200                 | Deletes occupied status and sets status to be free for specified table.                   |

## 🚀 Get Up and Running

1. Install dependencies.

```
npm install
```

2. In project directory, you can run:

```
npm start
```

3. Optionally, you can connect the React app to the server in the frontend .env file.

```
REACT_APP_API_BASE_URL=http://localhost:5000
```

4. You can connect one or more PostgreSQL databases by adding the database URL to backend .env file.

```
DATABASE_URL=enter-your-production-database-url-here
DATABASE_URL_DEVELOPMENT=enter-your-development-database-url-here
DATABASE_URL_TEST=enter-your-test-database-url-here
DATABASE_URL_PREVIEW=enter-your-preview-database-url-here
LOG_LEVEL=info
```