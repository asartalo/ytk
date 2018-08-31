import React from 'react';
import { node, any } from 'prop-types';

function IfElse({ condition, children }) {
  return condition ? children[0] : children[1];
}

IfElse.defaultProps = {
  condition: false,
};

IfElse.propTypes = {
  children: node.isRequired,
  condition: any,
};

export default IfElse;
