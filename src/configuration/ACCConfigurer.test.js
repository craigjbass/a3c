import ConfigurationState from './ConfigurationState'
import expectedDefaults from './_tests/defaults'
import expectedTracks from "./_tests/expectedTracks";
import {
  exportConfiguration,
  listAvailableTracks,
  viewEvent,
  createEvent,
  listEvents,
  updateEventName,
  deleteEvent
} from '.'

const make = () => {
  const configurationState = new ConfigurationState()
  return {
    exportConfiguration: exportConfiguration(configurationState),
    listAvailableTracks: listAvailableTracks(),
    viewEvent: viewEvent(configurationState),
    createEvent: createEvent(configurationState),
    listEvents: listEvents(configurationState),
    updateEventName: updateEventName(configurationState),
    deleteEvent: deleteEvent(configurationState)
  }
}

const expectDotJsonFileToMatchDefaults = (dotJsonFileName, actualConfiguration) => {
  expect(actualConfiguration[dotJsonFileName]).toStrictEqual(expectedDefaults[dotJsonFileName])
}

beforeEach(() => {
  localStorage.clear()
})

test('can view default configuration', () => {
  const {exportConfiguration, createEvent} = make()
  const {id: event_id} = createEvent({track_id: 'mount_panorama_2019'})
  let actualConfiguration = undefined
  const presenter = {
    configurationFiles: (configuration) => {
      actualConfiguration = configuration
    }
  }
  exportConfiguration({event_id}, presenter);
  [
    'configuration.json',
    'settings.json',
    'event.json',
    'eventRules.json',
    'assistRules.json'
  ].forEach(
    (dotJsonFileName) =>
      expectDotJsonFileToMatchDefaults(dotJsonFileName, actualConfiguration)
  )
});

test('can set the track', () => {
  const {exportConfiguration, createEvent} = make()
  const {id: event_id} = createEvent({track_id: 'spa_2019'})
  let actualConfiguration = undefined
  let eventName = undefined
  const presenter = {
    configurationFiles: (configuration, _eventName) => {
      actualConfiguration = configuration
      eventName = _eventName
    }
  }
  exportConfiguration({event_id}, presenter);

  expect(actualConfiguration['event.json']['track']).toBe('spa_2019')
  expect(actualConfiguration['event.json']['metaData']).toBe('spa_2019')
  expect(eventName).toBe('Untitled')
})

test('can list available tracks', () => {
  const {listAvailableTracks} = make()
  const availableTracks = listAvailableTracks()
  expect(availableTracks).toStrictEqual(
    {tracks: expectedTracks}
  )
})

test('can delete event', () => {
  const {createEvent, deleteEvent, viewEvent} = make()

  const {id} = createEvent({track_id: 'kyalami_2019'})

  deleteEvent({id})

  let notFound = false
  const sessionPresenter = {
    notFound: () => notFound = true
  }
  viewEvent({id}, sessionPresenter)

  expect(notFound).toBe(true)
})

test('cannot view an event that does not exist', () => {
  const {viewEvent} = make()
  let wasCalled = false
  const sessionPresenter = {
    notFound: () => wasCalled = true
  }
  viewEvent({id: "fake-id"}, sessionPresenter)

  expect(wasCalled).toBe(true)
})

test('can create a new event', () => {
  const {createEvent, viewEvent} = make()
  const {id} = createEvent({track_id: 'kyalami_2019'})

  const raceSessions = []
  const nonRaceSessions = []
  let track = undefined
  let wasCalled = false
  let isDone = false
  const sessionPresenter = {
    raceSession: (session) => raceSessions.push(session),
    nonRaceSession: (session) => nonRaceSessions.push(session),
    track: (_track) => track = _track,
    notFound: () => wasCalled = true,
    done: () => isDone = true
  }
  viewEvent({id}, sessionPresenter)

  expect(track).toStrictEqual(
    {
      id: "kyalami_2019",
      name: "Kyalami Grand Prix Circuit",
      short_name: "Kyalami",
      image_id: "Kyalami",
      variant_name: '2019'
    }
  )
  expect(wasCalled).toBe(false)
  expect(raceSessions[0]).toStrictEqual(
    {
      startAt: '18:00',
      startOn: 'Saturday',
      duration: '20',
      timeMultiplier: '2',
      actualDuration: '10',
    }
  )

  expect(nonRaceSessions[0]).toStrictEqual(
    {
      startAt: '06:00',
      startOn: 'Friday',
      duration: '10',
      timeMultiplier: '1',
      actualDuration: '10',
      type: 'Practice'
    }
  )
  expect(nonRaceSessions[1]).toStrictEqual(
    {
      startAt: '12:00',
      startOn: 'Friday',
      duration: '10',
      timeMultiplier: '1',
      actualDuration: '10',
      type: 'Qualifying'
    }
  )
  expect(isDone).toBe(true)
})

