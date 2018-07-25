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
    width: '100%',
  },

  labelShrink: {
    transform: 'translate(-50%, 1.5px) scale(0.75)',
    transformOrigin: 'top center',
  },
});

function mergeClassNames(oldClass, newClass) {
  return `${oldClass} ${newClass}`.trim();
}

function orObject(old) {
  return old ? old : {};
}

function filterProps(props, classes) {
  let filteredProps = { ...props };

  let inputProps = orObject(filteredProps.inputProps);
  inputProps.className = mergeClassNames(
    inputProps.className,
    classes.nameInput
  );
  filteredProps.inputProps = inputProps;

  let InputLabelProps = orObject(filteredProps.InputLabelProps);
  InputLabelProps.classes = orObject(InputLabelProps.classes);
  InputLabelProps.classes.formControl = mergeClassNames(
    InputLabelProps.classes.formControl,
    classes.labelFormControl
  );
  InputLabelProps.classes.shrink = mergeClassNames(
    InputLabelProps.classes.shrink,
    classes.labelShrink
  );
  filteredProps.InputLabelProps = InputLabelProps;
  delete filteredProps.classes;
  return filteredProps;
}

const CenterTextField = props => {
  const { classes } = props;
  const filteredProps = filterProps(props, classes);
  return <TextField {...filteredProps} />;
};

CenterTextField.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CenterTextField);
