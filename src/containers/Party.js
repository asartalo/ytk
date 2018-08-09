import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { partyActions } from 'actions';
import { currentUserShape, partyShape } from 'components/propTypes';
import Body from 'components/ytk/Body';
import CircularProgress from '@material-ui/core/CircularProgress';

export class Party extends Component {
  static propTypes = {
    className: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    currentUser: currentUserShape.isRequired,
    party: partyShape.isRequired,
    match: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { dispatch, match } = this.props;
    dispatch(partyActions.getParty(match.params.party));
  }

  renderLoaderOrContent() {
    if (this.props.party.name) {
      return <h1>{this.props.party.name}</h1>;
    } else {
      return <CircularProgress />;
    }
  }

  render() {
    return <Body className="Party">{this.renderLoaderOrContent()}</Body>;
  }
}

export default connect((state, props) => {
  const { currentUser, party } = state;
  return { currentUser, party };
})(Party);
