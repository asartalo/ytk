import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

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

  constructor(props) {
    super(props);
    this.iframeProps = this.iframeProps.bind(this);
  }

  iframeProps() {
    const props = { ...this.props };
    ['videoId', 'classes', 'children', 'className'].forEach(
      item => delete props[item]
    );
    return props;
  }

  render() {
    const { videoId, classes, className, wideRatio } = this.props;
    const videoUrl = `https://www.youtube.com/embed/${videoId}`;
    const iframeProps = this.iframeProps();
    const rootClasses = [classes.root, className];

    if (wideRatio) {
      rootClasses.push(classes.rootWide);
    }

    return (
      <div className={rootClasses.join(' ')}>
        <iframe
          title="Hello Video"
          className={classes.iframe}
          src={videoUrl}
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          {...iframeProps}
        />
      </div>
    );
  }
}

export default withStyles(styles)(Player);
