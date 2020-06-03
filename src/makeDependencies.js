import ConfigurationState from "./configuration/ConfigurationState";
import {
  createEvent, deleteEvent,
  exportConfiguration,
  listAvailableTracks,
  listEvents,
  updateEventName,
  viewEvent,
  deleteSessionFromEvent
} from "./configuration";

export const make = () => {
  const configurationState = new ConfigurationState()
  return {
    exportConfiguration: exportConfiguration(configurationState),
    listAvailableTracks: listAvailableTracks(),
    viewEvent: viewEvent(configurationState),
    createEvent: createEvent(configurationState),
    listEvents: listEvents(configurationState),
    updateEventName: updateEventName(configurationState),
    deleteEvent: deleteEvent(configurationState),
    deleteSessionFromEvent: deleteSessionFromEvent(configurationState)
  }
}