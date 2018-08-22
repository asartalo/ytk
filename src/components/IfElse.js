import React from 'react';
import PropTypes from 'prop-types';

function IfElse({ condition, children }) {
  return condition ? children[0] : children[1];
}

IfElse.defaultProps = {
  condition: false,
};

IfElse.propTypes = {
  condition: PropTypes.bool,
};

export default IfElse;
