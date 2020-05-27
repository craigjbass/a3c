import React from 'react';
import './TrackSelector.css'
import {Tag, Card, Elevation, Popover, AnchorButton} from "@blueprintjs/core";

const TrackSelection = ({track, selectTrack}) => {
  const YearSelector = () => <div>
    <h5>Which year?</h5>
    <p>
      {track.variants.map(
        (variant) => <React.Fragment key={variant.track_id}>
          <AnchorButton
            text={variant.variant_name}
            onClick={() => selectTrack(variant.track_id)}/>
        </React.Fragment>
      )}
    </p>
  </div>

  const TrackCard = ({onClick}) => <Card interactive={true}
                                         elevation={Elevation.TWO}
                                         onClick={onClick}>
    <h3>{track.name}</h3>
    <img
      alt=""
      className="track-selection_TrackLayout"
      src={`tracks/${track.id}.png`}
      width="50%"
    />
    {track.variants.map(
      (variant) => <React.Fragment key={variant.track_id}>
        <Tag round={true}
             interactive={true}
             large={true}
             onClick={() => selectTrack(variant.track_id)}>
          {variant.variant_name}
        </Tag>
        &nbsp;
      </React.Fragment>
    )}
  </Card>

  return <>
    <div key={track.id} className="track-selection_Track">
      {
        (track.variants.length > 1)
          ? <Popover popoverClassName="bp3-popover-content-sizing"
                     content={<YearSelector/>}
                     target={<TrackCard onClick={() => {
                     }}/>}/>
          : <TrackCard track={track}
                       onClick={() => selectTrack(track.variants[0].track_id)}/>
      }
    </div>
  </>
}

export default ({listAvailableTracks}) =>
  ({selectTrack}) => <>
    <h1>Choose track</h1>
    <div className="track-selection">
      {listAvailableTracks().tracks.map(
        (track) => <TrackSelection key={track.id}
                                   track={track}
                                   selectTrack={selectTrack}/>
      )}
    </div>
  </>