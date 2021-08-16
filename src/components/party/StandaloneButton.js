import React from 'react';
import PropTypes from 'prop-types';

import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import CancelPresentationIcon from '@material-ui/icons/CancelPresentation';
import IconButtonWithTooltip from '../ytk/IconButtonWithTooltip';

function StandaloneButton({ onClick, isStandalone }) {
  const tooltip = isStandalone
    ? 'Close standalone player'
    : 'Open standalone player';
  const icon = isStandalone ? <CancelPresentationIcon /> : <OpenInNewIcon />;
  return (
    <IconButtonWithTooltip tooltipTitle={tooltip} onClick={onClick}>
      {icon}
    </IconButtonWithTooltip>
  );
}

StandaloneButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default StandaloneButton;
