import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
  nameInput: {
		textAlign: 'center',
  },

  labelFormControl: {
		left: '50%',
		transform: 'translate(-50%, 24px) scale(1)',
		transformOrigin: 'top center',
  },

  labelShrink: {
		transform: 'translate(-50%, 1.5px) scale(0.75)',
		transformOrigin: 'top center',
  },

});

const CenterTextField = props => {
	const { classes } = props;
	const inputLabel = {
	  formControl: classes.labelFormControl,
	  shrink: classes.labelShrink
	};
	const filteredProps = Object.assign({}, props);
	delete filteredProps.classes;
	return (
		<TextField
			{...filteredProps}

			inputProps={ {className: classes.nameInput} }
			InputLabelProps={ {classes: inputLabel} }
		/>
	);
};

CenterTextField.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(CenterTextField);
