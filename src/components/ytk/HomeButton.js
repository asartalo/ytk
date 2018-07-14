import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import MusicNoteIcon from '@material-ui/icons/MusicNote';

const styles = theme => ({
	button: {
		padding: '8px 32px 9px 16px',
	},
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
});

function HomeButton(props) {
	const {
		children,
		classes,
		disabled,
		onClick,
	} = props;
	return (
		<Button
			className={classes.button}
			variant="extendedFab"
			color="primary"
			aria-label="delete"
			onClick={onClick}
			disabled={disabled}
		>
			<MusicNoteIcon className={classes.extendedIcon} />
			{ children }
		</Button>
	);
}

HomeButton.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(HomeButton);

