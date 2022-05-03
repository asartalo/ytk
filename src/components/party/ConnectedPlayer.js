import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { setPlayback, setCurrentAt, skip } from '../../actions/partyActions';
import Player from '../video/Player';

const playerEvents = ['Ready', 'Pause', 'Play', 'End', 'StateChange', 'Error'];

function secondsDifference(a, b) {
  return Math.abs(a - b) > 1;
}

export class ConnectedPlayer extends Component {
  static propTypes = {
    className: PropTypes.string,
    videoId: PropTypes.string.isRequired,
    at: PropTypes.number.isRequired,
    isPlaying: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
    current: PropTypes.string.isRequired,
    next: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = { loaded: false, startAt: props.at };
    playerEvents.forEach(event => {
      this[`handle${event}`] = this[`handle${event}`].bind(this);
    });
    this._skip = this._skip.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { isPlaying } = this.props;
    if (this.playBackChanged(prevProps)) {
      this.setPlayback(isPlaying);
    }
    if (this.videoChanged(prevProps)) {
      this.setState({ startAt: this.props.at, loaded: false });
    }
  }

  playBackChanged(prev) {
    return prev.isPlaying !== this.props.isPlaying;
  }

  videoChanged(prev) {
    return prev.videoId !== this.props.videoId;
  }

  handleReady(player) {
    const { isPlaying } = this.props;
    this.player = player;
    this.setPlayback(isPlaying);
    this.setState({ loaded: true });
  }

  playPause(play, playAt) {
    const { dispatch, isPlaying, at } = this.props;
    if (secondsDifference(at, playAt)) {
      dispatch(setCurrentAt(playAt));
    }
    if (play !== isPlaying) {
      dispatch(setPlayback(play));
    }
  }

  handlePause(at) {
    if (this.state.loaded) {
      this.playPause(false, at);
    }
  }

  handlePlay(at) {
    this.setState({ loaded: true });
    this.playPause(true, at);
  }

  handleEnd() {
    this._skip();
  }

  _skip() {
    const { dispatch, current, next } = this.props;
    dispatch(skip({ from: current, to: next }));
  }

  handleStateChange(playerState) {
    if (playerState === 'cued') {
      this.setPlayback(true);
    }
  }

  handleError(error) {
    global.setTimeout(this._skip, 5000);
  }

  setPlayback(play) {
    const player = this.player;
    if (!player) return;
    if (play) {
      player.playVideo();
    } else {
      player.pauseVideo();
    }
  }

  eventHandlers() {
    if (!this._eventHandlers) {
      this._eventHandlers = playerEvents.reduce((props, event) => {
        props[`on${event}`] = this[`handle${event}`];
        return props;
      }, {});
    }
    return this._eventHandlers;
  }

  render() {
    const { videoId, className } = this.props;
    return (
      <div className="foofaa">
        <Player
          data-testid="Player"
          className={className}
          videoId={videoId}
          start={this.state.startAt}
          {...this.eventHandlers()}
        />
      </div>
    );
  }
}

export default connect(state => {
  const { current, queue } = state.party;
  return {
    videoId: current.videoId,
    at: current.at,
    isPlaying: current.isPlaying,
    current: current.queueId,
    next: queue[0] ? queue[0].queueId : null,
  };
})(ConnectedPlayer);
