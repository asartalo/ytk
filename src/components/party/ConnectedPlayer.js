import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { setPlayback, setCurrentAt, skip } from 'actions/partyActions';
import Player from 'components/video/Player';

const playerEvents = ['Ready', 'Pause', 'Play', 'End', 'StateChange'];

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
  };

  constructor(props) {
    super(props);
    this.startAt = props.at;
    this.state = { loaded: false };
    playerEvents.forEach(event => {
      this[`handle${event}`] = this[`handle${event}`].bind(this);
    });
  }

  componentDidUpdate(prevProps) {
    const { isPlaying } = this.props;
    if (this.playBackChanged(prevProps)) {
      this.setPlayback(isPlaying);
    }
  }

  playBackChanged(prev) {
    return prev.isPlaying !== this.props.isPlaying;
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
    this.playPause(false, at);
  }

  handlePlay(at) {
    this.playPause(true, at);
  }

  handleEnd() {
    this.props.dispatch(skip());
  }

  handleStateChange(playerState) {
    if (playerState === 'unstarted') {
      this.setPlayback(true);
    }
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
      <Player
        className={className}
        videoId={videoId}
        start={this.startAt}
        {...this.eventHandlers()}
      />
    );
  }
}

export default connect(state => {
  const current = state.party.current;
  return {
    videoId: current.videoId,
    at: current.at,
    isPlaying: current.isPlaying,
  };
})(ConnectedPlayer);
