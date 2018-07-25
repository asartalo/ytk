import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import CenterTextField from 'components/ytk/CenterTextField';
import HomeButton from 'components/ytk/HomeButton';
import Button from '@material-ui/core/Button';

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
	}
});

class NameForm extends Component {
	static propTypes = {
		classes: PropTypes.object.isRequired,
		onNameSet: PropTypes.func.isRequired,
		onInputStarted: PropTypes.func.isRequired,
	}

  constructor(props) {
		super(props);
		this.state = { name: '', started: false };
		this.canContinue = this.canContinue.bind(this);
		this.handleChangeName = this.handleChangeName.bind(this);
		this.handleClickSubmit = this.handleClickSubmit.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleFocus = this.handleFocus.bind(this);
  }

  canContinue() {
		return this.state.name && this.state.name.length > 0;
  }

  handleChangeName(e) {
		this.setState({ name: e.target.value });
  }

	handleClickSubmit(e) {
		this.invokeOnNameSet(e, e.target.value);
	}

	handleSubmit(e) {
		this.invokeOnNameSet(e, "start");
	}

	invokeOnNameSet(e, intent) {
		e.preventDefault();
		if (!this.canContinue()) return;
		this.props.onNameSet(this.state.name, intent || "start");
	}

	handleFocus() {
		if ( this.state.started ) return;
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
						inputProps={ {className: classes.nameInput} }
						InputLabelProps={ { required: false, classes: { formControl: classes.inputLabel } } }
						onChange={this.handleChangeName}
						onFocus={this.handleFocus}
					/>
				</div>
				<div className={classes.actions}>
					<HomeButton
						color="primary"
						value="start"
						type="submit"
						name="intent"
						id="button-intent-start"
						disabled={!this.canContinue()}
						onClick={this.handleClickSubmit}
					>Start a Party!</HomeButton>
					<p>&nbsp;or&nbsp;</p>
					<Button
						disabled={!this.canContinue()}
						value="join"
						type="submit"
						name="intent"
						id="button-intent-join"
						onClick={this.handleClickSubmit}
					>Join a Party</Button>
				</div>
			</form>
		);
  }
}

export default withStyles(styles)(NameForm);

