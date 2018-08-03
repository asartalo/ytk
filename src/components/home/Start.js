import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { newParty } from 'actions/partyActions';
import { clearNewPartyCreated } from 'actions/uiActions';
import StartForm from './StartForm';

export class Start extends Component {
  static propTypes = {
    children: PropTypes.node,
    userName: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.handlePartySet = this.handlePartySet.bind(this);
  }

  componentWillUnmount() {
    this.props.dispatch(clearNewPartyCreated());
  }

  handlePartySet(party) {
    this.props.dispatch(newParty(party));
  }

  render() {
    const { newPartyCreated, userName } = this.props;
    if (newPartyCreated) {
      const redirectPath = `/${newPartyCreated}`;
      return <Redirect to={redirectPath} />;
    } else {
      return <StartForm userName={userName} onPartySet={this.handlePartySet} />;
    }
  }
}

export default connect(({ currentUser, ui }) => {
  return {
    userName: currentUser.name,
    newPartyCreated: ui.newPartyCreated,
  };
})(Start);
