import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

import microphoneBg from 'images/microphone02.jpg';

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

  paperRoot: {
		margin: '40px auto 0',
		fontWeight: 300,
		maxWidth: '320px',
		padding: '10px 40px 80px',
  }

});

function HomePage(props) {
	const { classes, children } = props;
	return (
		<div className={ classes.home }>
			<Paper className={ classes.paperRoot }>
				<h1 className={ classes.mainTitle }>Okee!</h1>
				<p className={ classes.subHeading }>YouTube-Powered Karaoke</p>
				<div className={ classes.body }>
					{ children }
				</div>
			</Paper>
		</div>
	);
}

HomePage.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(HomePage);

