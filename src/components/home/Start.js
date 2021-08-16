import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { newParty } from '../../actions/partyActions';
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

  handlePartySet(party) {
    this.props.dispatch(newParty(party));
  }

  render() {
    const { userName } = this.props;
    return <StartForm userName={userName} onPartySet={this.handlePartySet} />;
  }
}

export default connect(({ currentUser, ui }) => {
  return {
    userName: currentUser.name,
  };
})(Start);
