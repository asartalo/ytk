import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import { Fab } from '@material-ui/core';

function filterProps(props) {
  const propsCopy = { ...props };
  delete propsCopy.buttonType;
  return Object.entries(propsCopy).reduce(
    (all, [key, value]) => {
      const match = key.match(/^tooltip(\w)(\w+)/);
      if (match) {
        all.tooltipProps[`${match[1].toLowerCase()}${match[2]}`] = value;
      } else {
        all.buttonProps[key] = value;
      }
      return all;
    },
    { tooltipProps: {}, buttonProps: {} }
  );
}

function ButtonWithTooltip(props) {
  const { tooltipProps, buttonProps } = filterProps(props);
  const { variant } = buttonProps;
  if (variant === 'fab') {
    delete buttonProps.variant;
  }
  const button =
    props.buttonType === 'icon' ? (
      <IconButton {...buttonProps} />
    ) : variant === 'fab' ? (
      <Fab {...buttonProps} />
    ) : (
      <Button {...buttonProps} />
    );
  return <Tooltip {...tooltipProps}>{button}</Tooltip>;
}

ButtonWithTooltip.defaultProps = {
  tooltipPlacement: 'bottom',
};

ButtonWithTooltip.propTypes = {
  tooltipTitle: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default ButtonWithTooltip;
