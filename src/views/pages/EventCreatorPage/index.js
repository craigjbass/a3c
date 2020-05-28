import React, {useState} from "react";
import {
  EditableText,
  H1,
  H2,
  H4,
  Drawer,
  Card,
  Breadcrumbs,
  Elevation,
  ButtonGroup,
  Button
} from "@blueprintjs/core";

import './EventCreatorPage.css'

export default ({Layout}) =>
  ({trackId}) => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    return <Layout>
      <Breadcrumbs
        items={[
          { icon: "list", text: "Choose track" },
          { icon: "list-detail-view", text: "Event editor"}
        ]}
      />
      <div className="event-editor">
        <div>
          <H1 className="event-name">
            <EditableText
              alwaysRenderInput={true}
              maxLength={128}
              placeholder="Untitled event"
              selectAllOnFocus={true}
            />
          </H1>
          <H2>Race session(s) <ButtonGroup minimal={true}>
            <Button icon="add" onClick={() => setDrawerOpen(true)}>Add</Button>
          </ButtonGroup></H2>
          <div className="sessions">
            <Card elevation={Elevation.TWO} className="sessions_Session">
              <H4>Race (Saturday)</H4>
              <p>18:00</p>
              <p>10 minutes (20 minutes @ 2x)</p>
            </Card>
          </div>
          <H2>Non-race session(s) <ButtonGroup minimal={true}>
            <Button icon="add">Add</Button>
          </ButtonGroup></H2>
          <div className="sessions">
            <Card elevation={Elevation.TWO} className="sessions_Session">
              <H4>Practice (Friday)</H4>
              <p>06:00</p>
              <p>10 minutes.</p>
            </Card>
            <Card elevation={Elevation.TWO} className="sessions_Session">
              <H4>Qualifying (Friday)</H4>
              <p>12:00</p>
              <p>10 minutes.</p>
            </Card>
          </div>

        </div>
        <div>
          <H1>Monza</H1>
          <img src="/tracks/Monza.png" width="100%" />
        </div>

      </div>
      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </Layout>;
  }