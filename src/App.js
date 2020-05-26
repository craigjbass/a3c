import React from 'react';
import './App.css';
import {Navbar, Button, Alignment} from "@blueprintjs/core";

function App({children}) {
  return (
    <>
      <Navbar>
        <Navbar.Group align={Alignment.LEFT}>
          <Navbar.Heading>A3C</Navbar.Heading>
          <Navbar.Divider/>
          <Button className="bp3-minimal" icon="list-detail-view" text="Event designer"/>
        </Navbar.Group>
      </Navbar>
      <div className="app-frame">
        {children}
      </div>
    </>
  );
}

export default App;
