import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { currentUserShape, partyShape } from 'components/propTypes';
import AppBar from './AppBar';
import PartyUiGrid from './PartyUiGrid';
import Player from 'components/video/Player';
import ControlPanel from './ControlPanel';

import styles from './PartyPage.styles.js';

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
    this.handleToggleMenu = this.handleToggleMenu.bind(this);
    this.handleChangePanel = this.handleChangePanel.bind(this);
    this.handleToggleStandalonePlayer = this.handleToggleStandalonePlayer.bind(
      this
    );
  }

  handleToggleMenu() {
    this.setState(state => {
      return { showAddMenu: !state.showAddMenu };
    });
  }

  handleChangePanel(index) {
    this.setState(state => {
      const showAddMenu = index === 1;
      return { showAddMenu };
    });
  }

  handleToggleStandalonePlayer() {
    this.setState(state => ({
      openStandalonePlayer: !state.openStandalonePlayer,
    }));
  }

  render() {
    const { classes, currentUser, party } = this.props;
    const { showAddMenu, openStandalonePlayer } = this.state;

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
            <ControlPanel
              onChanePanel={this.handleChangePanel}
              onToggleStandalonePlayer={this.handleToggleStandalonePlayer}
              onToggleMenu={this.handleToggleMenu}
              {...{
                currentUser,
                party,
                showAddMenu,
                openStandalonePlayer,
              }}
            />
          </PartyUiGrid>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(PartyPage);
