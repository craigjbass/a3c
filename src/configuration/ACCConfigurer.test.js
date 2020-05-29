import expectedDefaults from './_tests/defaults'
import expectedTracks from "./_tests/expectedTracks";
import {ViewEventPresenterSpy} from "./presenterTestDoubles/ViewEventPresenterSpy";
import {ListEventsPresenterSpy} from "./presenterTestDoubles/ListEventsPresenterSpy";
import {ExportConfigurationPresenterSpy} from "./presenterTestDoubles/ExportConfigurationPresenterSpy";
import { make } from '../main'

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

  const sessionPresenter = new ViewEventPresenterSpy()
  viewEvent({id}, sessionPresenter)

  expect(sessionPresenter._track).toStrictEqual(
    {
      id: "kyalami_2019",
      name: "Kyalami Grand Prix Circuit",
      short_name: "Kyalami",
      image_id: "Kyalami",
      variant_name: '2019'
    }
  )
  expect(sessionPresenter.wasNotFound).toBe(false)
  expect(sessionPresenter.raceSessions[0]).toStrictEqual(
    {
      startAt: '18:00',
      startOn: 'Saturday',
      duration: '20',
      timeMultiplier: '2',
      actualDuration: '10',
    }
  )

  expect(sessionPresenter.nonRaceSessions[0]).toStrictEqual(
    {
      startAt: '06:00',
      startOn: 'Friday',
      duration: '10',
      timeMultiplier: '1',
      actualDuration: '10',
      type: 'Practice'
    }
  )
  expect(sessionPresenter.nonRaceSessions[1]).toStrictEqual(
    {
      startAt: '12:00',
      startOn: 'Friday',
      duration: '10',
      timeMultiplier: '1',
      actualDuration: '10',
      type: 'Qualifying'
    }
  )
  expect(sessionPresenter.isDone).toBe(true)
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