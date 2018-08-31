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
import PartyJoinPage from 'components/party/PartyJoinPage';

export class Party extends Component {
  static propTypes = {
    className: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    currentUser: currentUserShape.isRequired,
    party: partyShape.isRequired,
    match: PropTypes.object.isRequired,
    partyGetInProgress: PropTypes.bool.isRequired,
    partyJoinInProgress: PropTypes.bool.isRequired,
  };

  componentDidMount() {
    const { dispatch, match } = this.props;
    dispatch(partyActions.getParty(match.params.party));
  }

  componentDidUpdate(prevProps) {
    const { dispatch, match, partyJoinInProgress } = this.props;
    if (prevProps.partyJoinInProgress && !partyJoinInProgress) {
      dispatch(partyActions.getParty(match.params.party));
    }
  }

  componentWillUnmount() {
    const { dispatch, match } = this.props;
    dispatch(partyActions.unloadParty(match.params.party));
  }

  render() {
    const {
      currentUser,
      match,
      party,
      partyGetInProgress,
      dispatch,
    } = this.props;
    return (
      <Body className="Party">
        <ProgressOrChildren inProgress={partyGetInProgress} fullscreen>
          <Switch>
            <Route
              exact
              path={match.url}
              render={props => (
                <PartyPage {...{ currentUser, party, dispatch }} />
              )}
            />
            <Route
              exact
              path={match.url + '/player'}
              render={props => (
                <PartyPlayerPage {...{ currentUser, party, dispatch }} />
              )}
            />
            <Route
              exact
              path={match.url + '/join'}
              render={props => (
                <PartyJoinPage
                  {...{ currentUser, dispatch, partyId: match.params.party }}
                />
              )}
            />
          </Switch>
        </ProgressOrChildren>
      </Body>
    );
  }
}

export default connect((state, props) => {
  const { currentUser, party, ui } = state;

  return {
    currentUser,
    party,
    partyGetInProgress: ui.partyGetInProgress,
    partyJoinInProgress: ui.partyJoinInProgress,
  };
})(Party);
