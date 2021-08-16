import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { currentUserShape, partyShape } from '../propTypes';
import { currentUserActions } from '../../actions';
import AppBar from './AppBar';
import PartyUiGrid from './PartyUiGrid';
import ConnectedPlayer from './ConnectedPlayer';
import ControlPanel from './ControlPanel';

import styles from './PartyPage.styles.js';

export class PartyPage extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    className: PropTypes.string,
    currentUser: currentUserShape.isRequired,
    party: partyShape.isRequired,
    signal: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      showAddMenu: !props.party.current,
    };
    this.handleToggleMenu = this.handleToggleMenu.bind(this);
    this.handleChangePanel = this.handleChangePanel.bind(this);
    this.handleStandalonePlayerClose = this.handleStandalonePlayerClose.bind(
      this
    );
  }

  componentDidMount() {
    this.props.signal.listen(
      'closeStandalonePlayer',
      this.handleStandalonePlayerClose
    );
  }

  componentWillUnmount() {
    this.props.signal.clear(
      'closeStandalonePlayer',
      this.handleStandalonePlayerClose
    );
  }

  handleToggleMenu() {
    this.setState(state => {
      return { showAddMenu: !state.showAddMenu };
    });
  }

  handleChangePanel(index) {
    this.setState(state => {
      const showAddMenu = index === 2;
      return { showAddMenu };
    });
  }

  handleStandalonePlayerClose() {
    this.props.dispatch(currentUserActions.standAlonePlayerOff());
  }

  renderPlayer(classes, party) {
    if (party.current) {
      return <ConnectedPlayer className={classes.mainPlayer} />;
    } else {
      return (
        <div className={classes.emptyQueueHelp}>
          <h1 className={classes.emptyQueueHeadline}>Let’s Go!</h1>
          <p>
            Use the search form to find a video. <br />
            Your video will then appear here.
          </p>
        </div>
      );
    }
  }

  render() {
    const { classes, currentUser, party } = this.props;
    const { showAddMenu } = this.state;

    return (
      <div className={classes.root}>
        <AppBar party={party} />
        <div className={classes.mainContent}>
          <PartyUiGrid hidePlayer={currentUser.standAlonePlayer}>
            <div id="video-main">{this.renderPlayer(classes, party)}</div>
            <ControlPanel
              onSearch={this.handleSearch}
              onChangePanel={this.handleChangePanel}
              onToggleMenu={this.handleToggleMenu}
              {...{
                currentUser,
                party,
                showAddMenu,
              }}
            />
          </PartyUiGrid>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(PartyPage);
