import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import IdleTimer from 'react-idle-timer';
import screenfull from 'screenfull';

import injectProp from 'helpers/injectProp';
import { currentUserShape, partyShape } from 'components/propTypes';
import Player from 'components/video/Player';

const styles = theme => ({
  root: {},

  controls: {
    transition: '300ms',
    opacity: 1,
  },

  invisible: {
    opacity: 0,
    transition: '1.5s',
  },

  mainButton: {
    position: 'fixed',
    top: theme.spacing.unit * 7,
    right: theme.spacing.unit * 4,
  },

  player: {
    minHeight: '100vh',
    minWidth: '100vw',
  },
});

class PartyPlayerPage extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    children: PropTypes.node,
    className: PropTypes.string,
    party: partyShape.isRequired,
    currentUser: currentUserShape.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      fullScreenAvailable: props.screenfull.enabled,
      fullScreen: false,
      showControls: true,
    };
    this.handleFullScreenToggle = this.handleFullScreenToggle.bind(this);
    this.handleActive = this.handleActive.bind(this);
    this.handleIdle = this.handleIdle.bind(this);
  }

  componentDidMount() {
    this.props.screenfull.on('change', e => {
      this.setState(state => ({
        fullScreen: this.props.screenfull.isFullscreen,
      }));
    });
  }

  handleFullScreenToggle() {
    this.props.screenfull.toggle();
  }

  handleActive() {
    this.setState({ showControls: true });
  }

  handleIdle() {
    this.setState({ showControls: false });
  }

  renderControls() {
    const { classes } = this.props;
    if (this.state.fullScreenAvailable) {
      const controlsClass = [classes.controls];
      if (!this.state.showControls) {
        controlsClass.push(classes.invisible);
      }
      return (
        <div className={controlsClass.join(' ')}>
          <Button
            variant="fab"
            color="primary"
            className={classes.mainButton}
            onClick={this.handleFullScreenToggle}
          >
            <Tooltip
              title={
                this.state.fullScreen
                  ? 'Exit Full Screen'
                  : 'Enter Full Screen Mode'
              }
              placement="left"
            >
              {this.state.fullScreen ? (
                <FullscreenExitIcon />
              ) : (
                <FullscreenIcon />
              )}
            </Tooltip>
          </Button>
        </div>
      );
    } else {
      return null;
    }
  }

  render() {
    const { classes, current } = this.props;
    return (
      <div className={classes.root}>
        <IdleTimer
          element={document}
          onActive={this.handleActive}
          onIdle={this.handleIdle}
          timeout={1000 * 5}
        >
          <Player className={classes.player} videoId={current.videoId} />
          {this.renderControls()}
        </IdleTimer>
      </div>
    );
  }
}

export default withStyles(styles)(injectProp({ screenfull })(PartyPlayerPage));
