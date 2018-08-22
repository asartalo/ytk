import PropTypes from 'prop-types';

function If({ condition, children }) {
  if (condition) return children;
  return null;
}

If.defaultProps = {};

If.propTypes = {
  children: PropTypes.node.isRequired,
  condition: PropTypes.any,
};

export default If;
