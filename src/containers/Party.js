import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Route, Routes, useParams } from 'react-router-dom';
import { connect } from 'react-redux';

import { partyActions } from '../actions';
import { currentUserShape, partyShape } from '../components/propTypes';
import Signal from '../lib/signal';
import Body from '../components/ytk/Body';
import ProgressOrChildren from '../components/ProgressOrChildren';
import PartyPage from '../components/party/PartyPage';
import PartyPlayerPage from '../components/party/PartyPlayerPage';
import PartyJoinPage from '../components/party/PartyJoinPage';

export function Party({
  currentUser,
  party,
  partyGetInProgress,
  partyJoinInProgress,
  dispatch,
}) {
  const signal = new Signal(global.localStorage, global.window, Date.now);
  // const partyId = match.params.party;
  const partyId = useParams().party;

  const [prevPartyJoinInProgress, setPrevPartyGetInProgress] = useState(false);

  useEffect(() => {
    dispatch(partyActions.getParty(partyId));

    return () => {
      dispatch(partyActions.unloadParty(partyId));
    };
  }, [dispatch, partyId]);

  useEffect(() => {
    if (prevPartyJoinInProgress && !partyJoinInProgress) {
      dispatch(partyActions.getParty(partyId));
    }
    setPrevPartyGetInProgress(partyJoinInProgress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partyJoinInProgress, dispatch, partyId]);

  return (
    <Body className="Party">
      <ProgressOrChildren inProgress={partyGetInProgress} fullscreen>
        <Routes>
          <Route
            exact
            path="/"
            element={
              <PartyPage {...{ currentUser, party, dispatch, signal }} />
            }
          />
          <Route
            exact
            path="/player"
            element={
              <PartyPlayerPage {...{ currentUser, party, dispatch, signal }} />
            }
          />
          <Route
            exact
            path="/join"
            render={<PartyJoinPage {...{ currentUser, dispatch, partyId }} />}
          />
        </Routes>
      </ProgressOrChildren>
    </Body>
  );
}

Party.propTypes = {
  className: PropTypes.string,
  dispatch: PropTypes.func.isRequired,
  currentUser: currentUserShape.isRequired,
  party: partyShape.isRequired,
  partyGetInProgress: PropTypes.bool.isRequired,
  partyJoinInProgress: PropTypes.bool.isRequired,
};

export default connect((state, props) => {
  const { currentUser, party, ui } = state;

  return {
    currentUser,
    party,
    partyGetInProgress: ui.partyGetInProgress,
    partyJoinInProgress: ui.partyJoinInProgress,
  };
})(Party);
