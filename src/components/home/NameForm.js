import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import CenterTextField from '../ytk/CenterTextField';
import HomeButton from '../ytk/HomeButton';

const styles = theme => ({
  actions: {
    paddingTop: '40px',
  },

  nameInput: {
    fontSize: '30px',
  },

  inputLabel: {
    fontSize: '1.5rem',
    color: theme.palette.text.primary,
  },
});

class NameForm extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    onNameSet: PropTypes.func.isRequired,
    onInputStarted: PropTypes.func.isRequired,
    userName: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = { name: props.userName || '', started: false };
    [
      'canContinue',
      'handleChangeName',
      'handleClickSubmit',
      'handleSubmit',
      'handleFocus',
    ].forEach(method => {
      this[method] = this[method].bind(this);
    });
  }

  canContinue() {
    const { name } = this.state;
    return name && name.length > 0;
  }

  handleChangeName(e) {
    this.setState({ name: e.target.value });
  }

  handleClickSubmit(e) {
    this.invokeOnNameSet(e);
  }

  handleSubmit(e) {
    this.invokeOnNameSet(e);
  }

  invokeOnNameSet(e) {
    e.preventDefault();
    if (!this.canContinue()) return;
    this.props.onNameSet(this.state.name);
  }

  handleFocus() {
    if (this.state.started) return;
    this.setState({ started: true });
    this.props.onInputStarted();
  }

  render() {
    const { classes } = this.props;
    return (
      <form className={classes.root} onSubmit={this.handleSubmit}>
        <div className={classes.body}>
          <CenterTextField
            fullWidth
            required
            id="current-user-name-input"
            name="current-user-name"
            label="Who are you?"
            placeholder="Name"
            inputProps={{ className: classes.nameInput }}
            InputLabelProps={{
              required: false,
              classes: { formControl: classes.inputLabel },
            }}
            value={this.state.name}
            onChange={this.handleChangeName}
            onFocus={this.handleFocus}
          />
        </div>
        <div className={classes.actions}>
          <HomeButton
            color="primary"
            disabled={!this.canContinue()}
            type="submit"
            onClick={this.handleClickSubmit}
          >
            Next
          </HomeButton>
        </div>
      </form>
    );
  }
}

export default withStyles(styles)(NameForm);
