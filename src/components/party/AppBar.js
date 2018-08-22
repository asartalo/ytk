import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import MaterialAppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';

import GroupIcon from '@material-ui/icons/Group';

import { idToFullUrl } from 'helpers/party';
import micIcon from 'images/okee_logo_1.svg';
import PartyGoersMenu from './PartyGoersMenu';

const minHeight = '56px';
const styles = theme => ({
  root: {
    flexGrow: 1,
  },

  appBar: {
    // backgroundColor: theme.palette.type === 'dark' ? 'inherit' : '#fff',
  },

  toolBar: {
    minHeight: minHeight,
  },

  title: {
    flex: 1,
    fontSize: '20px',
  },

  partyGoers: {
    color: '#fff',
  },

  userBadge: {
    top: 2,
    right: -4,
    // backgroundColor: 'black',
  },

  menuButton: {
    marginLeft: -12,
    marginRight: 20,
    backgroundColor: theme.palette.primary.main,
    color: '#fff',

    '&:hover': {
      backgroundColor: '#000',
    },
  },

  logo: {
    width: theme.spacing.unit * 5,
    filter: 'invert(1)',
  },
});

class AppBar extends Component {
  constructor(props) {
    super(props);
    this.state = { partyGoersAnchor: null };
    this.togglePartyGoers = this.togglePartyGoers.bind(this);
    this.closePartyGoers = this.closePartyGoers.bind(this);
  }

  togglePartyGoers(e) {
    const target = e.currentTarget;
    this.setState(state => ({
      partyGoersAnchor: Boolean(state.partyGoersAnchor) ? null : target,
    }));
  }

  closePartyGoers() {
    this.setState({ partyGoersAnchor: null });
  }

  render() {
    const { classes, party } = this.props;
    // mic by sasicreatives from the Noun Project
    return (
      <div className={classes.root} id="party-app-bar">
        <MaterialAppBar
          className={classes.appBar}
          position="fixed"
          color="primary"
          elevation={1}
        >
          <Toolbar className={classes.toolBar}>
            <IconButton
              className={classes.menuButton}
              aria-label="Menu"
              title="Okee! Home"
            >
              <Link to="/">
                <img src={micIcon} alt="Okee Icon" className={classes.logo} />
              </Link>
            </IconButton>

            <Typography
              variant="display1"
              color="inherit"
              className={classes.title}
            >
              {party.name || 'Okee!'}
            </Typography>

            <div>
              <Badge
                classes={{ badge: classes.userBadge }}
                badgeContent={party.users.length}
                color="default"
              >
                <IconButton onClick={this.togglePartyGoers}>
                  <GroupIcon className={classes.partyGoers} />
                </IconButton>
              </Badge>
              <PartyGoersMenu
                anchorEl={this.state.partyGoersAnchor}
                open={Boolean(this.state.partyGoersAnchor)}
                onClose={this.closePartyGoers}
                partyGoers={party.users}
                partyUrl={idToFullUrl(party.id)}
              />
            </div>
          </Toolbar>
        </MaterialAppBar>
      </div>
    );
  }
}

AppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AppBar);
