import React from 'react';
import './DefaultLayout.css';
import {Navbar, Button, Alignment, Intent, ButtonGroup} from "@blueprintjs/core";

export default ({navigate}) =>
  ({children, contextual=<React.Fragment />}) => (<>
    <Navbar>
      <Navbar.Group align={Alignment.LEFT}>
        <Navbar.Heading>A3C</Navbar.Heading>
        <Navbar.Divider/>
        <Button minimal={true}
                icon="list-detail-view"
                text="Event list"
                onClick={() => navigate("/events")}/>
        <Navbar.Divider/>
        <ButtonGroup>
          <Button intent={Intent.PRIMARY}
                  text="Create"
                  onClick={() => navigate("/")}/>
          {contextual}
        </ButtonGroup>
      </Navbar.Group>
    </Navbar>
    <div className="app-frame">
      {children}
    </div>
  </>)
