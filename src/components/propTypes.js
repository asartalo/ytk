import PropTypes from 'prop-types';

export const currentUserShape = PropTypes.shape({
  name: PropTypes.string.isRequired,
  intent: PropTypes.string.isRequired,
  homeState: PropTypes.string.isRequired,
  party: PropTypes.string,
});

export const videoThumbnailShape = PropTypes.shape({
  url: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
});

export const videoThumbnailsShape = PropTypes.shape({
  default: videoThumbnailShape,
  medium: videoThumbnailShape,
  high: videoThumbnailShape,
});

const videoCommon = {
  videoId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  channelTitle: PropTypes.string,
  thumbnails: PropTypes.videoThumbnailsShape,
  addedBy: PropTypes.string,
};

export const videoShape = PropTypes.shape(videoCommon);

export const currentVideoShape = PropTypes.shape({
  ...videoCommon,
  isPlaying: PropTypes.bool,
});

export const partyShape = PropTypes.shape({
  name: PropTypes.string.isRequired,
  users: PropTypes.array.isRequired,
  queue: PropTypes.arrayOf(videoShape).isRequired,
  current: currentVideoShape,
});
