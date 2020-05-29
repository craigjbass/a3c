import ConfigurationState from './ConfigurationState'
import expectedDefaults from './_tests/defaults'
import expectedTracks from "./_tests/expectedTracks";
import {
  exportConfiguration,
  updateServerName,
  listAvailableTracks,
  viewEvent,
  createEvent
} from '.'

const make = () => {
  const configurationState = new ConfigurationState()
  return {
    exportConfiguration: exportConfiguration(configurationState),
    updateServerName: updateServerName(configurationState),
    listAvailableTracks: listAvailableTracks(),
    viewEvent: viewEvent(configurationState),
    createEvent: createEvent(configurationState)
  }
}

const expectDotJsonFileToMatchDefaults = (dotJsonFileName, actualConfiguration) => {
  expect(actualConfiguration[dotJsonFileName]).toStrictEqual(expectedDefaults[dotJsonFileName])
}

test('can view default configuration', () => {
  const {exportConfiguration} = make()
  const actualConfiguration = exportConfiguration();
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

test('can change the server name', () => {
  const {updateServerName, exportConfiguration} = make()
  updateServerName({serverName: "Cars"})
  expect((exportConfiguration())['settings.json']['serverName']).toBe("Cars")
})

test('can list available tracks', () => {
  const {listAvailableTracks} = make()
  const availableTracks = listAvailableTracks()
  expect(availableTracks).toStrictEqual(
    {tracks: expectedTracks}
  )
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
  const {id} = createEvent({track: 'kyalami_2019'})

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