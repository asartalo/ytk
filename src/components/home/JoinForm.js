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

class JoinForm extends Component {
  static propTypes = {
    children: PropTypes.node,
    classes: PropTypes.object.isRequired,
    userName: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { id: '' };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePartyIdChange = this.handlePartyIdChange.bind(this);
  }

  handlePartyIdChange(e) {
    this.setState({ id: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.onPartySet(this.state.id);
  }

  render() {
    const { userName, classes } = this.props;
    return (
      <div className="JoinForm">
        <h1 className={classes.mainTitle}>Hello, {userName}</h1>
        <p>Paste the link or the ID of the party to join</p>
        <form onSubmit={this.handleSubmit}>
          <TextField
            fullWidth
            required
            label="Party Link or ID"
            id="new-party-id"
            onChange={this.handlePartyIdChange}
          />
          <div className={classes.spacer}>
            <HomeButton type="submit">Join the Party!</HomeButton>
          </div>
        </form>
      </div>
    );
  }
}

export default withStyles(styles)(JoinForm);
