import _TrackSelector from "./TrackSelector";

import React from "react";
import {Breadcrumbs} from "@blueprintjs/core";

export default ({Layout, createEvent, navigate, listAvailableTracks}) => {
  const TrackSelector = _TrackSelector({listAvailableTracks})
  const selectTrack = (track_id) => {
    const {id} = createEvent({track_id})
    return navigate(`/events/${id}`);
  }

  return () => <Layout>
    <Breadcrumbs
      items={[
        { icon: "list", text: "Choose track" }
      ]}
    />
    <TrackSelector selectTrack={selectTrack}/>
  </Layout>
}