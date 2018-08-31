import { node, any } from 'prop-types';

function Unless({ condition, children }) {
  return !condition ? children : null;
}

Unless.defaultProps = {};

Unless.propTypes = {
  children: node.isRequired,
  condition: any,
};

export default Unless;
