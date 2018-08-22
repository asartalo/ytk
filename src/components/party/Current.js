import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

import IconButtonWithTooltip from 'components/ytk/IconButtonWithTooltip';
import { currentVideoShape, currentUserShape } from 'components/propTypes';
import styles from './Current.styles.js';

class Current extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    current: currentVideoShape,
    currentUser: currentUserShape.isRequired,
  };

  constructor(props) {
    super(props);
    this.handleStandalonePlayer = this.handleStandalonePlayer.bind(this);
  }

  handleStandalonePlayer() {
    const { currentUser } = this.props;
    const url = `${window.location}/player`;
    window.open(url, `Okee ${currentUser.name}`);
    this.props.onOpenStandalonePlayer();
  }

  renderPlayPauseButton() {
    const { classes, current } = this.props;
    const { isPlaying } = current;

    return (
      <IconButtonWithTooltip tooltipTitle={isPlaying ? 'Pause' : 'Play'}>
        {isPlaying ? (
          <PauseIcon className={classes.playerIcon} />
        ) : (
          <PlayArrowIcon className={classes.playerIcon} />
        )}
      </IconButtonWithTooltip>
    );
  }

  renderStandAloneControl() {
    const { openStandalonePlayer } = this.props;
    if (openStandalonePlayer) {
      return null;
    }
    return (
      <IconButtonWithTooltip
        tooltipTitle="Open player in new window"
        onClick={this.handleStandalonePlayer}
      >
        <OpenInNewIcon />
      </IconButtonWithTooltip>
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
              <IconButtonWithTooltip tooltipTitle="Next">
                <SkipNextIcon />
              </IconButtonWithTooltip>
            </div>
            <div className={classes.miscControls}>
              {this.renderStandAloneControl()}
            </div>
          </div>
        </div>
      </Card>
    );
  }
}

export default withStyles(styles)(Current);
