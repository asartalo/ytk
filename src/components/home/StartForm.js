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

class StartForm extends Component {
  static propTypes = {
    children: PropTypes.node,
    classes: PropTypes.object.isRequired,
    userName: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { name: '' };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
  }

  handleNameChange(e) {
    this.setState({ name: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.onPartySet(this.state);
  }

  render() {
    const { userName, classes } = this.props;
    return (
      <div className="Start">
        <h1 className={classes.mainTitle}>Hello, {userName}</h1>
        <p>Let's get started!</p>
        <form onSubmit={this.handleSubmit}>
          <TextField
            fullWidth
            required
            label="Party Name"
            id="new-party-name"
            onChange={this.handleNameChange}
          />
          <div className={classes.spacer}>
            <HomeButton type="submit">Start a Party</HomeButton>
          </div>
        </form>
      </div>
    );
  }
}

export default withStyles(styles)(StartForm);
