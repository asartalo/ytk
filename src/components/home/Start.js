import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { newParty } from 'actions/partyActions';
import StartForm from './StartForm';

export function Start(props) {
  const { dispatch, userName } = props;
  const handlePartySet = party => {
    dispatch(newParty(party));
  };

  return <StartForm userName={userName} onPartySet={handlePartySet} />;
}

Start.propTypes = {
  children: PropTypes.node,
  userName: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default connect(state => {
  return { userName: state.currentUser.name };
})(Start);
