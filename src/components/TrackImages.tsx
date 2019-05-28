import React, { Component } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { Track } from "../lib/Tracks";
import {
  PlayerState,
  TracksState,
  setTrackAction,
  setProgressAction,
} from "../store";
import Flickity from "flickity";
import FlickityComponent from "react-flickity-component";

function findTrackId(tracks: Track[], track: Track | null | undefined) {
  if (track) {
    for (let i = 0; i < tracks.length; i++) {
      if (tracks[i].id === track.id) {
        return i;
      }
    }
  }

  return 0;
}

const flickityOptions = {
  initialIndex: 0,
  wrapAround: true,
  setGallerySize: false,
  prevNextButtons: false,
};

interface TrackImagesDispatchProps {
  setTrack: (track: Track) => void;
}

interface TrackImagesStateProps {
  track: Track | null;
  tracks: Track[];
}

type TrackImagesProps = TrackImagesStateProps & TrackImagesDispatchProps;

class TrackImages extends Component<TrackImagesProps> {
  flickity: Flickity | null;

  constructor(props: TrackImagesProps) {
    super(props);
    this.flickity = null;
  }

  componentDidMount = () => {
    if (this.flickity) {
      this.flickity.on("select", async e => {
        if (typeof e === "number") {
          this.props.setTrack(this.props.tracks[e]);
        }
      });
    }
  };

  shouldComponentUpdate = (nextProps: TrackImagesProps) => {
    if (this.props.track === null) {
      return true;
    }

    if (this.props.track !== nextProps.track) {
      if (nextProps.track && this.flickity) {
        this.flickity.select(
          findTrackId(nextProps.tracks, nextProps.track),
          true,
          false,
        );
      }
    }

    if (this.props.tracks.length !== nextProps.tracks.length) {
      return true;
    }

    return false;
  };

  render = () => {
    return (
      <FlickityComponent
        className="track-images"
        options={flickityOptions}
        flickityRef={ref => {
          this.flickity = (ref as unknown) as Flickity;
        }}
      >
        {this.props.tracks.map((track: Track, id) => {
          return (
            <div key={`track-image-${id}`} className="track-image">
              <div
                className="track-cover"
                style={{
                  backgroundImage: `url(${track.artwork_url})`,
                }}
              />
            </div>
          );
        })}
      </FlickityComponent>
    );
  };
}

interface State {
  player: PlayerState;
  tracks: TracksState;
}

const mapStateToProps = (state: State): TrackImagesStateProps => {
  return {
    track: state.player.track,
    tracks: state.tracks.tracks,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): TrackImagesDispatchProps => {
  return {
    setTrack: (track: Track) => {
      dispatch(setTrackAction(track));
      dispatch(setProgressAction(0));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TrackImages);
