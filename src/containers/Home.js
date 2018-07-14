import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

import CenterTextField from 'components/ytk/CenterTextField';
import HomeButton from 'components/ytk/HomeButton';
import microphoneBg from '../images/microphone02.jpg';

const styles = theme => ({
  home: {
	backgroundImage: `url('${microphoneBg}')`,
	backgroundSize: 'cover',
	minHeight: '100vh',
	padding: theme.spacing.unit,
	textAlign: 'center',
  },

  mainTitle: {
	...theme.typography.display4,
	fontWeight: 100,
	color: theme.palette.text.primary,
	margin: '75px 0 0 0',
  },

  subHeading: {
	...theme.typography.display1,
	marginBottom: '68px',
  },

  actions: {
	paddingTop: '40px',
  },

  paperRoot: {
	margin: '40px auto 0',
	fontWeight: 300,
	maxWidth: '320px',
	padding: '10px 40px 80px',
  }

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
	  <div className={ classes.home }>
		<Paper className={ classes.paperRoot }>
		  <h1 className={classes.mainTitle}>Okee!</h1>
		  <p className={classes.subHeading}>YouTube-Powered Karaoke</p>
		  <div className={classes.body}>
			<CenterTextField
			  fullWidth
			  id="name"
			  label="Who are you?"
			  placeholder="Name"
			  onChange={this.handleChangeName}
			/>
		  </div>
		  <div className={classes.actions}>
			<HomeButton disabled={!this.canContinue()}>
			  Party!
			</HomeButton>
		  </div>
		</Paper>
	  </div>
	);
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Home);
