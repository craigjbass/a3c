import React from 'react'
import _DefaultLayout from "./layouts/DefaultLayout";
import _TrackSelectionPage from "./pages/TrackSelectionPage";
import _EventCreatorPage from './pages/EventCreatorPage';
import _EventListPage from './pages/EventListPage';
import _ConfigPreviewPage from './pages/ConfigPreviewPage';
import _ServerConfigPage from './pages/ServerConfigPage';
import saveAsZipPresenter from "../presenter/saveAsZip";

export default ({navigate, Router, make}) => {
  const {
    createEvent,
    viewEvent,
    listAvailableTracks,
    listEvents,
    exportConfiguration,
    updateEventName,
    deleteEvent,
    deleteSessionFromEvent
  } = make()

  const DefaultLayout = _DefaultLayout({navigate})

  const TrackSelectionPage = _TrackSelectionPage(
    {
      Layout: DefaultLayout,
      navigate,
      createEvent,
      listAvailableTracks
    }
  )

  const EventListPage = _EventListPage(
    {
      Layout: DefaultLayout,
      navigate,
      listEvents
    }
  )

  const EventCreatorPage = _EventCreatorPage(
    {
      Layout: DefaultLayout,
      navigate,
      viewEvent,
      updateEventName,
      deleteEvent,
      deleteSessionFromEvent,
      exportConfiguration: (params) => exportConfiguration({...params}, saveAsZipPresenter)
    }
  )

  const ConfigPreviewPage = _ConfigPreviewPage(
    {
      Layout: DefaultLayout,
      navigate,
      exportConfiguration
    }
  )

  const ServerConfigPage = _ServerConfigPage(
    {
      Layout: DefaultLayout
    }
  )

  return () => <>
    <Router>
      <TrackSelectionPage path="/"/>
      <EventListPage path="/events"/>
      <EventCreatorPage path="/events/:id"/>
      <ConfigPreviewPage path="/events/:id/preview"/>
      <ServerConfigPage path="/server-settings" />
    </Router>
  </>
}