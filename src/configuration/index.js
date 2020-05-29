import _exportConfiguration from './exportConfiguration'
import tracks from './tracks'
import { v4 as uuid } from 'uuid';

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

    presenter.track(
      {
        id: event.track_id,
        name: track.name,
        image_id: track.id,
        short_name: track.short_name,
        variant_name: variant.variant_name
      }
    )
    event.raceSessions.forEach(presenter.raceSession.bind(presenter))
    event.nonRaceSessions.forEach(presenter.nonRaceSession.bind(presenter))

    presenter.done(event.name)
  }

export const createEvent = (configurationState) =>
  ({track_id}) => ({
    id: configurationState.newEvent({
      track_id,
      nonRaceSessions: [
        {
          id: uuid(),
          startAt: '06:00',
          startOn: 'Friday',
          duration: '10',
          timeMultiplier: '1',
          actualDuration: '10',
          type: 'Practice'
        },
        {
          id: uuid(),
          startAt: '12:00',
          startOn: 'Friday',
          duration: '10',
          timeMultiplier: '1',
          actualDuration: '10',
          type: 'Qualifying'
        }
      ],
      raceSessions: [
        {
          id: uuid(),
          startAt: '18:00',
          startOn: 'Saturday',
          duration: '20',
          timeMultiplier: '2',
          actualDuration: '10',
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
    configurationState.update(eventId, event => ({
      ...event,
      nonRaceSessions: event.nonRaceSessions.filter(s => s.id !== sessionId),
      raceSessions: event.raceSessions.filter(s => s.id !== sessionId)
    }))
  };
}