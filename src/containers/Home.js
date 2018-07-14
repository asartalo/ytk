import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import CenterTextField from 'components/ytk/CenterTextField';
import HomeButton from 'components/ytk/HomeButton';

const styles = theme => ({
  home: {
	padding: theme.spacing.unit,
	textAlign: 'center',
  },

  mainTitle: {
	...theme.typography.display4,
	fontWeight: 300,
	color: theme.palette.text.primary,
  },

  actions: {
	paddingTop: '40px',
  },

});

class Home extends Component {
  constructor(props) {
	super(props);
	this.state = { name: '' };
	this.canContinue = this.canContinue.bind(this);
	this.handleChangeName = this.handleChangeName.bind(this)
  }

  canContinue() {
	return this.state.name && this.state.name.length > 0;
  }

  handleChangeName(e) {
	this.setState({ name: e.target.value });
  }

  render() {
	const { classes } = this.props;
	return (
	  <div className={classes.home}>
		<h1 className={classes.mainTitle}>Okee!</h1>
		<h2>Who are you?</h2>
		<div className={classes.body}>
		  <CenterTextField
			autoFocus
			id="name"
			label="Name"
			onChange={this.handleChangeName}
		  />
		</div>
		<div className={classes.actions}>
		  <HomeButton disabled={!this.canContinue()}>
			Start a Party!
		  </HomeButton>
		</div>
	  </div>
	);
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Home);
