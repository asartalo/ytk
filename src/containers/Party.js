import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import { partyActions } from 'actions';
import { currentUserShape, partyShape } from 'components/propTypes';
import Body from 'components/ytk/Body';
import ProgressOrChildren from 'components/ProgressOrChildren';
import PartyPage from 'components/party/PartyPage';
import PartyPlayerPage from 'components/party/PartyPlayerPage';

import queueData from 'components/party/staticQueueData';

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
    const { currentUser, match, party, partyGetInProgress } = this.props;
    const queue = [...queueData];
    const current = queue.shift();
    return (
      <Body className="Party">
        <ProgressOrChildren inProgress={partyGetInProgress}>
          <Switch>
            <Route
              exact
              path={match.url}
              render={props => (
                <PartyPage {...{ currentUser, party, queue, current }} />
              )}
            />
            <Route
              exact
              path={match.url + '/player'}
              render={props => (
                <PartyPlayerPage {...{ currentUser, party, queue, current }} />
              )}
            />
          </Switch>
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
