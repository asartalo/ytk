import PropTypes from 'prop-types';

export const currentUserShape = PropTypes.shape({
  name: PropTypes.string.isRequired,
  intent: PropTypes.string.isRequired,
  homeState: PropTypes.string.isRequired,
  party: PropTypes.string,
});

export const partyShape = PropTypes.shape({
  name: PropTypes.string.isRequired,
  users: PropTypes.array.isRequired,
  queue: PropTypes.array.isRequired,
});
