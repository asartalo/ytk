import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

import HomeButton from 'components/ytk/HomeButton';
import UserParties from './UserParties';
import If from 'components/If';

const styles = theme => ({
  mainTitle: {
    ...theme.typography.display1,
    fontWeight: 300,
    color: theme.palette.text.primary,
  },

  divider: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 4,
  },

  subtitle: {
    ...theme.typography.subheading,
    marginBottom: theme.spacing.unit * 6,
  },
});

class ChooseParty extends Component {
  static defaultProps = {
    parties: [],
  };

  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    userName: PropTypes.string.isRequired,
    onSetIntent: PropTypes.func.isRequired,
    parties: PropTypes.array,
  };

  constructor(props) {
    super(props);
    this.handleSetIntent = this.handleSetIntent.bind(this);
  }

  handleSetIntent(e) {
    this.props.onSetIntent(e.currentTarget.value);
  }

  render() {
    const { classes, userName, parties } = this.props;
    return (
      <div className={classes.root}>
        <h1 className={classes.mainTitle}>Hello, {userName}</h1>
        <p className={classes.subtitle}>What do you want to do?</p>
        <If condition={parties.length > 0}>
          <UserParties parties={parties} />
          <Divider className={classes.divider} />
        </If>
        <HomeButton
          color="primary"
          value="start"
          name="intent"
          id="button-intent-start"
          onClick={this.handleSetIntent}
        >
          Start a Party!
        </HomeButton>
        <p>&nbsp;or&nbsp;</p>
        <Button
          value="join"
          name="intent"
          id="button-intent-join"
          color="default"
          variant="raised"
          onClick={this.handleSetIntent}
        >
          Join a Party
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(ChooseParty);
