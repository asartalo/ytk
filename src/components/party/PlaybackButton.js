import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';

import IconButtonWithTooltip from 'components/ytk/IconButtonWithTooltip';

const styles = theme => ({
  playerIcon: {
    height: 36,
    width: 36,
  },
});

export function PlaybackButton({ isPlaying, onClick, classes }) {
  return (
    <IconButtonWithTooltip
      tooltipTitle={isPlaying ? 'Pause' : 'Play'}
      onClick={onClick}
    >
      {isPlaying ? (
        <PauseIcon className={classes.playerIcon} />
      ) : (
        <PlayArrowIcon className={classes.playerIcon} />
      )}
    </IconButtonWithTooltip>
  );
}

PlaybackButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  isPlaying: PropTypes.bool.isRequired,
};

export default withStyles(styles)(PlaybackButton);
