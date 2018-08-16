import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ClearIcon from '@material-ui/icons/Clear';

import IconButtonWithTooltip from 'components/ytk/IconButtonWithTooltip';
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

class Queue extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    children: PropTypes.node,
    className: PropTypes.string,
  };

  renderQueueItems() {
    const { queue, classes } = this.props;
    return queue.concat(queue).map((item, i) => (
      <VideoListItem
        key={`${item.videoId}-${i}`}
        video={item}
        secondaryAction={
          <IconButtonWithTooltip
            tooltipTitle="Remove item"
            tooltipPlacement="top"
            className={classes.clearButton}
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

export default withStyles(styles)(Queue);
