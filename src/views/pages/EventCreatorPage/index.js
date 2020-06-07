import React, {useState, useEffect} from "react";
import {
  AnchorButton,
  Breadcrumbs,
  Button,
  ButtonGroup,
  Card,
  Classes,
  Drawer,
  EditableText,
  Elevation,
  FormGroup,
  H1,
  H2,
  H4,
  H5,
  Intent,
  NonIdealState,
  NumericInput,
  Position,
  Radio,
  RadioGroup,
  Spinner,
  Tag,
  Toaster,
} from "@blueprintjs/core";

import '../../../monkeyPatches/fixUncontrolledBehaviourOfNumericInput'
import './EventCreatorPage.css'
import {DateTime} from "luxon";

const initialState = {state: undefined, raceSessions: [], nonRaceSessions: []};

export default ({Layout, viewEvent, exportConfiguration, updateEventName, deleteEvent, deleteSessionFromEvent, navigate, editSession}) => {
  const toaster = Toaster.create({position: "top-right", className: "no-drag"})
  const download = (eventId) => exportConfiguration({event_id: eventId})
  const deletThis = (id) => {
    deleteEvent({id})
    navigate(`/events/`)
  }
  const preview = (eventId) => navigate(`/events/${eventId}/preview`)
  const editEventName = (id, name) => updateEventName({id, name})
  const deleteSession = (sessionId, eventId) => deleteSessionFromEvent({eventId, sessionId})

  return ({id: eventId}) => {
    const [editSessionDrawer, setEditSessionDrawer] = useState({open: false});
    const [event, setEvent] = useState(initialState)

    useEffect(() => {
      if (['not-found', 'done', 'loading'].includes(event.state)) return

      if (event.state === undefined) setEvent((e) => ({...e, state: 'loading'}))

      viewEvent(
        {id: eventId},
        {
          notFound: () => setEvent((e) => ({...e, state: 'not-found'})),
          done: (name) => setEvent((e) => ({...e, name, state: 'done'})),
          track: (track) => setEvent((e) => ({...e, track})),
          raceSession: (session) => setEvent((e) => {
            return ({...e, raceSessions: [session].concat(e.raceSessions)});
          }),
          nonRaceSession: (session) => setEvent((e) => ({...e, nonRaceSessions: [session].concat(e.nonRaceSessions)})),
          weather: (weather) => setEvent((e) => ({...e, weather: weather}))
        }
      )
    }, [event, eventId, editSessionDrawer, setEditSessionDrawer])
    console.log(editSessionDrawer)
    const _editSession = (session) => {
      console.log(session)
      editSession(
        {...session, eventId},
        {
          success: () => {
            setEvent({...event, raceSessions: [], nonRaceSessions: [], state: 'refresh'})
          },
          error: (errorCode) => {
            setEvent({...event, raceSessions: [], nonRaceSessions: [], state: 'refresh'})
            let message
            switch(errorCode) {
              case 'RACE_OCCURS_BEFORE_NON_RACE':
                message = "Races cannot occur before non-race sessions."
                break;
              case 'OVERLAPPING_SESSIONS':
                message = "Race sessions cannot overlap."
                break;
              default:
                message = "Unknown error"
                break;
            }
            toaster.show({message, intent: Intent.DANGER, icon: "warning-sign"})
            console.log(errorCode)
          }
        }
      )
    }

    if ([undefined, 'loading'].includes(event.state)) return <Layout>
      <Spinner size="100"/>
    </Layout>

    if (event.state === 'not-found') return <Layout>
      <NonIdealState title="(404) Could not find event."
                     icon="heart-broken"
                     action={
                       <AnchorButton intent={Intent.PRIMARY}
                                     onClick={() => navigate("/events/new")}>
                         Create
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
            <Button icon="add" onClick={() => setEditSessionDrawer((d) => ({...d, open: true}))}>Add</Button>
          </ButtonGroup></H2>
          <div className="sessions">
            {event.raceSessions.map((session) => <Card elevation={Elevation.TWO}
                                                       interactive={true}
                                                       onClick={() => setEditSessionDrawer((d) => ({...d, open: true, session}))}
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
                                                          onClick={() => setEditSessionDrawer((d) => ({
                                                            ...d,
                                                            open: true,
                                                            session
                                                          }))}
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
      <Drawer isOpen={editSessionDrawer.open}
              size={Drawer.SIZE_SMALL}
              position={Position.LEFT}
              title="Session options"
              onClose={() => setEditSessionDrawer((d) => ({...d, open: false, session: undefined}))}>
        {editSessionDrawer.open ? <div className={Classes.DRAWER_BODY}>
            <div className={Classes.DIALOG_BODY}>
              <h3>{editSessionDrawer.session.startAt} - {editSessionDrawer.session.endAt}</h3>
              <FormGroup label="Start at"
                         helperText="What hour of the day the race starts">
                <NumericInput leftIcon="time"
                              value={parseInt(editSessionDrawer.session.startAt.slice(0, 2), 10)}
                              clampValueOnBlur={true}
                              onValueChange={v => {
                                if(isNaN(v) || v < 0 || v > 23) {
                                  return;
                                }
                                _editSession({
                                  ...editSessionDrawer.session,
                                  startAt: DateTime.fromObject({hour: v}).toFormat("HH:mm")
                                })
                              }}
                              min={0}
                              max={23}
                              stepSize={1}
                              majorStepSize={1}
                              minorStepSize={1}/>
              </FormGroup>
              <FormGroup label="Time multiplier"
                         helperText="How fast time advances.">
                <NumericInput leftIcon="fast-forward"
                              value={parseInt(editSessionDrawer.session.timeMultiplier, 10)}
                              clampValueOnBlur={true}
                              onValueChange={v => {
                                if(isNaN(v) || v <= 0 || v > 23) {
                                  return;
                                }
                                _editSession({
                                  ...editSessionDrawer.session,
                                  timeMultiplier: v
                                })
                              }}
                              min={0}
                              max={24}
                              stepSize={1}
                              majorStepSize={1}
                              minorStepSize={1}/>
              </FormGroup>
              <FormGroup label="Race duration in minutes"
                         helperText="Not affected by time multiplier.">
                <NumericInput leftIcon="flow-end"
                              value={parseInt(editSessionDrawer.session.actualDuration, 10)}
                              clampValueOnBlur={true}
                              onValueChange={v => {
                                if(isNaN(v) || v < 0) {
                                  return;
                                }
                                _editSession({
                                  ...editSessionDrawer.session,
                                  actualDuration: v
                                })
                              }}
                              min={1}
                              stepSize={1}
                              majorStepSize={1}
                              minorStepSize={1}/>
              </FormGroup>
              <RadioGroup
                label="Day"
                onChange={(e) => {
                  _editSession({
                    ...editSessionDrawer.session,
                    startOn: e.currentTarget.value
                  })
                }}
                selectedValue={editSessionDrawer.session.startOn}
              >
                <Radio label="Friday" value="Friday" />
                <Radio label="Saturday" value="Saturday" />
                <Radio label="Sunday" value="Sunday" />
              </RadioGroup>
            </div>
          </div>
          : <></>}

      </Drawer>
    </Layout>
  };
}