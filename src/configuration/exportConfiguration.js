export default (configurationState) =>
    () => {
        const configuration = configurationState.toObject()
        return {
            "configuration.json": withConfigVersion(getConfigurationDotJson)(configuration),
            "settings.json": withConfigVersion(getSettingsDotJson)(configuration),
            "event.json": withConfigVersion(getEventDotJson)(configuration),
            "eventRules.json": withConfigVersion(getEventRulesDotJson)(configuration),
            "assistRules.json": withConfigVersion(getAssistRulesDotJson)(configuration)
        }
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