test('can list all events', () => {
  const {createEvent, listEvents} = make()

  const {id: id1} = createEvent({track_id: 'kyalami_2019'})
  const {id: id2} = createEvent({track_id: 'kyalami_2019'})
  const {id: id3} = createEvent({track_id: 'kyalami_2019'})

  let events = []
  let done = false
  const presenter = {
    event: (event) => events.push(event),
    done: () => done = true
  }

  listEvents({}, presenter)

  expect(events).toStrictEqual(
    [
      {id: id1, name: 'untitled', track_name: 'Kyalami'},
      {id: id2, name: 'untitled', track_name: 'Kyalami'},
      {id: id3, name: 'untitled', track_name: 'Kyalami'}
    ]
  )
  expect(done).toBe(true)
})

test('can create events for different tracks', () => {
  const {createEvent, listEvents} = make()

  const {id: id1} = createEvent({track_id: 'kyalami_2019'})
  const {id: id2} = createEvent({track_id: 'suzuka_2019'})
  const {id: id3} = createEvent({track_id: 'zandvoort_2019'})

  let events = []
  let done = false
  const presenter = {
    event: (event) => events.push(event),
    done: () => done = true
  }

  listEvents({}, presenter)

  expect(events).toStrictEqual(
    [
      {id: id1, name: 'untitled', track_name: 'Kyalami'},
      {id: id2, name: 'untitled', track_name: 'Suzuka'},
      {id: id3, name: 'untitled', track_name: 'Zandvoort'}
    ]
  )
  expect(done).toBe(true)
})

test('can display correct track when viewing event', () => {
  const {createEvent, viewEvent} = make()
  const {id} = createEvent({track_id: 'brands_hatch'})

  let track = undefined
  const sessionPresenter = {
    raceSession: (session) => {
    },
    nonRaceSession: (session) => {
    },
    track: (_track) => track = _track,
    notFound: () => {
    },
    done: () => {
    }
  }
  viewEvent({id}, sessionPresenter)

  expect(track).toStrictEqual(
    {
      id: "brands_hatch",
      name: "Brands Hatch Circuit",
      short_name: "Brands Hatch",
      image_id: "BrandsHatch",
      variant_name: '2018'
    }
  )
})

test('can update event name', () => {
  const {createEvent, viewEvent, listEvents, updateEventName, exportConfiguration} = make()
  const {id} = createEvent({track_id: 'brands_hatch'})
  updateEventName({id, name: "My Great Event"})

  let eventName = undefined
  const sessionPresenter = {
    raceSession: (session) => {
    },
    nonRaceSession: (session) => {
    },
    track: (track) => {

    },
    notFound: () => {
    },
    done: (_eventName) => eventName = _eventName
  }
  viewEvent({id}, sessionPresenter)

  let events = []
  let done = false
  const presenter = {
    event: (event) => events.push(event),
    done: () => done = true
  }
  listEvents({}, presenter)

  let exportEventName = undefined
  const exportPresenter = {
    configurationFiles: (_, _eventName) => {
      exportEventName = _eventName
    }
  }
  exportConfiguration({event_id: id}, exportPresenter);

  expect(eventName).toBe('My Great Event')
  expect(events[0].name).toBe('My Great Event')
  expect(exportEventName).toBe('My Great Event')

})