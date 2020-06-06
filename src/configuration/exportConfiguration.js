import tracks from "./tracks";
import trackDefaults from "./trackDefaults";

const note = (id) => id

export default (configurationState) =>
  ({event_id}, presenter) => {
    const event = configurationState.getEvent(event_id)
    const track = tracks.find((value => {
      return value.variants.find((variant) => variant.track_id === event.track_id) !== undefined
    }))
    const variant = track.variants.find((v) => v.track_id === event.track_id)
    const configuration = {
      "udpPort": 9231,
      "tcpPort": 9232,
      "maxConnections": 85,
      "registerToLobby": 1,
      "serverName": "ACC Server (please edit settings.json)",
      "adminPassword": "",
      "trackMedalsRequirement": 0,
      "safetyRatingRequirement": -1,
      "racecraftRatingRequirement": -1,
      "password": "",
      "spectatorPassword": "",
      "dumpLeaderboards": 0,
      "dumpEntryList": 0,
      "isRaceLocked": 1,
      "shortFormationLap": 1,
      "formationLapType": 3,
      "centralEntryListPath": "",
      "track": event.track_id,
      "metaData": event.track_id,
      "eventType": "E_6h",
      "preRaceWaitingTimeSeconds": 80,
      "postQualySeconds": 10,
      "postRaceSeconds": 15,
      "sessionOverTimeSeconds": Math.round(variant.quickest_lap * 1.15),
      "ambientTemp": trackDefaults[track.id].temperature,
      "trackTemp": note(30, 'Obsolete: Track temperatures are always simulated based on ambient temperature, sun angle, clouds and other aspects'),
      "cloudLevel": 0.1,
      "rain": 0,
      "weatherRandomness": 1,
      "sessions": [].concat(
        event.nonRaceSessions.map(s => ({
          "hourOfDay": parseInt(s.startAt.split(':')[0].replace(/^0/, '')),
          "dayOfWeekend": ['Friday', 'Saturday', 'Sunday'].indexOf(s.startOn) + 1,
          "timeMultiplier": parseInt(s.timeMultiplier),
          "sessionType": s.type === "Qualifying" ? "Q" : "P",
          "sessionDurationMinutes": 10
        })),
        event.raceSessions.map(s => ({
          "hourOfDay": parseInt(s.startAt.split(':')[0].replace(/^0/, '')),
          "dayOfWeekend": ['Friday', 'Saturday', 'Sunday'].indexOf(s.startOn) + 1,
          "timeMultiplier": parseInt(s.timeMultiplier),
          "sessionType": "R",
          "sessionDurationMinutes": 20
        }))
      ),
      "qualifyStandingType": 1,
      "pitWindowLengthSec": -1,
      "driverStintTimeSec": -1,
      "isRefuellingAllowedInRace": true,
      "isRefuellingTimeFixed": false,
      "maxDriversCount": 1,
      "mandatoryPitstopCount": 0,
      "maxTotalDrivingTime": -1,
      "isMandatoryPitstopRefuellingRequired": false,
      "isMandatoryPitstopTyreChangeRequired": false,
      "isMandatoryPitstopSwapDriverRequired": false,
      "stabilityControlLevelMax": 100,
      "disableAutosteer": 0,
      "disableAutoLights": 0,
      "disableAutoWiper": 0,
      "disableAutoEngineStart": 0,
      "disableAutoPitLimiter": 0,
      "disableAutoGear": 0,
      "disableAutoClutch": 0,
      "disableIdealLine": 0,
    }
    presenter.configurationFiles(
      {
        "configuration.json": withConfigVersion(getConfigurationDotJson)(configuration),
        "settings.json": withConfigVersion(getSettingsDotJson)(configuration),
        "event.json": withConfigVersion(getEventDotJson)(configuration),
        "eventRules.json": withConfigVersion(getEventRulesDotJson)(configuration),
        "assistRules.json": withConfigVersion(getAssistRulesDotJson)(configuration)
      },
      event.name || 'Untitled'
    )
  }

const withConfigVersion = (f) => {
  return configuration => ({...f(configuration), configVersion: 1})
}

const getConfigurationDotJson =
  ({udpPort, tcpPort, maxConnections, registerToLobby}) =>
    ({udpPort, tcpPort, maxConnections, registerToLobby})

const getSettingsDotJson = (
  {
    serverName,
    adminPassword,
    trackMedalsRequirement,
    safetyRatingRequirement,
    racecraftRatingRequirement,
    password,
    spectatorPassword,
    dumpLeaderboards,
    dumpEntryList,
    isRaceLocked,
    shortFormationLap,
    formationLapType,
    centralEntryListPath
  }) => (
  {
    serverName,
    adminPassword,
    trackMedalsRequirement,
    safetyRatingRequirement,
    racecraftRatingRequirement,
    password,
    spectatorPassword,
    dumpLeaderboards,
    dumpEntryList,
    isRaceLocked,
    shortFormationLap,
    formationLapType,
    centralEntryListPath
  })

const getEventDotJson = (
  {
    track,
    metaData,
    eventType,
    preRaceWaitingTimeSeconds,
    postQualySeconds,
    postRaceSeconds,
    sessionOverTimeSeconds,
    ambientTemp,
    trackTemp,
    cloudLevel,
    rain,
    weatherRandomness,
    sessions
  }) => (
  {
    track,
    metaData,
    eventType,
    preRaceWaitingTimeSeconds,
    postQualySeconds,
    postRaceSeconds,
    sessionOverTimeSeconds,
    ambientTemp,
    trackTemp,
    cloudLevel,
    rain,
    weatherRandomness,
    sessions
  })

const getEventRulesDotJson = (
  {
    qualifyStandingType,
    pitWindowLengthSec,
    driverStintTimeSec,
    isRefuellingAllowedInRace,
    isRefuellingTimeFixed,
    maxDriversCount,
    mandatoryPitstopCount,
    maxTotalDrivingTime,
    isMandatoryPitstopRefuellingRequired,
    isMandatoryPitstopTyreChangeRequired,
    isMandatoryPitstopSwapDriverRequired
  }) => (
  {
    qualifyStandingType,
    pitWindowLengthSec,
    driverStintTimeSec,
    isRefuellingAllowedInRace,
    isRefuellingTimeFixed,
    maxDriversCount,
    mandatoryPitstopCount,
    maxTotalDrivingTime,
    isMandatoryPitstopRefuellingRequired,
    isMandatoryPitstopTyreChangeRequired,
    isMandatoryPitstopSwapDriverRequired
  })

const getAssistRulesDotJson = (
  {
    stabilityControlLevelMax,
    disableAutosteer,
    disableAutoLights,
    disableAutoWiper,
    disableAutoEngineStart,
    disableAutoPitLimiter,
    disableAutoGear,
    disableAutoClutch,
    disableIdealLine
  }) => (
  {
    stabilityControlLevelMax,
    disableAutosteer,
    disableAutoLights,
    disableAutoWiper,
    disableAutoEngineStart,
    disableAutoPitLimiter,
    disableAutoGear,
    disableAutoClutch,
    disableIdealLine
  })
