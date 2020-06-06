import ConfigurationState from "./configuration/ConfigurationState";
import {
  createEvent,
  deleteEvent,
  deleteSessionFromEvent,
  editSession,
  exportConfiguration,
  listAvailableTracks,
  listEvents,
  updateEventName,
  viewEvent,
} from "./configuration";

export const make = () => {
  const configurationState = new ConfigurationState()
  return {
    createEvent: createEvent(configurationState),
    deleteEvent: deleteEvent(configurationState),
    deleteSessionFromEvent: deleteSessionFromEvent(configurationState),
    editSession: editSession(configurationState),
    exportConfiguration: exportConfiguration(configurationState),
    listAvailableTracks: listAvailableTracks(),
    listEvents: listEvents(configurationState),
    updateEventName: updateEventName(configurationState),
    viewEvent: viewEvent(configurationState),
  }
}