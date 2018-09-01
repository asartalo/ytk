import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';
import Divider from '@material-ui/core/Divider';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import IconButtonWithTooltip from 'components/ytk/IconButtonWithTooltip';
import FabAddButton from './FabAddButton';
import Current from './Current';
import Queue from './Queue';
import AddToQueue from './AddToQueue';
import If from 'components/If';

const styles = theme => ({
  root: {},

  panel: {
    overflow: 'auto',
    height: 'calc(100vh - 56px)',

    [theme.breakpoints.down('sm')]: {
      overflow: 'visible',
      height: 'auto',
    },
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

  fab: {
    position: 'fixed',
    bottom: 24,
    right: 24,
  },
});

class ControlPanel extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    children: PropTypes.node,
    className: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.handleToggleMenu = this.handleToggleMenu.bind(this);
    this.handleChangePanel = this.handleChangePanel.bind(this);
    this.handleAddToQueue = this.handleAddToQueue.bind(this);
  }

  handleChangePanel() {
    this.props.onChangePanel();
  }

  handleToggleMenu() {
    this.props.onToggleMenu();
  }

  handleAddToQueue() {
    this.handleToggleMenu();
  }

  componentDidMount() {
    if (this.props.showAddMenu) {
      this.searchInput.focus();
    }
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.showAddMenu !== this.props.showAddMenu &&
      this.props.showAddMenu
    ) {
      setTimeout(() => {
        this.searchInput.focus();
      }, 100);
    }
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
    const { classes, party, showAddMenu, currentUser } = this.props;

    return (
      <div className={classes.root}>
        <SwipeableViews
          enableMouseEvents
          index={showAddMenu ? 1 : 0}
          onChangeIndex={this.handleChangePanel}
        >
          <div className={this.panelClasses(currentUser.standAlonePlayer)}>
            <If condition={party.current}>
              <Current />
            </If>
            <Divider />
            <Queue queue={party.queue} users={party.users} />
          </div>
          <div className={this.panelClasses(currentUser.standAlonePlayer)}>
            <div className={classes.panelControlWrap}>
              <IconButtonWithTooltip
                tooltipTitle="Back to playlist"
                tooltipPlacement="right"
                className={classes.panelControl}
                onClick={this.handleToggleMenu}
              >
                <ArrowBackIcon />
              </IconButtonWithTooltip>
            </div>
            <AddToQueue
              queue={party.queue}
              onAddToQueue={this.handleAddToQueue}
              inputRef={input => (this.searchInput = input)}
            />
          </div>
        </SwipeableViews>
        <FabAddButton
          show={!showAddMenu}
          className={classes.fab}
          onClick={this.handleToggleMenu}
        />
      </div>
    );
  }
}

export default withStyles(styles)(ControlPanel);
