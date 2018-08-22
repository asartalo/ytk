import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
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

class Player extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
  };

  ytProps() {
    const props = { ...this.props };
    ['classes', 'children', 'className', 'isPlaying'].forEach(
      item => delete props[item]
    );
    return props;
  }

  render() {
    const { classes, className, wideRatio } = this.props;
    const ytProps = this.ytProps();
    const rootClasses = [classes.root, className];

    if (wideRatio) {
      rootClasses.push(classes.rootWide);
    }

    const opts = {
      playerVars: {
        origin: originUrl(),
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
