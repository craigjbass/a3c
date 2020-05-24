import ConfigurationState from './ConfigurationState'
import {exportConfiguration, updateServerName} from '.'
import expectedDefaults from './_tests/defaults'

const make = () => {
    const configurationState = new ConfigurationState()
    return {
        exportConfiguration: exportConfiguration(configurationState),
        updateServerName: updateServerName(configurationState)
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