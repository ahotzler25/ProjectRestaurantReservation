import React from "react";
import { Navbar, Nav } from "react-bootstrap";

export default function Menu() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand href="/dashboard" className="nav-bar-header">
        Periodic Tables
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto top-nav-links">
          <Nav.Link href="/dashboard">Dashboard</Nav.Link>
          <Nav.Link href="/search">Search</Nav.Link>
          <Nav.Link href="/reservations/new">New Reservation</Nav.Link>
          <Nav.Link href="/tables/new">New Table</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};
