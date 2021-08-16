import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { joinParty } from '../../actions/partyActions';
import JoinForm from './JoinForm';

export class Join extends Component {
  static propTypes = {
    children: PropTypes.node,
    userName: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.handlePartySet = this.handlePartySet.bind(this);
  }

  handlePartySet(partyId) {
    this.props.dispatch(joinParty(partyId));
  }

  render() {
    const { error, inProgress, userName } = this.props;
    return (
      <JoinForm
        userName={userName}
        onPartySet={this.handlePartySet}
        inProgress={inProgress}
        error={error}
      />
    );
  }
}

export default connect(({ currentUser, ui }) => {
  return {
    userName: currentUser.name,
    inProgress: ui.partyJoinInProgress,
    error: ui.partyJoinError,
  };
})(Join);
