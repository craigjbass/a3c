import React from 'react';
import './TrackSelector.css'
import {Button, Card, Elevation} from "@blueprintjs/core";

export default ({listAvailableTracks}) => <div className="track-selection">
  {listAvailableTracks().tracks.map((track) =>
    <Card interactive={true} elevation={Elevation.TWO}>
      <h5>{track.name}</h5>
      <p><img src={`tracks/${track.id}.png`} width="10%"/></p>
      <Button rightIcon="arrow-right" intent="success" text="Next step"/>
    </Card>
  )}
</div>