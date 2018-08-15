import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { partyActions } from 'actions';
import { currentUserShape, partyShape } from 'components/propTypes';
import Body from 'components/ytk/Body';
import ProgressOrChildren from 'components/ProgressOrChildren';
import PartyPage from 'components/party/PartyPage';

export class Party extends Component {
  static propTypes = {
    className: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    currentUser: currentUserShape.isRequired,
    party: partyShape.isRequired,
    match: PropTypes.object.isRequired,
    partyGetInProgress: PropTypes.bool.isRequired,
  };

  componentDidMount() {
    const { dispatch, match } = this.props;
    dispatch(partyActions.getParty(match.params.party));
  }

  render() {
    const { currentUser, party, partyGetInProgress } = this.props;
    return (
      <Body className="Party">
        <ProgressOrChildren inProgress={partyGetInProgress}>
          <PartyPage {...{ currentUser, party }} />
        </ProgressOrChildren>
      </Body>
    );
  }
}

export default connect((state, props) => {
  // const { currentUser, party, ui } = state;

  // return {
  //   currentUser,
  //   party,
  //   partyGetInProgress: ui.partyGetInProgress
  // };
  return {
    currentUser: {
      name: 'Jesus Maria Jose',
      intent: '',
      party: '',
      homeState: 'start',
    },
    party: {
      name: 'Birthday Bash!',
      users: ['anid'],
      queue: [],
    },
    partyGetInProgress: false,
  };
})(Party);
