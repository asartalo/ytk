import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { joinParty } from 'actions/partyActions';
import { clearNewPartyJoined } from 'actions/uiActions';
import JoinForm from './JoinForm';

export class Join extends Component {
  static propTypes = {
    children: PropTypes.node,
    userName: PropTypes.string.isRequired,
    newPartyJoined: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.handlePartySet = this.handlePartySet.bind(this);
  }

  handlePartySet(partyId) {
    this.props.dispatch(joinParty(partyId));
  }

  componentWillUnmount() {
    this.props.dispatch(clearNewPartyJoined());
  }

  render() {
    const { newPartyJoined, userName } = this.props;
    if (newPartyJoined) {
      return <Redirect to={`/${newPartyJoined}`} />;
    }
    return <JoinForm userName={userName} onPartySet={this.handlePartySet} />;
  }
}

export default connect(({ currentUser, ui }) => {
  return {
    userName: currentUser.name,
    newPartyJoined: ui.newPartyJoined,
  };
})(Join);
