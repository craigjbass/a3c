import React from 'react';
import './DefaultLayout.css';
import {Navbar, Button, Alignment, Intent} from "@blueprintjs/core";

export default ({navigate}) =>
  ({children}) => (<>
    <Navbar>
      <Navbar.Group align={Alignment.LEFT}>
        <Navbar.Heading>A3C</Navbar.Heading>
        <Navbar.Divider/>
        <Button minimal={true}
                icon="list-detail-view"
                text="Event list"
                onClick={() => navigate("/events")}/>
        <Navbar.Divider/>
        <Button intent={Intent.PRIMARY}
                text="Create"
                onClick={() => navigate("/")}/>
      </Navbar.Group>
    </Navbar>
    <div className="app-frame">
      {children}
    </div>
  </>)
