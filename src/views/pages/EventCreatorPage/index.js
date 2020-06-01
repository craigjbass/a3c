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
  Tag,
  Position, H5
} from "@blueprintjs/core";

import './EventCreatorPage.css'

const initialState = {state: undefined, raceSessions: [], nonRaceSessions: []};

export default ({Layout, viewEvent, exportConfiguration, updateEventName, deleteEvent, deleteSessionFromEvent, navigate}) => {
  const download = (eventId) => exportConfiguration({event_id: eventId})
  const deletThis = (id) => {
    deleteEvent({id})
    navigate(`/events/`)
  }
  const preview = (eventId) => navigate(`/events/${eventId}/preview`)
  const editEventName = (id, name) => updateEventName({id, name})
  const deleteSession = (sessionId, eventId) => deleteSessionFromEvent({eventId, sessionId})

  return ({id: eventId}) => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [event, setEvent] = useState(initialState)

    useEffect(() => {
      if (event.state === 'not-found') return
      if (event.state === 'done') return
      if (event.state === 'loading') return

      setEvent((e) => ({...e, state: 'loading'}))
      viewEvent(
        {id: eventId},
        {
          notFound: () => setEvent((e) => ({...e, state: 'not-found'})),
          done: (name) => setEvent((e) => ({...e, name, state: 'done'})),
          track: (track) => setEvent((e) => ({...e, track})),
          raceSession: (session) => setEvent((e) => ({...e, raceSessions: [session].concat(e.raceSessions)})),
          nonRaceSession: (session) => setEvent((e) => ({...e, nonRaceSessions: [session].concat(e.nonRaceSessions)})),
          weather: (weather) => setEvent((e) => ({...e, weather: weather}))
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
        <Button intent={Intent.DANGER}
                onClick={() => deletThis(eventId)}>
          Delete
        </Button>
        <Button icon="cloud-download"
                onClick={() => download(eventId)}>
          Export
        </Button>
        <Button icon="eye-open"
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
          <span>
            <H1 className="event-name">
              <EditableText
                alwaysRenderInput={true}
                maxLength={128}
                placeholder="Untitled event"
                selectAllOnFocus={true}
                defaultValue={event.name}
                onConfirm={(name) => editEventName(eventId, name)}
              />
            </H1>
          </span>

          <H2>Race session(s) <ButtonGroup minimal={true}>
            <Button icon="add" onClick={() => setDrawerOpen(true)}>Add</Button>
          </ButtonGroup></H2>
          <div className="sessions">
            {event.raceSessions.map((session) => <Card elevation={Elevation.TWO}
                                                       interactive={true}
                                                       onClick={() => setDrawerOpen(true)}
                                                       className="sessions_Session">
                <H4>Race ({session.startOn}) <Button icon="trash"
                                                     disabled={event.raceSessions.length < 2}
                                                     intent={Intent.DANGER}
                                                     onClick={(e) => {
                                                       e.stopPropagation()
                                                       setEvent(initialState)
                                                       deleteSession(session.id, eventId);
                                                     }}
                                                     minimal={true}/></H4>
                <p>{session.startAt} - {session.endAt}</p>
                <p>{session.actualDuration} minutes @ {session.timeMultiplier}x</p>
              </Card>
            )}
          </div>
          <H2>Non-race session(s) <ButtonGroup minimal={true}>
            <Button icon="add">Add</Button>
          </ButtonGroup></H2>
          <div className="sessions">
            {event.nonRaceSessions.map((session) => <Card elevation={Elevation.TWO}
                                                          interactive={true}
                                                          onClick={() => setDrawerOpen(true)}
                                                          className="sessions_Session">
                <H4>{session.type} ({session.startOn}) <Button icon="trash"
                                                               disabled={event.nonRaceSessions.length < 2}
                                                               intent={Intent.DANGER}
                                                               onClick={(e) => {
                                                                 e.stopPropagation()
                                                                 setEvent(initialState)
                                                                 deleteSession(session.id, eventId);
                                                               }}
                                                               minimal={true}/>
                </H4>
                <p>{session.startAt} - {session.endAt}</p>
                <p>{session.actualDuration} minutes @ {session.timeMultiplier}x</p>
              </Card>
            )}
          </div>
        </div>
        <div className="track-details">
          <H1>{event.track.short_name} ({event.track.variant_name})</H1>
          <H5>{event.track.name}</H5>
          <img alt="" src={`/tracks/${event.track.image_id}.png`} width="100%"/>
          <H2>Weather</H2>
          <Tag large={true}
               round={true}>
            {event.weather.temperature}&deg;
          </Tag>
        </div>

      </div>
      <Drawer isOpen={drawerOpen}
              size={Drawer.SIZE_SMALL}
              position={Position.LEFT}
              onClose={() => setDrawerOpen(false)}/>
    </Layout>
  };
}