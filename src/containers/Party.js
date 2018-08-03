import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { partyActions } from 'actions';
import { currentUserShape, partyShape } from 'components/propTypes';
import Body from 'components/ytk/Body';

export class Party extends Component {
  static propTypes = {
    className: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    currentUser: currentUserShape.isRequired,
    party: partyShape.isRequired,
    match: PropTypes.object.isRequired,
  };

  componentWillMount() {
    const { dispatch, match } = this.props;
    dispatch(partyActions.getParty(match.params.party));
  }

  render() {
    const { party } = this.props;
    return (
      <Body className="Party">
        <h1>{party.name}</h1>
      </Body>
    );
  }
}

export default connect((state, props) => {
  const { currentUser, party } = state;
  return { currentUser, party };
})(Party);
