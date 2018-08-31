import { node, any } from 'prop-types';

function If({ condition, children }) {
  return condition ? children : null;
}

If.defaultProps = {};

If.propTypes = {
  children: node.isRequired,
  condition: any,
};

export default If;
