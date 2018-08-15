import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

import PersonAddIcon from '@material-ui/icons/PersonAdd';

import ShareDialog from './ShareDialog';

const styles = theme => ({
  root: {},

  partyPerson: {
    cursor: 'default',

    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
});

class PartyGoersMenu extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = { showShareDialog: false };
    this.handleShowShareDialog = this.handleShowShareDialog.bind(this);
    this.handleCloseShareDialog = this.handleCloseShareDialog.bind(this);
  }

  handleShowShareDialog() {
    this.setState({ showShareDialog: true });
    this.props.onClose();
  }

  handleCloseShareDialog() {
    this.setState({ showShareDialog: false });
  }

  pickMenuProps() {
    const props = { ...this.props };
    delete props.className;
    delete props.classes;
    delete props.partyGoers;
    delete props.partyUrl;
    return props;
  }

  renderProfiles() {
    const { partyGoers, classes } = this.props;
    return partyGoers.map(user => (
      <MenuItem key={user.uid} className={classes.partyPerson}>
        <ListItemText>{user.name}</ListItemText>
      </MenuItem>
    ));
  }

  render() {
    const { className, classes, partyUrl } = this.props;
    const menuClassName = [className, classes.root].join(' ');
    const menuProps = this.pickMenuProps();

    return (
      <Fragment>
        <Menu id="party-goers" className={menuClassName} {...menuProps}>
          {this.renderProfiles()}
          <Divider />
          <MenuItem onClick={this.handleShowShareDialog}>
            <ListItemIcon>
              <PersonAddIcon />
            </ListItemIcon>
            <ListItemText>Share this Party</ListItemText>
          </MenuItem>
        </Menu>

        <ShareDialog
          open={this.state.showShareDialog}
          onClose={this.handleCloseShareDialog}
          partyUrl={partyUrl}
        />
      </Fragment>
    );
  }
}

export default withStyles(styles)(PartyGoersMenu);
