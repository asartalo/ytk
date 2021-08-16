import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { currentUserShape, firestoreShape } from '../components/propTypes';
import { currentUserActions } from '../actions';
import HomePage from '../components/home/HomePage';
import NameForm from '../components/home/NameForm';
import Start from '../components/home/Start';
import Join from '../components/home/Join';
import ChooseParty from '../components/home/ChooseParty';
import uiState from '../components/home/uiState';

export function Home(props) {
  const { currentUser, dispatch } = props;

  function handleSetIntent(intent) {
    dispatch(currentUserActions.setIntent(intent));
  }

  function handleNameSet(userName, intent) {
    dispatch(currentUserActions.setName(userName, intent));
  }

  function handleInputStarted() {
    dispatch(currentUserActions.setHomeState('inputStarted'));
  }

  const renderHomeBody = () => {
    switch (uiState(props)) {
      case 'choose_party':
        return (
          <ChooseParty
            userName={currentUser.name}
            onSetIntent={handleSetIntent}
            parties={currentUser.party ? [currentUser.party] : []}
          />
        );
      case 'join_party':
        return <Join />;
      case 'start_party':
        return <Start />;
      default:
        return (
          <NameForm
            userName={currentUser.name}
            onNameSet={handleNameSet}
            onInputStarted={handleInputStarted}
          />
        );
    }
  };

  return (
    <HomePage homeState={currentUser.homeState}>{renderHomeBody()}</HomePage>
  );
}

Home.propTypes = {
  className: PropTypes.string,
  dispatch: PropTypes.func.isRequired,
  currentUser: currentUserShape.isRequired,
  firestore: firestoreShape.isRequired,
};

export default connect((state, props) => {
  const { currentUser, firestore } = state;
  return { currentUser, firestore };
})(Home);
