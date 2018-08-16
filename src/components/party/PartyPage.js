import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
// import Hidden from '@material-ui/core/Hidden';
import SwipeableViews from 'react-swipeable-views';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Zoom from '@material-ui/core/Zoom';

import { currentUserShape, partyShape } from 'components/propTypes';
import IconButtonWithTooltip from 'components/ytk/IconButtonWithTooltip';
import AppBar from './AppBar';
import PartyUiGrid from './PartyUiGrid';
import Player from 'components/video/Player';
import Current from './Current';
import Queue from './Queue';
import AddToQueue from './AddToQueue';

const styles = theme => ({
  root: {},

  mainContent: {
    width: '100%',
  },

  panel: {
    overflow: 'auto',
    height: 'calc(100vh - 56px)',
  },

  panelStandalone: {
    overflow: 'visible',
    height: 'auto',
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },

  panelControlWrap: {
    backgroundColor: theme.palette.background.paper,
    height: theme.spacing.unit * 5,
  },

  panelControl: {
    marginTop: theme.spacing.unit,
    marginLeft: theme.spacing.unit,
  },

  mainPlayer: {
    width: '100%',
    height: 'calc(100vh - 56px)',

    [theme.breakpoints.down('sm')]: {
      height: 0,
      paddingTop: '56.25%',
    },
  },

  fab: {
    position: 'fixed',
    bottom: 24,
    right: 24,
  },
});

export class PartyPage extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    children: PropTypes.node,
    className: PropTypes.string,
    currentUser: currentUserShape.isRequired,
    party: partyShape.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      showAddMenu: false,
      openStandalonePlayer: false,
    };
    this.toggleAddMenu = this.toggleAddMenu.bind(this);
    this.handleChangePanel = this.handleChangePanel.bind(this);
    this.handleOpenStandalonePlayer = this.handleOpenStandalonePlayer.bind(
      this
    );
  }

  toggleAddMenu() {
    this.setState(state => {
      return { showAddMenu: !state.showAddMenu };
    });
  }

  componentDidUpdate(_, prevState) {
    if (
      prevState.showAddMenu !== this.state.showAddMenu &&
      this.state.showAddMenu
    ) {
      setTimeout(() => {
        this.searchInput.focus();
      }, 100);
    }
  }

  handleChangePanel(index) {
    this.setState(state => {
      const showAddMenu = index === 1;
      return { showAddMenu };
    });
  }

  handleOpenStandalonePlayer() {
    this.setState({ openStandalonePlayer: true });
  }

  panelClasses(standalone) {
    const { classes } = this.props;
    const classNames = [classes.panel];
    if (standalone) {
      classNames.push(classes.panelStandalone);
    }
    return classNames.join(' ');
  }

  render() {
    const { classes, currentUser, party } = this.props;
    const { showAddMenu, openStandalonePlayer } = this.state;

    const addToQueueClasses = [classes.addToQueue];
    if (!showAddMenu) {
      addToQueueClasses.push(classes.addToQueueHide);
    }

    return (
      <div className={classes.root}>
        <AppBar party={party} />
        <div className={classes.mainContent}>
          <PartyUiGrid hidePlayer={openStandalonePlayer}>
            <Player
              className={classes.mainPlayer}
              videoId={party.current.videoId}
              isPlaying={party.current.isPlaying}
            />
            <div>
              <SwipeableViews
                enableMouseEvents
                index={showAddMenu ? 1 : 0}
                onChangeIndex={this.handleChangePanel}
              >
                <div className={this.panelClasses(openStandalonePlayer)}>
                  <Current
                    onOpenStandalonePlayer={this.handleOpenStandalonePlayer}
                    current={party.current}
                    {...{ currentUser, openStandalonePlayer }}
                  />
                  <Divider />
                  <Queue queue={party.queue} />
                </div>
                <div className={this.panelClasses(openStandalonePlayer)}>
                  <div className={classes.panelControlWrap}>
                    <IconButtonWithTooltip
                      tooltipTitle="Back to playlist"
                      tooltipPlacement="right"
                      className={classes.panelControl}
                      onClick={this.toggleAddMenu}
                    >
                      <ArrowBackIcon />
                    </IconButtonWithTooltip>
                  </div>
                  <AddToQueue
                    className={addToQueueClasses.join(' ')}
                    queue={party.queue}
                    onAddQueue={this.toggleAddMenu}
                    inputRef={input => (this.searchInput = input)}
                  />
                </div>
              </SwipeableViews>
              <Zoom in={!showAddMenu}>
                <Button
                  variant="fab"
                  className={classes.fab}
                  color="primary"
                  onClick={this.toggleAddMenu}
                >
                  <AddIcon />
                </Button>
              </Zoom>
            </div>
          </PartyUiGrid>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(PartyPage);
