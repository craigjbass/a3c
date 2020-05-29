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

export default ({Layout, viewEvent, exportConfiguration, navigate}) => {
  const download = (eventId) => exportConfiguration({event_id: eventId})
  const preview = (eventId) => navigate(`/events/${eventId}/preview`)

  return ({id: eventId}) => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [event, setEvent] = useState({state: undefined, raceSessions: [], nonRaceSessions: []})

    useEffect(() => {
      if (event.state === 'not-found') return
      if (event.state === 'done') return
      if (event.state === 'loading') return

      setEvent((e) => ({...e, state: 'loading'}))
      viewEvent(
        {id: eventId},
        {
          notFound: () => setEvent((e) => ({...e, state: 'not-found'})),
          done: () => setEvent((e) => ({...e, state: 'done'})),
          track: (track) => setEvent((e) => ({...e, track})),
          raceSession: (session) => setEvent((e) => ({...e, raceSessions: [session].concat(e.raceSessions)})),
          nonRaceSession: (session) => setEvent((e) => ({...e, nonRaceSessions: [session].concat(e.nonRaceSessions)})),
        }
      )
    }, [event, eventId])


    if ([undefined, 'loading'].includes(event.state)) return <Layout>
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

    return <Layout contextual={
      <>
        <Button icon="cloud-download"
                onClick={() => download(eventId)}>
          Export
        </Button>
        <Button icon="lab-test"
                onClick={() => preview(eventId)}>
          Preview
        </Button>
      </>
    }>
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
          <img alt="" src={`/tracks/${event.track.image_id}.png`} width="100%"/>
        </div>

      </div>
      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)}/>
    </Layout>
  };
}