import expectedDefaults from './_tests/defaults'
import expectedTracks from "./_tests/expectedTracks";
import {ViewEventPresenterSpy} from "./presenterTestDoubles/ViewEventPresenterSpy";
import {ListEventsPresenterSpy} from "./presenterTestDoubles/ListEventsPresenterSpy";
import {ExportConfigurationPresenterSpy} from "./presenterTestDoubles/ExportConfigurationPresenterSpy";
import {make} from '../makeDependencies'

const expectDotJsonFileToMatchDefaults = (dotJsonFileName, actualConfiguration) => {
  expect(actualConfiguration[dotJsonFileName]).toStrictEqual(expectedDefaults[dotJsonFileName])
}

beforeEach(() => {
  localStorage.clear()
})

test('can view default configuration', () => {
  const {exportConfiguration, createEvent} = make()
  const {id: event_id} = createEvent({track_id: 'mount_panorama_2019'})
  const presenter = new ExportConfigurationPresenterSpy()
  exportConfiguration({event_id}, presenter);
  [
    'configuration.json',
    'settings.json',
    'event.json',
    'eventRules.json',
    'assistRules.json'
  ].forEach(
    (dotJsonFileName) =>
      expectDotJsonFileToMatchDefaults(dotJsonFileName, presenter.configuration)
  )
});

test('sets event overtime as 15% more than real world record.', () => {
  const {exportConfiguration, createEvent} = make()
  const {id: event_id} = createEvent({track_id: 'spa_2019'})
  const presenter = new ExportConfigurationPresenterSpy()

  exportConfiguration({event_id}, presenter);

  const actualConfiguration = presenter.configuration
  expect(actualConfiguration['event.json']['sessionOverTimeSeconds']).toBe(159)
})

test('sets temperature based on defaults.', () => {
  const {exportConfiguration, createEvent} = make()
  const {id: event_id} = createEvent({track_id: 'spa_2019'})
  const presenter = new ExportConfigurationPresenterSpy()

  exportConfiguration({event_id}, presenter);

  const actualConfiguration = presenter.configuration
  expect(actualConfiguration['event.json']['ambientTemp']).toBe(17.5)
})

test('can set the track', () => {
  const {exportConfiguration, createEvent} = make()
  const {id: event_id} = createEvent({track_id: 'spa_2019'})
  const presenter = new ExportConfigurationPresenterSpy()

  exportConfiguration({event_id}, presenter);

  const actualConfiguration = presenter.configuration
  expect(actualConfiguration['event.json']['track']).toBe('spa_2019')
  expect(actualConfiguration['event.json']['metaData']).toBe('spa_2019')
  expect(presenter.eventName).toBe('Untitled')
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

  const sessionPresenter = new ViewEventPresenterSpy()
  viewEvent({id}, sessionPresenter)

  expect(sessionPresenter.wasNotFound).toBe(true)
})

test('cannot view an event that does not exist', () => {
  const {viewEvent} = make()
  const sessionPresenter = new ViewEventPresenterSpy()
  viewEvent({id: "fake-id"}, sessionPresenter)
  expect(sessionPresenter.wasNotFound).toBe(true)
})

