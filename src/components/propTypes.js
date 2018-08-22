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

export const queueVideo = PropTypes.shape({
  ...videoCommon,
  queueId: PropTypes.string.isRequired,
});

export const currentVideoShape = PropTypes.shape({
  ...videoCommon,
  isPlaying: PropTypes.bool,
});

export const profileShape = PropTypes.shape({
  name: PropTypes.string.isRequired,
  uid: PropTypes.string.isRequired,
});

export const arrayOfVideos = PropTypes.arrayOf(videoShape);
export const arrayOfQueueVideo = PropTypes.arrayOf(queueVideo);
export const arrayOfProfiles = PropTypes.arrayOf(profileShape);

export const partyShape = PropTypes.shape({
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  users: arrayOfProfiles.isRequired,
  queue: arrayOfQueueVideo.isRequired,
  current: currentVideoShape,
});

export const validateReducer = (shape, reducerName) => reducer => {
  const env = process.env.NODE_ENV;

  if (env === 'development' || env === 'test') {
    return (state, action) => {
      const newState = reducer(state, action);
      const getStack = () => Error().stack;
      PropTypes.checkPropTypes(
        { state: shape },
        { state: newState },
        'property',
        reducerName,
        getStack
      );
      return newState;
    };
  }
  return reducer;
};
