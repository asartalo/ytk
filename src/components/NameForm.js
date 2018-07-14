import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import CenterTextField from 'components/ytk/CenterTextField';
import HomeButton from 'components/ytk/HomeButton';

const styles = theme => ({
  actions: {
		paddingTop: '40px',
  },

});

class NameForm extends Component {
  constructor(props) {
		super(props);
		this.state = { name: '' };
		this.canContinue = this.canContinue.bind(this);
		this.handleChangeName = this.handleChangeName.bind(this);
		this.handleNameSubmit = this.handleNameSubmit.bind(this);
  }

  canContinue() {
		return this.state.name && this.state.name.length > 0;
  }

  handleChangeName(e) {
		this.setState({ name: e.target.value });
  }

	handleNameSubmit(e) {
		e.preventDefault();
		if (this.canContinue()) {
			this.props.onNameSet(this.state.name);
		}
	}

  render() {
		const { classes } = this.props;
		return (
			<form className={classes.root} onSubmit={this.handleNameSubmit}>
				<div className={classes.body}>
					<CenterTextField
						fullWidth
						required
						id="name"
						label="Who are you?"
						placeholder="Name"
						onChange={this.handleChangeName}
					/>
				</div>
				<div className={classes.actions}>
					<HomeButton disabled={!this.canContinue()} type="submit">
						Party!
					</HomeButton>
				</div>
			</form>
		);
  }
}

NameForm.propTypes = {
  classes: PropTypes.object.isRequired,
  onNameSet: PropTypes.func.isRequired,
}

export default withStyles(styles)(NameForm);

