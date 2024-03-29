import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import MaterialAppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';

import { partyShape } from '../propTypes';
import { idToFullUrl } from '../../helpers/party';
import micIcon from '../../images/okee_logo_1.svg';
import GroupButton from './GroupButton';
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

  userBadge: {
    top: 10,
    right: 6,
    // backgroundColor: 'black',
  },

  menuButton: {
    marginLeft: -6,
    marginRight: 10,
    padding: 6,
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    transition: theme.transitions.duration.standard,

    '&:hover': {
      backgroundColor: '#000',
      transform: `scale(1.3, 1.3)`,
    },
  },

  logo: {
    width: theme.spacing(5),
    filter: 'invert(1)',
  },
});

export class AppBar extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    party: partyShape.isRequired,
  };

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

            <Typography variant="h4" color="inherit" className={classes.title}>
              {party.name || 'Okee!'}
            </Typography>

            <div>
              <Badge
                classes={{ badge: classes.userBadge }}
                badgeContent={party.users.length}
                color="default"
              >
                <GroupButton onClick={this.togglePartyGoers} />
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

export default withStyles(styles)(AppBar);
