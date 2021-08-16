import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import { Link } from 'react-router-dom';

import { idToPath } from '../../helpers/party';

const styles = theme => ({
  root: {},

  item: {
    textAlign: 'center',
    display: 'inline-block',
  },
});

class UserParties extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    children: PropTypes.node,
    className: PropTypes.string,
    parties: PropTypes.array.isRequired,
  };

  renderParties() {
    const { parties, classes } = this.props;
    return parties.map(party => (
      <ListItem
        button
        key={party}
        component={Link}
        to={idToPath(party)}
        className={classes.item}
      >
        <strong>{party}</strong>
      </ListItem>
    ));
  }

  render() {
    return (
      <List subheader={<ListSubheader>Joined Parties:</ListSubheader>}>
        {this.renderParties()}
      </List>
    );
  }
}

export default withStyles(styles)(UserParties);
