import React, { Component } from 'react';
import { connect } from 'react-redux';

import NameForm from 'components/NameForm';
import HomePage from 'components/pages/HomePage';

export class Home extends Component {
  constructor(props) {
		super(props);
		this.handleNameSet = this.handleNameSet.bind(this);
  }

	handleNameSet(name) {
		console.log(name);
	}

	renderHomeBody() {
		return (<NameForm onNameSet={this.handleNameSet} />);
	}

  render() {
		return (
			<HomePage>
				{ this.renderHomeBody() }
			</HomePage>
		);
  }
}

export default connect((state, props) => {
	const { currentUser } = state;
	return { currentUser };

})(Home);
