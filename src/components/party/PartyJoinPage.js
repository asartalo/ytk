import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { currentUserActions, partyActions } from 'actions';
import { currentUserShape } from 'components/propTypes';
import IfElse from 'components/IfElse';
import HomePage from 'components/home/HomePage';
import NameForm from 'components/home/NameForm';
import HomeButton from 'components/ytk/HomeButton';

const styles = theme => ({
  helpText: {
    lineHeight: theme.typography.body1.lineHeight,
    marginTop: theme.spacing.unit * -4,
    marginBottom: theme.spacing.unit * 5,
  },
});

export class PartyJoinPage extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    children: PropTypes.node,
    className: PropTypes.string,
    currentUser: currentUserShape,
  };

  constructor(props) {
    super(props);
    this.handleNameSet = this.handleNameSet.bind(this);
    this.handleJoin = this.handleJoin.bind(this);
  }

  handleNameSet(name) {
    this.props.dispatch(currentUserActions.setName(name));
  }

  handleJoin() {
    const { dispatch, partyId } = this.props;
    dispatch(partyActions.joinParty(partyId));
  }

  render() {
    const { classes, currentUser, partyId } = this.props;
    return (
      <HomePage
        homeState="join"
        subtext={
          currentUser.name ? `Hello, ${currentUser.name}` : 'Join the Party!'
        }
      >
        <IfElse condition={currentUser.name}>
          <div>
            <p className={classes.helpText}>
              You can now join <br />
              <strong>{partyId}</strong>
            </p>
            <HomeButton id="join-button" onClick={this.handleJoin}>
              All Right!
            </HomeButton>
          </div>
          <NameForm
            onNameSet={this.handleNameSet}
            onInputStarted={function() {}}
          />
        </IfElse>
      </HomePage>
    );
  }
}

export default withStyles(styles)(PartyJoinPage);
