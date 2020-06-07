import React from 'react';
import './DefaultLayout.css';
import {Navbar, Button, Alignment, ButtonGroup, Intent} from "@blueprintjs/core";

const ContextualItems = ({contextual}) => {
  const doesNotHaveContextualElements = contextual === undefined;
  if (doesNotHaveContextualElements) return <React.Fragment/>

  return <>
    <Navbar.Divider/>
    <ButtonGroup>
      {contextual}
    </ButtonGroup>
  </>
}

export default ({navigate, quit}) => ({children, contextual}) => (<>
  <Navbar fixedToTop={true} className="navigation-bar bp3-dark">
    <Navbar.Group align={Alignment.LEFT} className="no-drag">
      <Navbar.Heading>A3C</Navbar.Heading>
      <Button minimal={true}
              icon="cog"
              onClick={() => navigate("/server-settings")}/>
      <Button minimal={true}
              icon="list-detail-view"
              onClick={() => navigate("/events")}/>
      <ContextualItems contextual={contextual}/>
    </Navbar.Group>
    <Navbar.Group align={Alignment.RIGHT} className="no-drag">
      <Button icon="cross"
              minimal={true}
              outlined={true}
              intent={Intent.DANGER}
              onClick={() => quit()}/>
    </Navbar.Group>
  </Navbar>
  <div className="navigation-bar-filler" />
  <div className="app-frame">
    {children}
  </div>
</>)
