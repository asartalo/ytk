import React from 'react';
import PropTypes from 'prop-types';
import SkipNextIcon from '@material-ui/icons/SkipNext';

import IconButtonWithTooltip from 'components/ytk/IconButtonWithTooltip';

export function SkipButton({ onClick }) {
  return (
    <IconButtonWithTooltip tooltipTitle="Next" onClick={onClick}>
      <SkipNextIcon />
    </IconButtonWithTooltip>
  );
}

SkipButton.propTypes = {
  onClick: PropTypes.func,
};

export default SkipButton;
