import React from 'react';
import './DefaultLayout.css';
import {Navbar, Button, Alignment} from "@blueprintjs/core";

export default ({children}) => (<>
  <Navbar>
    <Navbar.Group align={Alignment.LEFT}>
      <Navbar.Heading>A3C</Navbar.Heading>
      <Navbar.Divider/>
      <Button className="bp3-minimal"
              icon="list-detail-view"
              text="Event designer"/>
    </Navbar.Group>
  </Navbar>
  <div className="app-frame">
    {children}
  </div>
</>)
