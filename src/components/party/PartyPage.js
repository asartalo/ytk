import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
// import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import SwipeableViews from 'react-swipeable-views';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Zoom from '@material-ui/core/Zoom';

import { currentUserShape, partyShape } from 'components/propTypes';
import AppBar from './AppBar';
import Player from 'components/video/Player';
import Current from './Current';
import Queue from './Queue';
import AddToQueue from './AddToQueue';
import queueData from './staticQueueData';

const themeToggle = (theme, light, dark) => {
  return theme.palette.type === 'dark' ? dark : light;
};
const styles = theme => ({
  root: {},

  mainContent: {
    width: '100%',
  },

  videoContainer: {
    paddingTop: 56,
    maxHeight: '100vh',
    backgroundColor: 'black',
  },

  sidePanel: {
    paddingTop: 56,
    backgroundColor: theme.palette.background.default,
    borderLeft: `1px solid ${
      theme.palette.grey[themeToggle(theme, '300', '800')]
    }`,
    overflow: 'hidden',
    position: 'relative',

    [theme.breakpoints.down('sm')]: {
      paddingTop: 0,
      maxHeight: 'auto',
    },
  },

  panel: {
    overflow: 'auto',
    height: 'calc(100vh - 56px)',
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
    const queue = [...queueData];
    this.state = {
      queue,
      current: queue.shift(),
      showAddMenu: false,
    };
    this.toggleAddMenu = this.toggleAddMenu.bind(this);
    this.handleChangePanel = this.handleChangePanel.bind(this);
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

  render() {
    const { classes, currentUser, party } = this.props;

    const { queue, current, showAddMenu } = this.state;
    const showPlayer = true;

    const addToQueueClasses = [classes.addToQueue];
    if (!showAddMenu) {
      addToQueueClasses.push(classes.addToQueueHide);
    }

    return (
      <div className={classes.root}>
        <AppBar party={party} />
        <div className={classes.mainContent}>
          <Grid container spacing={0}>
            <Grid
              item
              xs={12}
              sm={12}
              md={8}
              lg={9}
              className={classes.videoContainer}
            >
              <Player
                className={classes.mainPlayer}
                videoId={current.videoId}
              />
            </Grid>
            <Grid
              item
              className={classes.sidePanel}
              xs={12}
              sm={12}
              md={4}
              lg={3}
            >
              <SwipeableViews
                enableMouseEvents
                index={showAddMenu ? 1 : 0}
                onChangeIndex={this.handleChangePanel}
              >
                <div className={classes.panel}>
                  <Current {...{ current }} />
                  <Divider />
                  <Queue queue={queue} />
                </div>
                <div className={classes.panel}>
                  <div className={classes.panelControlWrap}>
                    <Tooltip title="Back to playlist" placement="right">
                      <IconButton
                        className={classes.panelControl}
                        onClick={this.toggleAddMenu}
                      >
                        <ArrowBackIcon />
                      </IconButton>
                    </Tooltip>
                  </div>
                  <AddToQueue
                    className={addToQueueClasses.join(' ')}
                    queue={queue}
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
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(PartyPage);
