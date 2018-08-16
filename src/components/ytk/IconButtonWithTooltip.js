import React from 'react';
import ButtonWithTooltip from './ButtonWithTooltip';

function IconButtonWithTooltip({ ...props }) {
  return (
    <ButtonWithTooltip
      buttonType="icon"
      aria-label={props.tooltipTitle}
      {...props}
    />
  );
}

export default IconButtonWithTooltip;