test('can create a new event', () => {
  const {createEvent, viewEvent} = make()
  const {id} = createEvent({track_id: 'kyalami_2019'})

  const presenter = new ViewEventPresenterSpy()
  viewEvent({id}, presenter)

  expect(presenter._track).toStrictEqual(
    {
      id: "kyalami_2019",
      name: "Kyalami Grand Prix Circuit",
      short_name: "Kyalami",
      image_id: "Kyalami",
      variant_name: '2019'
    }
  )
  expect(presenter._weather).toStrictEqual(
    {
      temperature: 22.0
    }
  )
  expect(presenter.wasNotFound).toBe(false)
  expect(presenter.raceSessions[0]).toStrictEqual(
    {
      id: presenter.raceSessions[0].id,
      startAt: '11:00',
      endAt: '12:00',
      startOn: 'Sunday',
      timeMultiplier: '3',
      actualDuration: '20',
    }
  )

  expect(presenter.nonRaceSessions[0]).toStrictEqual(
    {
      id: presenter.nonRaceSessions[0].id,
      startAt: '10:00',
      endAt: '11:00',
      startOn: 'Saturday',
      timeMultiplier: '6',
      actualDuration: '10',
      type: 'Practice'
    }
  )
  expect(presenter.nonRaceSessions[1]).toStrictEqual(
    {
      id: presenter.nonRaceSessions[1].id,
      startAt: '15:00',
      endAt: '15:50',
      startOn: 'Saturday',
      timeMultiplier: '5',
      actualDuration: '10',
      type: 'Qualifying'
    }
  )
  expect(presenter.isDone).toBe(true)
})

test('can not delete the last of session of an event', () => {
  const {createEvent, deleteSessionFromEvent, exportConfiguration, viewEvent} = make()
  const {id} = createEvent({track_id: 'kyalami_2019'})

  let presenter = new ViewEventPresenterSpy()
  viewEvent({id}, presenter)

  deleteSessionFromEvent({eventId: id, sessionId: presenter.raceSessions[0].id})

  presenter = new ViewEventPresenterSpy()
  viewEvent({id}, presenter)

  expect(presenter.raceSessions.length).toBe(1)

  const presenter2 = new ExportConfigurationPresenterSpy()
  exportConfiguration({event_id: id}, presenter2);

  const actualConfiguration = presenter2.configuration
  expect(actualConfiguration['event.json']['sessions']).toStrictEqual([
    {
      "dayOfWeekend": 2,
      "hourOfDay": 10,
      "sessionDurationMinutes": 10,
      "sessionType": "P",
      "timeMultiplier": 6,
    },
    {
      "dayOfWeekend": 2,
      "hourOfDay": 15,
      "sessionDurationMinutes": 10,
      "sessionType": "Q",
      "timeMultiplier": 5,
    },
    {
      "dayOfWeekend": 3,
      "hourOfDay": 11,
      "sessionDurationMinutes": 20,
      "sessionType": "R",
      "timeMultiplier": 3,
    }
  ])
})

test('can delete a non race session', () => {
  const {createEvent, deleteSessionFromEvent, exportConfiguration, viewEvent} = make()
  const {id} = createEvent({track_id: 'kyalami_2019'})

  let presenter = new ViewEventPresenterSpy()
  viewEvent({id}, presenter)

  deleteSessionFromEvent({eventId: id, sessionId: presenter.nonRaceSessions[0].id})

  presenter = new ViewEventPresenterSpy()
  viewEvent({id}, presenter)

  expect(presenter.nonRaceSessions.length).toBe(1)

  const presenter2 = new ExportConfigurationPresenterSpy()
  exportConfiguration({event_id: id}, presenter2);

  const actualConfiguration = presenter2.configuration
  expect(actualConfiguration['event.json']['sessions']).toStrictEqual([
    {
      "dayOfWeekend": 2,
      "hourOfDay": 15,
      "sessionDurationMinutes": 10,
      "sessionType": "Q",
      "timeMultiplier": 5,
    },
    {
      "dayOfWeekend": 3,
      "hourOfDay": 11,
      "sessionDurationMinutes": 20,
      "sessionType": "R",
      "timeMultiplier": 3,
    }
  ])
})

test('can list all events', () => {
  const {createEvent, listEvents} = make()

  const {id: id1} = createEvent({track_id: 'kyalami_2019'})
  const {id: id2} = createEvent({track_id: 'kyalami_2019'})
  const {id: id3} = createEvent({track_id: 'kyalami_2019'})

  const presenter = new ListEventsPresenterSpy()

  listEvents({}, presenter)

  expect(presenter.events).toStrictEqual(
    [
      {id: id1, name: 'untitled', track_name: 'Kyalami'},
      {id: id2, name: 'untitled', track_name: 'Kyalami'},
      {id: id3, name: 'untitled', track_name: 'Kyalami'}
    ]
  )
  expect(presenter.isDone).toBe(true)
})

