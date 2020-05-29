import React from 'react'
import DefaultLayout from "./layouts/DefaultLayout";
import _TrackSelectionPage from "./pages/TrackSelectionPage";
import _EventCreatorPage from './pages/EventCreatorPage';
import {listAvailableTracks, createEvent, viewEvent} from "../configuration";
import ConfigurationState from "../configuration/ConfigurationState";

export default ({navigate, Router}) => {
  const configurationState = new ConfigurationState()

  const EventCreatorPage = _EventCreatorPage(
    {
      Layout: DefaultLayout,
      navigate,
      viewEvent: viewEvent(configurationState)
    }
  )

  const TrackSelectionPage = _TrackSelectionPage(
    {
      Layout: DefaultLayout,
      navigate,
      createEvent: createEvent(configurationState),
      listAvailableTracks: listAvailableTracks()
    }
  )

  return () => <>
    <Router>
      <TrackSelectionPage path="/"/>
      <EventCreatorPage path="/event/:trackId"/>
    </Router>
  </>
}