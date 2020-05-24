import _exportConfiguration from './exportConfiguration'

export const exportConfiguration = _exportConfiguration

export const updateServerName = (configurationState) =>
    ({serverName}) => configurationState.update('serverName', serverName)