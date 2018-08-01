import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StartForm from './StartForm';

class Start extends Component {
  static propTypes = {
    children: PropTypes.node,
    userName: PropTypes.string.isRequired,
    onPartySet: PropTypes.func.isRequired,
  };

  render() {
    const { userName, onPartySet } = this.props;
    return <StartForm userName={userName} onPartySet={onPartySet} />;
  }
}

export default Start;
