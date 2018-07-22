import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

import microphoneBg from 'images/microphone02.jpg';
import { easings } from '../../constants';

const styles = theme => ({
  home: {
		minHeight: '100vh',
		textAlign: 'center',
  },

  paperRoot: {
		fontWeight: 300,
		padding: '10px 20px 80px',
  },

  mainTitle: {
		...theme.typography.display4,
		fontWeight: 100,
		color: theme.palette.text.primary,
		margin: '75px 0 0 0',
		transition: easings.rubber,
  },

  subHeading: {
		...theme.typography.display1,
		marginBottom: '68px',
		transition: '500ms',
  },

	paperRootInputStarted: {
		'& $mainTitle': {
			transform: 'scale3d(0.6, 0.6, 1)',
			color: theme.palette.text.primary,
			margin: '10px 0 0',
		},

		'& $subHeading': {
			transform: 'scale3d(1, 0, 1)',
			opacity: 0,
			height: 0,
			margin: '0 0 20px',
		}
	},

	[theme.breakpoints.up('xs')]: {
		home: {
			padding: 0,
			backgroundImage: 'none',
		},
		paperRoot: {
			margin: 0,
			borderRadius: 0,
			minHeight: '100vh',
		}
	},

	[theme.breakpoints.up('sm')]: {
		home: {
			padding: theme.spacing.unit,
			backgroundImage: `url('${microphoneBg}')`,
			backgroundSize: 'cover',
		},
		paperRoot: {
			margin: '40px auto 0',
			maxWidth: '320px',
			minHeight: 'auto',
		}
	},
});

function HomePage(props) {
	const { classes, children, inputStarted } = props;
	const paperClasses = [classes.paperRoot];
	if (inputStarted) paperClasses.push(classes.paperRootInputStarted);
	return (
		<div className={ classes.home }>
			<Paper className={ paperClasses.join(" ") }>
				<h1 className={ classes.mainTitle }>Okee!</h1>
				<p className={ classes.subHeading }>YouTube-Powered<br />Karaoke Parties</p>
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

