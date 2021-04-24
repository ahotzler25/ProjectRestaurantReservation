import React from "react";
import Menu from "./Menu";
import Routes from "./Routes";

import "./Layout.css";

/**
 * Defines the main layout of the application.
 *
 * You will not need to make changes to this file.
 *
 * @returns {JSX.Element}
 */

export default function Layout() {
  return (
      <div>
        <div>
          <Menu />
        </div>
        <div className="app-wrapper">
          <Routes />
        </div>
      </div>
  );
};