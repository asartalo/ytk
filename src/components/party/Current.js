import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

const styles = theme => ({
  card: {
    display: 'flex',
  },
  title: {
    marginBottom: 16,
    fontSize: 14,
  },
  details: {
    display: 'flex',
    flexBasis: '100%',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 151,
    height: 151,
  },
  controls: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  playerControls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
  miscControls: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
  playerIcon: {
    height: 36,
    width: 36,
  },
});

class Current extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
  };

  renderPlayPauseButton() {
    const { classes } = this.props;
    const isPlaying = true;

    let mainIcon, label;
    if (isPlaying) {
      mainIcon = <PauseIcon className={classes.playerIcon} />;
      label = 'Pause';
    } else {
      mainIcon = <PlayArrowIcon className={classes.playerIcon} />;
      label = 'Play';
    }
    return (
      <Tooltip title={label} placement="bottom">
        <IconButton aria-label="label">{mainIcon}</IconButton>
      </Tooltip>
    );
  }

  render() {
    const { current, classes } = this.props;

    return (
      <Card square className={classes.card} elevation={0}>
        <div className={classes.details}>
          <CardContent className={classes.content}>
            <Typography className={classes.title} color="textSecondary">
              Currently Playing:
            </Typography>
            <Typography variant="headline">{current.title}</Typography>
            <Typography variant="subheading" color="textSecondary">
              {current.channelTitle}
              <br />
              Added by: <strong>Janice</strong>
            </Typography>
          </CardContent>
          <div className={classes.controls}>
            <div className={classes.playerControls}>
              {this.renderPlayPauseButton()}
              <Tooltip title="Next" placement="bottom">
                <IconButton aria-label="Next">
                  <SkipNextIcon />
                </IconButton>
              </Tooltip>
            </div>
            <div className={classes.miscControls}>
              <Tooltip title="Open player in new window" placement="bottom">
                <IconButton aria-label="Open player in new window">
                  <OpenInNewIcon />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </div>
      </Card>
    );
  }
}

export default withStyles(styles)(Current);
