import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

const styles = theme => ({
  thumbnail: {
    width: 53,
    height: 40,
    marginRight: theme.spacing.unit,
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

function VideoListItem({
  video,
  classes,
  className,
  onClick,
  secondaryAction,
  button,
  key,
}) {
  const secondary = secondaryAction ? (
    <ListItemSecondaryAction>{secondaryAction}</ListItemSecondaryAction>
  ) : null;

  return (
    <ListItem {...{ onClick, className, button, key }}>
      <ListItemIcon>
        <img
          className={classes.thumbnail}
          src={video.thumbnails.default.url}
          alt="thumbnail"
        />
      </ListItemIcon>
      <ListItemText primary={video.title} secondary={video.channelTitle} />
      {secondary}
    </ListItem>
  );
}

VideoListItem.defaultProps = {};

VideoListItem.propTypes = {
  video: PropTypes.object.isRequired,
  classes: PropTypes.object,
};

export default withStyles(styles)(VideoListItem);
