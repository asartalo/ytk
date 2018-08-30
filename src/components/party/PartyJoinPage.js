import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {},
});

class PartyJoinPage extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    children: PropTypes.node,
    className: PropTypes.string,
  };

  render() {
    const { classes } = this.props;
    return <h1>Join the Party</h1>;
  }
}

export default withStyles(styles)(PartyJoinPage);
