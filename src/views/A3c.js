import React from 'react'
import DefaultLayout from "./layouts/DefaultLayout";
import _TrackSelectionPage from "./pages/TrackSelectionPage";
import _EventCreatorPage from './pages/EventCreatorPage';
import {listAvailableTracks} from "../configuration";

export default ({navigate, Router}) => {
  const EventCreatorPage = _EventCreatorPage(
    {
      Layout: DefaultLayout
    }
  )

  const TrackSelectionPage = _TrackSelectionPage(
    {
      Layout: DefaultLayout,
      navigate,
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