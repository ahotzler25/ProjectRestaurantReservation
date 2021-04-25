import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { today } from "../utils/date-time";

import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import SearchReservation from "../dashboard/SearchReservations";
import ReservationForm from "../dashboard/ReservationForm";
import TablesForm from "../dashboard/TablesForm";
import SeatReservation from "../dashboard/SeatReservation";
import EditReservation from "../dashboard/EditReservation";


export default function Routes() {
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard">
        <Dashboard currentDate={today()} />
      </Route>
      <Route exact={true} path="/search">
        <SearchReservation />
      </Route>
      <Route path="/reservations/new">
        <ReservationForm />
      </Route>
      <Route path="/tables/new">
        <TablesForm />
      </Route>
      <Route exact={true} path="/reservations/:reservation_id/seat">
        <SeatReservation />
      </Route>
      <Route path="/reservations/:reservation_id/edit">
        <EditReservation />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
};