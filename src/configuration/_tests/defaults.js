export default {
    'configuration.json': {
        "udpPort": 9231,
        "tcpPort": 9232,
        "maxConnections": 85,
        "registerToLobby": 1,
        "configVersion": 1
    },
    'settings.json': {
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
        "configVersion": 1
    },
    'event.json': {
        "track": "mount_panorama_2019",
        "metaData": "mount_panorama_2019",
        "eventType": "E_6h",
        "preRaceWaitingTimeSeconds": 80,
        "postQualySeconds": 10,
        "postRaceSeconds": 15,
        "sessionOverTimeSeconds": 140,
        "ambientTemp": 22,
        "trackTemp": 30,
        "cloudLevel": 0.1,
        "rain": 0,
        "weatherRandomness": 1,
        "sessions": [
            {
                "hourOfDay": 6,
                "dayOfWeekend": 1,
                "timeMultiplier": 1,
                "sessionType": "P",
                "sessionDurationMinutes": 10
            },
            {
                "hourOfDay": 12,
                "dayOfWeekend": 1,
                "timeMultiplier": 1,
                "sessionType": "Q",
                "sessionDurationMinutes": 10
            },
            {
                "hourOfDay": 18,
                "dayOfWeekend": 2,
                "timeMultiplier": 2,
                "sessionType": "R",
                "sessionDurationMinutes": 20
            }
        ],
        "configVersion": 1
    },
    'eventRules.json': {
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
        "configVersion": 1
    },
    'assistRules.json': {
        "stabilityControlLevelMax": 100,
        "disableAutosteer": 0,
        "disableAutoLights": 0,
        "disableAutoWiper": 0,
        "disableAutoEngineStart": 0,
        "disableAutoPitLimiter": 0,
        "disableAutoGear": 0,
        "disableAutoClutch": 0,
        "disableIdealLine": 0,
        "configVersion": 1
    }
}