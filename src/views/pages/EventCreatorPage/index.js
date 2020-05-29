import React, {useState, useEffect} from "react";
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
  AnchorButton,
  Button,
  Spinner,
  NonIdealState,
  Intent,
  Tag
} from "@blueprintjs/core";

import './EventCreatorPage.css'

export default ({Layout, viewEvent, navigate}) =>
  ({trackId}) => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [event, setEvent] = useState({state: 'loading', raceSessions: [], nonRaceSessions: []})

    useEffect(() => {
        if (event.state === 'not-found') return
        if (event.state === 'done') return

        viewEvent(
          {id: trackId},
          {
            notFound: () => setEvent({state: 'not-found'}),
            done: () => setEvent((e) => ({...e, state: 'done'})),
            track: (track) => setEvent((e) => ({...e, track})),
            raceSession: (session) => setEvent((e) => ({...e, raceSessions: [session].concat(e.raceSessions)})),
            nonRaceSession: (session) => setEvent((e) => ({...e, nonRaceSessions: [session].concat(e.nonRaceSessions)})),
          }
        )
      },
      [event, trackId ])


    if (event.state === 'loading') return <Layout>
      <Spinner size="100"/>
    </Layout>

    if (event.state === 'not-found') return <Layout>
      <NonIdealState title="(404) Could not find event."
                     icon="heart-broken"
                     action={
                       <AnchorButton intent={Intent.PRIMARY}
                                     onClick={() => navigate("/")}>
                         Choose track
                       </AnchorButton>
                     }/>
    </Layout>

    return <Layout>
      <Breadcrumbs
        items={[
          {icon: "list", text: "Choose track"},
          {icon: "list-detail-view", text: "Event editor"}
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
            {event.raceSessions.map((session) => <Card elevation={Elevation.TWO}
                                                       className="sessions_Session">
                <H4>Race ({session.startOn})</H4>
                <p>{session.startAt}</p>
                <p>{session.actualDuration} minutes ({session.duration} minutes @ {session.timeMultiplier}x)</p>
              </Card>
            )}
          </div>
          <H2>Non-race session(s) <ButtonGroup minimal={true}>
            <Button icon="add">Add</Button>
          </ButtonGroup></H2>
          <div className="sessions">
            {event.nonRaceSessions.map((session) => <Card elevation={Elevation.TWO}
                                                          className="sessions_Session">
                <H4>{session.type} ({session.startOn})</H4>
                <p>{session.startAt}</p>
                <p>{session.actualDuration} minutes</p>
              </Card>
            )}
          </div>

        </div>
        <div>
          <H1>{event.track.name}</H1>
          <Tag large={true}>{event.track.variant_name}</Tag>
          <img alt="" src={`/tracks/${event.track.short_name}.png`} width="100%"/>
        </div>

      </div>
      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)}/>
    </Layout>;
  }