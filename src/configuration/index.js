import _exportConfiguration from './exportConfiguration'
import tracks from './tracks'

export const exportConfiguration = _exportConfiguration

export const updateServerName = (configurationState) =>
  ({serverName}) => configurationState.update('serverName', serverName)

export const listAvailableTracks = () =>
  () => ({ tracks })

export const viewEvent = (configurationState) =>
  ({id}, presenter) => {
    if(configurationState.EventDoesNotExist(id)) return presenter.notFound();

    presenter.track(
      {
        id: "kyalami_2019",
        name: "Kyalami Grand Prix Circuit",
        short_name: "Kyalami",
        variant_name: '2019'
      }
    )
    presenter.raceSession(
      {
        startAt: '18:00',
        startOn: 'Saturday',
        duration: '20',
        timeMultiplier: '2',
        actualDuration: '10',
      }
    )
    presenter.nonRaceSession(
      {
        startAt: '06:00',
        startOn: 'Friday',
        duration: '10',
        timeMultiplier: '1',
        actualDuration: '10',
        type: 'Practice'
      }
    )
    presenter.nonRaceSession(
      {
        startAt: '12:00',
        startOn: 'Friday',
        duration: '10',
        timeMultiplier: '1',
        actualDuration: '10',
        type: 'Qualifying'
      }
    )
    presenter.done()
  }

export const createEvent = (configurationState) =>
  ({track_id}) => ({id: configurationState.newEvent() })

export const listEvents = (configurationState) =>
  (_, presenter) => {
      let events = configurationState.getEvents();
      events.forEach((event) => presenter.event({id: event.id}))
      presenter.done()
  }