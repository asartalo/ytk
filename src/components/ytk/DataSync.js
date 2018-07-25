import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { firestoreActions } from 'actions';

export class DataSync extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    signedIn: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
    userDataLoaded: PropTypes.bool.isRequired,
    uid: PropTypes.any,
  };

  componentWillMount() {
    const { dispatch, currentUser } = this.props;
    dispatch(firestoreActions.signInAnonymously(currentUser));
  }

  componentWillUpdate(props) {
    const { uid, userDataLoaded, dispatch, currentUser } = props;
    const userChanged = currentUser !== this.props.currentUser;
    if (userDataLoaded && userChanged) {
      dispatch(firestoreActions.saveUser(currentUser, uid));
    }
  }

  render() {
    return this.props.children || null;
  }
}

export default connect((state, props) => {
  const { firestore, currentUser } = state;
  return {
    signedIn: firestore.signedIn,
    uid: firestore.uid,
    userDataLoaded: firestore.userDataLoaded,
    // TODO: PROPTYPE better (use home.js definition)
    currentUser,
  };
})(DataSync);
