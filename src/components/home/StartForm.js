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

export class StartForm extends Component {
  static propTypes = {
    children: PropTypes.node,
    classes: PropTypes.object.isRequired,
    userName: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = { name: '' };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.inputRef = React.createRef();
  }

  componentDidMount() {
    this.inputRef.current.focus();
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
            inputRef={this.inputRef}
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