test('can create events for different tracks', () => {
  const {createEvent, listEvents} = make()

  const {id: id1} = createEvent({track_id: 'kyalami_2019'})
  const {id: id2} = createEvent({track_id: 'suzuka_2019'})
  const {id: id3} = createEvent({track_id: 'zandvoort_2019'})

  const presenter = new ListEventsPresenterSpy()

  listEvents({}, presenter)

  expect(presenter.events).toStrictEqual(
    [
      {id: id1, name: 'untitled', track_name: 'Kyalami'},
      {id: id2, name: 'untitled', track_name: 'Suzuka'},
      {id: id3, name: 'untitled', track_name: 'Zandvoort'}
    ]
  )
  expect(presenter.isDone).toBe(true)
})

test('can display correct track when viewing event', () => {
  const {createEvent, viewEvent} = make()
  const {id} = createEvent({track_id: 'brands_hatch'})

  const sessionPresenter = new ViewEventPresenterSpy()

  viewEvent({id}, sessionPresenter)

  expect(sessionPresenter._track).toStrictEqual(
    {
      id: "brands_hatch",
      name: "Brands Hatch Circuit",
      short_name: "Brands Hatch",
      image_id: "BrandsHatch",
      variant_name: '2018'
    }
  )
  expect(sessionPresenter._weather).toStrictEqual(
    {
      temperature: 14.0
    }
  )
})

test('can update event name', () => {
  const {createEvent, viewEvent, listEvents, updateEventName, exportConfiguration} = make()
  const {id} = createEvent({track_id: 'brands_hatch'})
  updateEventName({id, name: "My Great Event"})

  const sessionPresenter = new ViewEventPresenterSpy()
  viewEvent({id}, sessionPresenter)

  const presenter = new ListEventsPresenterSpy()
  listEvents({}, presenter)

  const exportPresenter = new ExportConfigurationPresenterSpy()
  exportConfiguration({event_id: id}, exportPresenter)

  expect(sessionPresenter.eventName).toBe('My Great Event')
  expect(presenter.events[0].name).toBe('My Great Event')
  expect(exportPresenter.eventName).toBe('My Great Event')

})

test('can edit race session', () => {
  const {createEvent, editSession, viewEvent} = make()

  const {id} = createEvent({track_id: 'brands_hatch'})

  {
    const sessionPresenter = new ViewEventPresenterSpy()
    viewEvent({id}, sessionPresenter)
    const sessionId = sessionPresenter.raceSessions[0].id
    const success = jest.fn()
    editSession({
      id: sessionId,
      eventId: id,
      startAt: '19:11',
      startOn: 'Saturday',
      timeMultiplier: '4',
      actualDuration: '30'
    }, {success})
    expect(success).toHaveBeenCalled()
  }

  {
    const sessionPresenter = new ViewEventPresenterSpy()
    viewEvent({id}, sessionPresenter)
    expect(sessionPresenter.raceSessions[0].startAt).toBe('19:00')
    expect(sessionPresenter.raceSessions[0].startOn).toBe('Saturday')
    expect(sessionPresenter.raceSessions[0].endAt).toBe('21:00')
    expect(sessionPresenter.raceSessions[0].timeMultiplier).toBe('4')
    expect(sessionPresenter.raceSessions[0].actualDuration).toBe('30')
  }
})

