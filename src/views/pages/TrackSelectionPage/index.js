import _TrackSelector from "./TrackSelector";

import React from "react";
import {Breadcrumbs} from "@blueprintjs/core";

export default ({Layout, navigate, listAvailableTracks}) => {
  const TrackSelector = _TrackSelector({listAvailableTracks})
  const selectTrack = (track) => navigate(`/event/${track}`)

  return () => <Layout>
    <Breadcrumbs
      items={[
        { icon: "list", text: "Choose track" }
      ]}
    />
    <TrackSelector selectTrack={selectTrack}/>
  </Layout>
}