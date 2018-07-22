import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { currentUserActions, uiActions } from 'actions';
import HomePage from 'components/home/HomePage';
import NameForm from 'components/home/NameForm';
import Start from 'components/home/Start';
import Join from 'components/home/Join';

export class Home extends Component {
	static propTypes = {
		className: PropTypes.string,
		dispatch: PropTypes.func.isRequired,
		homeState: PropTypes.string.isRequired,
		currentUser: PropTypes.shape({
			name: PropTypes.string.isRequired,
			intent: PropTypes.string.isRequired
		}).isRequired,
	};

  constructor(props) {
		super(props);
		this.handleNameSet = this.handleNameSet.bind(this);
		this.handlePartySet = this.handlePartySet.bind(this);
		this.handleInputStarted = this.handleInputStarted.bind(this);
  }

	handleNameSet(name, intent) {
		this.props.dispatch(currentUserActions.setNameAndIntent(name, intent));
	}

	handlePartySet(partyId) {
		this.props.dispatch(currentUserActions.setParty(partyId));
	}

	handleInputStarted() {
		// this.setState({ inputStarted: true });
		this.props.dispatch(uiActions.setHomeState('inputStarted'));
	}

	renderHomeBody() {
		const { currentUser } = this.props;
		if (currentUser.name) {
			if (currentUser.intent === "join") {
				return (
					<Join
						onPartySet={this.handlePartySet}
						userName={currentUser.name}
					/>
				);
			}
			return (
				<Start
					onPartySet={this.handlePartySet}
					userName={currentUser.name}
				/>
			);
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
		return (
			<HomePage inputStarted={this.props.homeState === 'inputStarted'}>
				{ this.renderHomeBody() }
			</HomePage>
		);
  }
}

export default connect((state, props) => {
	const { currentUser, ui } = state;
	return {
		currentUser,
		homeState: ui.homeState
	};

})(Home);

