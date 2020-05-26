import _exportConfiguration from './exportConfiguration'
import tracks from './tracks'

export const exportConfiguration = _exportConfiguration

export const updateServerName = (configurationState) =>
  ({serverName}) => configurationState.update('serverName', serverName)

export const listAvailableTracks = () =>
  () => ({ tracks })