test('can edit non-race session', () => {
  const {createEvent, editSession, viewEvent} = make()

  const {id} = createEvent({track_id: 'brands_hatch'})

  {
    const sessionPresenter = new ViewEventPresenterSpy()
    viewEvent({id}, sessionPresenter)
    const sessionId = sessionPresenter.nonRaceSessions[0].id
    const success = jest.fn()
    editSession({
      id: sessionId,
      eventId: id,
      startAt: '09:11',
      startOn: 'Saturday',
      timeMultiplier: '4',
      actualDuration: '30'
    }, {success})
    expect(success).toHaveBeenCalled()
  }

  {
    const sessionPresenter = new ViewEventPresenterSpy()
    viewEvent({id}, sessionPresenter)
    expect(sessionPresenter.nonRaceSessions[0].startAt).toBe('09:00')
    expect(sessionPresenter.nonRaceSessions[0].startOn).toBe('Saturday')
    expect(sessionPresenter.nonRaceSessions[0].endAt).toBe('11:00')
    expect(sessionPresenter.nonRaceSessions[0].timeMultiplier).toBe('4')
    expect(sessionPresenter.nonRaceSessions[0].actualDuration).toBe('30')
  }
})

test('cannot place non-race after race session', () => {
  const {createEvent, editSession, viewEvent} = make()

  const {id} = createEvent({track_id: 'brands_hatch'})

  {
    const sessionPresenter = new ViewEventPresenterSpy()
    viewEvent({id}, sessionPresenter)
    const sessionId = sessionPresenter.nonRaceSessions[0].id
    const success = jest.fn()
    const error = jest.fn()
    editSession({
      id: sessionId,
      eventId: id,
      startAt: '12:00',
      startOn: 'Sunday',
      timeMultiplier: '4',
      actualDuration: '30'
    }, {success, error})
    expect(success).toHaveBeenCalledTimes(0)
    expect(error).toHaveBeenCalledWith("RACE_OCCURS_BEFORE_NON_RACE")
  }
})

test('cannot overlap non-race with race session', () => {
  const {createEvent, editSession, viewEvent} = make()

  const {id} = createEvent({track_id: 'brands_hatch'})

  {
    const sessionPresenter = new ViewEventPresenterSpy()
    viewEvent({id}, sessionPresenter)
    const sessionId = sessionPresenter.nonRaceSessions[0].id
    const success = jest.fn()
    const error = jest.fn()
    editSession({
      id: sessionId,
      eventId: id,
      startAt: '10:00',
      startOn: 'Sunday',
      timeMultiplier: '12',
      actualDuration: '30'
    }, {success, error})
    expect(success).toHaveBeenCalledTimes(0)
    expect(error).toHaveBeenCalledWith("OVERLAPPING_SESSIONS")
  }
})

test('cannot place race before non-race', () => {
  const {createEvent, editSession, viewEvent} = make()

  const {id} = createEvent({track_id: 'brands_hatch'})

  {
    const sessionPresenter = new ViewEventPresenterSpy()
    viewEvent({id}, sessionPresenter)
    const sessionId = sessionPresenter.raceSessions[0].id
    const success = jest.fn()
    const error = jest.fn()
    editSession({
      id: sessionId,
      eventId: id,
      startAt: '14:00',
      startOn: 'Saturday',
      timeMultiplier: '1',
      actualDuration: '30'
    }, {success, error})
    expect(success).toHaveBeenCalledTimes(0)
    expect(error).toHaveBeenCalledWith("RACE_OCCURS_BEFORE_NON_RACE")
  }
})

test('cannot place a race overlapping non-race', () => {
  const {createEvent, editSession, viewEvent} = make()

  const {id} = createEvent({track_id: 'brands_hatch'})

  {
    const sessionPresenter = new ViewEventPresenterSpy()
    viewEvent({id}, sessionPresenter)
    const sessionId = sessionPresenter.raceSessions[0].id
    const success = jest.fn()
    const error = jest.fn()
    editSession({
      id: sessionId,
      eventId: id,
      startAt: '15:00',
      startOn: 'Saturday',
      timeMultiplier: '1',
      actualDuration: '30'
    }, {success, error})
    expect(success).toHaveBeenCalledTimes(0)
    expect(error).toHaveBeenCalledWith("OVERLAPPING_SESSIONS")
  }
})