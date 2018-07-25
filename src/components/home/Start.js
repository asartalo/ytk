import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import HomeButton from 'components/ytk/HomeButton';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
	mainTitle: {
		...theme.typography.display1,
		fontWeight: 300,
		color: theme.palette.text.primary,
	},
	spacer: {
		margin: `${theme.spacing.unit * 5}px`,
	},
});

class Start extends Component {
	static propTypes = {
		children: PropTypes.node,
		classes: PropTypes.object.isRequired,
		userName: PropTypes.string.isRequired,
	};

	render() {
		const { userName, classes } = this.props;
		return (
			<div className="Start">
				<h1 className={ classes.mainTitle }>Hello, { userName }</h1>
				<p>Let's get started!</p>
				<form>
					<TextField
						fullWidth
						required
						label="Party Name"
						id="new-party-name"
					/>
					<div className={ classes.spacer }>
						<HomeButton
							type="submit"
						>Start a Party</HomeButton>
					</div>
				</form>
			</div>
		);
	}
}

export default withStyles(styles)(Start);
