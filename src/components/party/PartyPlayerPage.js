import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import screenfull from 'screenfull';

import injectProp from '../../helpers/injectProp';
import { IdleTimer } from './IdleTImer';
import { currentUserShape, partyShape } from '../propTypes';
import ButtonWithTooltip from '../ytk/ButtonWithTooltip';
import ConnectedPlayer from './ConnectedPlayer';
import IfElse from '../IfElse';

const styles = ({ typography, spacing, transitions }) => ({
  root: {},

  controls: {
    transition: transitions.duration.standard,
    opacity: 1,
  },

  invisible: {
    opacity: 0,
    transition: '1.5s',
  },

  mainButton: {
    position: 'fixed',
    top: spacing(7),
    right: spacing(4),
  },

  player: {
    minHeight: '100vh',
    minWidth: '100vw',
  },

  noVideoHelp: {
    ...typography.body1,
  },
});

export class PartyPlayerPage extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    children: PropTypes.node,
    className: PropTypes.string,
    party: partyShape.isRequired,
    currentUser: currentUserShape.isRequired,
    signal: PropTypes.object.isRequired,
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
    this.handleWindowClose = this.handleWindowClose.bind(this);
  }

  componentDidMount() {
    this.props.screenfull.on('change', e => {
      this.setState(state => ({
        fullScreen: this.props.screenfull.isFullscreen,
      }));
    });
    global.addEventListener('beforeunload', this.handleWindowClose);
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

  handleWindowClose() {
    this.props.signal.send('closeStandalonePlayer', true);
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
      <div className="PartyPlayerPage">
        <IfElse condition={!!current}>
          <IdleTimer
            element={document}
            onActive={this.handleActive}
            onIdle={this.handleIdle}
            timeout={1000 * 5}
          >
            <div className={classes.root}>
              <ConnectedPlayer className={classes.player} />
              {this.renderControls()}
            </div>
          </IdleTimer>
          <div className={classes.noVideoHelp}>
            <p>There is no video yet.</p>
          </div>
        </IfElse>
      </div>
    );
  }
}

export default withStyles(styles)(injectProp({ screenfull })(PartyPlayerPage));
