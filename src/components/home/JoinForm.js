import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import ProgressOrChildren from 'components/ProgressOrChildren';
import HomeButton from 'components/ytk/HomeButton';

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

export class JoinForm extends Component {
  static propTypes = {
    children: PropTypes.node,
    classes: PropTypes.object.isRequired,
    userName: PropTypes.string.isRequired,
    inProgress: PropTypes.bool.isRequired,
    onPartySet: PropTypes.func.isRequired,
    error: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = { id: '' };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePartyIdChange = this.handlePartyIdChange.bind(this);
    this.inputRef = React.createRef();
  }

  componentDidMount() {
    this.inputRef.current.focus();
  }

  cleanupId(str) {
    let cleaned = str.trim();
    const url = cleaned.match(/^https?:\/\/[^/]+\/([^/]+)/);
    if (url) {
      return url[1];
    }
    return cleaned;
  }

  handlePartyIdChange(e) {
    this.setState({ id: this.cleanupId(e.target.value) });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.onPartySet(this.state.id);
  }

  render() {
    const { classes, error, inProgress, userName } = this.props;

    return (
      <div className="JoinForm">
        <h1 className={classes.mainTitle}>Hello, {userName}</h1>
        <p>Paste the link or the ID of the party to join</p>
        <form onSubmit={this.handleSubmit}>
          <TextField
            fullWidth
            required
            error={!!error}
            helperText={error}
            label="Party Link or ID"
            inputRef={this.inputRef}
            id="join-party-id"
            onChange={this.handlePartyIdChange}
          />
          <div className={classes.spacer}>
            <ProgressOrChildren inProgress={inProgress}>
              <HomeButton type="submit">Join the Party!</HomeButton>
            </ProgressOrChildren>
          </div>
        </form>
      </div>
    );
  }
}

export default withStyles(styles)(JoinForm);
