import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { ytPlayerState } from 'helpers/player';
import YouTube from 'react-youtube';

function originUrl() {
  const loc = window.location;
  return loc.protocol + '//' + loc.host;
}

const styles = theme => ({
  root: {
    width: '100%',
    minWidth: '100px',
    position: 'relative',
  },

  rootWide: {
    paddingTop: '56.25%', // 16:9 aspect ratio
  },

  iframe: {
    position: 'absolute',
    top: '0',
    left: '0',
    bottom: '0',
    width: '100%',
    height: '100%',
  },
});

const eventTypes = ['Play', 'Pause', 'Ready', 'End', 'StateChange'];

export class Player extends Component {
  static propTypes = {
    className: PropTypes.string,
    videoId: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    eventTypes.forEach(type => {
      this[`handle${type}`] = this[`handle${type}`].bind(this);
    });
  }

  ytProps() {
    const props = { videoId: this.props.videoId };
    eventTypes.forEach(type => {
      props[`on${type}`] = this[`handle${type}`];
    });
    return props;
  }

  getHandler(prop) {
    const handler = this.props[prop];
    return handler ? handler : () => {};
  }

  handlePlay(event) {
    this.getHandler('onPlay')(event.target.getCurrentTime());
  }

  handlePause(event) {
    this.getHandler('onPause')(event.target.getCurrentTime());
  }

  handleReady(event) {
    this.getHandler('onReady')(event.target);
  }

  handleEnd(event) {
    this.getHandler('onEnd')(event.target);
  }

  handleStateChange(event) {
    this.getHandler('onStateChange')(ytPlayerState(event.data));
  }

  render() {
    const { classes, className, wideRatio, start } = this.props;
    const ytProps = this.ytProps();
    const rootClasses = [classes.root, className];

    if (wideRatio) {
      rootClasses.push(classes.rootWide);
    }

    const opts = {
      playerVars: {
        origin: originUrl(),
        iv_load_policy: 3,
        fs: 1,
        start: Math.floor(start) || 0,
      },
    };

    return (
      <div className={rootClasses.join(' ')}>
        <YouTube className={classes.iframe} opts={opts} {...ytProps} />
      </div>
    );
  }
}

export default withStyles(styles)(Player);
