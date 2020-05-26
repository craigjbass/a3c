import ConfigurationState from './ConfigurationState'
import {exportConfiguration, updateServerName, listAvailableTracks} from '.'
import expectedDefaults from './_tests/defaults'
import expectedTracks from "./_tests/expectedTracks";

const make = () => {
  const configurationState = new ConfigurationState()
  return {
    exportConfiguration: exportConfiguration(configurationState),
    updateServerName: updateServerName(configurationState),
    listAvailableTracks: listAvailableTracks()
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