import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { currentUserShape, firestoreShape } from 'components/propTypes';
import { currentUserActions } from 'actions';
import HomePage from 'components/home/HomePage';
import NameForm from 'components/home/NameForm';
import Start from 'components/home/Start';
import Join from 'components/home/Join';
import ChooseParty from 'components/home/ChooseParty';
import uiState from 'components/home/uiState';

export class Home extends Component {
  static propTypes = {
    className: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    currentUser: currentUserShape.isRequired,
    firestore: firestoreShape.isRequired,
  };

  constructor(props) {
    super(props);
    this.handleNameSet = this.handleNameSet.bind(this);
    this.handleInputStarted = this.handleInputStarted.bind(this);
    this.handleSetIntent = this.handleSetIntent.bind(this);
  }

  handleNameSet(name, intent) {
    this.props.dispatch(currentUserActions.setName(name, intent));
  }

  handleInputStarted() {
    this.props.dispatch(currentUserActions.setHomeState('inputStarted'));
  }

  handleSetIntent(intent) {
    this.props.dispatch(currentUserActions.setIntent(intent));
  }

  renderHomeBody() {
    const { currentUser } = this.props;
    switch (uiState(this.props)) {
      case 'choose_party':
        return (
          <ChooseParty
            userName={currentUser.name}
            onSetIntent={this.handleSetIntent}
            parties={[currentUser.party]}
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
            onNameSet={this.handleNameSet}
            onInputStarted={this.handleInputStarted}
          />
        );
    }
  }

  render() {
    const { currentUser } = this.props;
    return (
      <HomePage homeState={currentUser.homeState}>
        {this.renderHomeBody()}
      </HomePage>
    );
  }
}

export default connect((state, props) => {
  const { currentUser, firestore } = state;
  return { currentUser, firestore };
})(Home);
