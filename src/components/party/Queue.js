import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ClearIcon from '@material-ui/icons/Clear';

import { arrayOfQueueVideo, arrayOfProfiles } from '../propTypes';
import { findUserNameFromId } from '../../helpers/party';
import { removeFromQueue } from '../../actions/partyActions';
import IconButtonWithTooltip from '../ytk/IconButtonWithTooltip';
import VideoListItem from './VideoListItem';

const styles = theme => ({
  root: {},

  thumbnail: {
    maxHeight: 40,
  },

  clearButton: {
    opacity: 0.5,
    width: 32,
    height: 32,

    '&:hover': {
      opacity: 1,
    },

    '&:active': {
      opacity: 1,
    },
  },

  clearIcon: {
    width: 16,
    height: 16,
  },
});

export class Queue extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    className: PropTypes.string,
    queue: arrayOfQueueVideo.isRequired,
    users: arrayOfProfiles.isRequired,
  };

  constructor(props) {
    super(props);
    this.handleClearItem = this.handleClearItem.bind(this);
  }

  handleClearItem(item) {
    this.props.dispatch(removeFromQueue(item));
  }

  renderQueueItems() {
    const { queue, users, classes } = this.props;
    return queue.map((item, i) => (
      <VideoListItem
        key={item.queueId}
        video={item}
        addedBy={findUserNameFromId(item.addedBy, users)}
        secondaryAction={
          <IconButtonWithTooltip
            tooltipTitle="Remove item"
            tooltipPlacement="top"
            className={classes.clearButton}
            onClick={() => this.handleClearItem(item)}
          >
            <ClearIcon className={classes.clearIcon} />
          </IconButtonWithTooltip>
        }
      />
    ));
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <List subheader={<ListSubheader>Up Next:</ListSubheader>}>
          {this.renderQueueItems()}
        </List>
      </div>
    );
  }
}

export default connect(state => ({}))(withStyles(styles)(Queue));
