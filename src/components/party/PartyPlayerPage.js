import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import IdleTimer from 'react-idle-timer';
import screenfull from 'screenfull';

import injectProp from 'helpers/injectProp';
import { currentUserShape, partyShape } from 'components/propTypes';
import ButtonWithTooltip from 'components/ytk/ButtonWithTooltip';
import ConnectedPlayer from './ConnectedPlayer';
import IfElse from 'components/IfElse';

const styles = theme => ({
  root: {},

  controls: {
    transition: '300ms',
    opacity: 1,
    // position: 'absolute',
    // top: 0,
    // left: 0,
    // right: 0,
    // bottom: 40,
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

  noVideoHelp: {
    ...theme.typography.body1,
  },
});

export class PartyPlayerPage extends Component {
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

  componentDidUpdate(prevProps, prevState) {
    const { currentUser } = this.props;
    if (
      !currentUser.standAlonePlayer &&
      prevProps.currentUser.standAlonePlayer
    ) {
      global.close();
    }
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
          <ButtonWithTooltip
            variant="fab"
            color="primary"
            className={classes.mainButton}
            onClick={this.handleFullScreenToggle}
            tooltipTitle={
              this.state.fullScreen
                ? 'Exit Full Screen'
                : 'Enter Full Screen Mode'
            }
            tooltipPlacement="left"
          >
            {this.state.fullScreen ? (
              <FullscreenExitIcon />
            ) : (
              <FullscreenIcon />
            )}
          </ButtonWithTooltip>
        </div>
      );
    } else {
      return null;
    }
  }

  render() {
    const { classes, party } = this.props;
    const { current } = party;
    return (
      <IfElse condition={!!current}>
        <IdleTimer
          element={document}
          onActive={this.handleActive}
          onIdle={this.handleIdle}
          timeout={1000 * 5}
        >
          <div className={classes.root}>
            {this.renderControls()}
            <ConnectedPlayer className={classes.player} />
          </div>
        </IdleTimer>
        <div className={classes.noVideoHelp}>
          <p>There is no video yet.</p>
        </div>
      </IfElse>
    );
  }
}

export default withStyles(styles)(injectProp({ screenfull })(PartyPlayerPage));
