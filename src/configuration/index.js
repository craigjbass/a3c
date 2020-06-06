import _exportConfiguration from './exportConfiguration'
import tracks from './tracks'
import {v4 as uuid} from 'uuid';
import trackDefaults from "./trackDefaults";
import { DateTime, Duration, Interval } from 'luxon';

export const exportConfiguration = _exportConfiguration

export const listAvailableTracks = () =>
  () => ({tracks})

export const viewEvent = (configurationState) =>
  ({id}, presenter) => {
    if (configurationState.eventDoesNotExist(id)) return presenter.notFound();

    const event = configurationState.getEvent(id)
    const track = tracks.find((value => {
      return value.variants.find((variant) => variant.track_id === event.track_id) !== undefined
    }))

    const variant = track.variants.find((v) => v.track_id === event.track_id)

    presenter.weather({temperature: trackDefaults[track.id].temperature})

    presenter.track(
      {
        id: event.track_id,
        name: track.name,
        image_id: track.id,
        short_name: track.short_name,
        variant_name: variant.variant_name
      }
    )
    const p = (presenter) => (session) => {
      const startTime = DateTime.fromObject({hour: session.startAt.slice(0, 2)})
      const endTime = startTime.plus(Duration.fromMillis(session.actualDuration * session.timeMultiplier * 60000))
      const endAt = endTime.toFormat("HH:mm")
      presenter({...session, endAt})
    }
    event.raceSessions.forEach(p(presenter.raceSession.bind(presenter)))
    event.nonRaceSessions.forEach(p(presenter.nonRaceSession.bind(presenter)))

    presenter.done(event.name)
  }

export const createEvent = (configurationState) =>
  ({track_id}) => ({
    id: configurationState.newEvent({
      track_id,
      nonRaceSessions: [
        {
          id: uuid(),
          startAt: '10:00',
          startOn: 'Saturday',
          timeMultiplier: '6',
          actualDuration: '10',
          type: 'Practice'
        },
        {
          id: uuid(),
          startAt: '15:00',
          startOn: 'Saturday',
          timeMultiplier: '5',
          actualDuration: '10',
          type: 'Qualifying'
        }
      ],
      raceSessions: [
        {
          id: uuid(),
          startAt: '11:00',
          startOn: 'Sunday',
          timeMultiplier: '3',
          actualDuration: '20',
        }
      ]
    })
  })

export const listEvents = (configurationState) =>
  (_, presenter) => {
    let events = configurationState.getEvents();
    events.forEach((event) => {
        const track_name = tracks.find((value => {
          return value.variants.find((variant) => variant.track_id === event.track_id) !== undefined
        })).short_name
        presenter.event({id: event.id, name: event.name || 'untitled', track_name: track_name});
      }
    )
    presenter.done()
  }

export const updateEventName = (configurationState) =>
  ({id, name}) => configurationState.update(id, (event) => ({...event, name}))

export const deleteEvent = (configurationState) =>
  ({id}) => configurationState.delete(id)

export const deleteSessionFromEvent = (configurationState) => {
  return ({eventId, sessionId}) => {
    configurationState.update(eventId, event => {
      let nonRaceSessions = event.nonRaceSessions.filter(s => s.id !== sessionId);
      let raceSessions = event.raceSessions.filter(s => s.id !== sessionId);
      return ({
        ...event,
        nonRaceSessions: nonRaceSessions.length > 0 ? nonRaceSessions : event.nonRaceSessions,
        raceSessions: raceSessions.length > 0 ? raceSessions : event.raceSessions
      });
    })
  };
}

export const editSession = (configurationState) =>
  ({eventId, id, startAt, startOn, timeMultiplier, actualDuration}, {success, error}) => {

    const event = configurationState.getEvent(eventId)

    const intervals = event.nonRaceSessions.map((s) => {
      return Interval.after(DateTime.fromObject({
        year: 2020,
        month: 6,
        day: ['Friday', 'Saturday', 'Sunday'].indexOf(s.startOn) + 5,
        hour: s.startAt.slice(0, 2)
      }), Duration.fromMillis(s.actualDuration * 60000 * s.timeMultiplier))
    })
    
    const newSessionTime = DateTime.fromObject({
      year: 2020,
      month: 6,
      day: ['Friday', 'Saturday', 'Sunday'].indexOf(startOn) + 5,
      hour: startAt.slice(0, 2)
    })

    const newSessionInterval = Interval.after(newSessionTime, Duration.fromMillis(
      actualDuration * 60000 * timeMultiplier
    ))

    const afters = intervals.map(i => i.isAfter(newSessionTime))
    const overlappers = intervals.map(i => i.overlaps(newSessionInterval))
    if(afters.includes(true)) {
      error("RACE_OCCURS_BEFORE_NON_RACE")
      return
    }

    if(overlappers.includes(true)) {
      error("EVENTS_OVERLAP")
      return
    }

    configurationState.update(eventId, (event) => {
      const raceSessionsId = event.raceSessions.findIndex((s) => s.id === id)
      const nonRaceSessionsId = event.nonRaceSessions.findIndex((s) => s.id === id)
      let session
      if(raceSessionsId !== -1) {
        session = event.raceSessions[raceSessionsId]
      } else {
        session = event.nonRaceSessions[nonRaceSessionsId]
      }

      session.startAt = startAt.slice(0, 2) + ':00'
      session.startOn = startOn
      session.timeMultiplier = timeMultiplier
      session.actualDuration = actualDuration
      return {...event}
    })
    success()
  }