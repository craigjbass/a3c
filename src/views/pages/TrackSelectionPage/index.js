import _TrackSelector from "./TrackSelector";

import React from "react";

export default ({Layout, navigate, listAvailableTracks}) => {
  const TrackSelector = _TrackSelector({listAvailableTracks})
  const selectTrack = (track) => navigate(`/event/${track}`)

  return () => <Layout>
    <TrackSelector selectTrack={selectTrack}/>
  </Layout>
}