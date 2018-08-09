import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { currentUserShape } from 'components/propTypes';
import { currentUserActions } from 'actions';
import HomePage from 'components/home/HomePage';
import NameForm from 'components/home/NameForm';
import Start from 'components/home/Start';
import Join from 'components/home/Join';

export class Home extends Component {
  static propTypes = {
    className: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    currentUser: currentUserShape.isRequired,
  };

  constructor(props) {
    super(props);
    this.handleNameSet = this.handleNameSet.bind(this);
    this.handleInputStarted = this.handleInputStarted.bind(this);
  }

  handleNameSet(name, intent) {
    this.props.dispatch(currentUserActions.setNameAndIntent(name, intent));
  }

  handleInputStarted() {
    this.props.dispatch(currentUserActions.setHomeState('inputStarted'));
  }

  renderHomeBody() {
    const { currentUser } = this.props;
    if (currentUser.name && currentUser.intent) {
      if (currentUser.intent === 'join') {
        return <Join />;
      }
      return <Start />;
    } else {
      return (
        <NameForm
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
  const { currentUser } = state;
  return { currentUser };
})(Home);
