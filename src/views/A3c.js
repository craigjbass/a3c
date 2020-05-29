import React from 'react'
import _DefaultLayout from "./layouts/DefaultLayout";
import _TrackSelectionPage from "./pages/TrackSelectionPage";
import _EventCreatorPage from './pages/EventCreatorPage';
import _EventListPage from './pages/EventListPage';
import {listAvailableTracks, createEvent, viewEvent, listEvents, exportConfiguration} from "../configuration";
import saveAsZip from "../presenter/saveAsZip";
import ConfigurationState from "../configuration/ConfigurationState";

export default ({navigate, Router}) => {
  const configurationState = new ConfigurationState()

  const DefaultLayout = _DefaultLayout({navigate})

  const TrackSelectionPage = _TrackSelectionPage(
    {
      Layout: DefaultLayout,
      navigate,
      createEvent: createEvent(configurationState),
      listAvailableTracks: listAvailableTracks()
    }
  )

  const EventListPage = _EventListPage(
    {
      Layout: DefaultLayout,
      navigate,
      listEvents: listEvents(configurationState)
    }
  )

  const EventCreatorPage = _EventCreatorPage(
    {
      Layout: DefaultLayout,
      navigate,
      viewEvent: viewEvent(configurationState),
      exportConfiguration: (params) => exportConfiguration(configurationState)({...params}, saveAsZip)
    }
  )

  return () => <>
    <Router>
      <TrackSelectionPage path="/"/>
      <EventListPage path="/events" />
      <EventCreatorPage path="/events/:trackId"/>
    </Router>
  </>
}