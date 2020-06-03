import React from 'react';
import './DefaultLayout.css';
import {Navbar, Button, Alignment, ButtonGroup} from "@blueprintjs/core";

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

export default ({navigate}) => ({children, contextual}) => (<>
  <Navbar fixedToTop={true}>
    <Navbar.Group align={Alignment.LEFT}>
      <Navbar.Heading>A3C</Navbar.Heading>
      <Button minimal={true}
              icon="cog"
              onClick={() => navigate("/server-settings")}/>
      <Button minimal={true}
              icon="list-detail-view"
              onClick={() => navigate("/events")}/>
      <ContextualItems contextual={contextual}/>
    </Navbar.Group>
  </Navbar>
  <div className="app-frame">
    {children}
  </div>
</>)
