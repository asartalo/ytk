import PropTypes from 'prop-types';

const { bool, number, string, arrayOf, shape, checkPropTypes } = PropTypes;

export const currentUserShape = shape({
  name: string.isRequired,
  intent: string.isRequired,
  homeState: string.isRequired,
  party: string,
});

export const videoThumbnailShape = shape({
  url: string.isRequired,
  width: number,
  height: number,
});

export const videoThumbnailsShape = shape({
  default: videoThumbnailShape,
  medium: videoThumbnailShape,
  high: videoThumbnailShape,
});

const videoCommon = {
  videoId: string.isRequired,
  title: string.isRequired,
  channelTitle: string,
  thumbnails: videoThumbnailsShape,
  addedBy: string,
};

export const videoShape = shape(videoCommon);

export const queueVideo = shape({
  ...videoCommon,
  queueId: string.isRequired,
});

export const currentVideoShape = shape({
  ...videoCommon,
  queueId: string.isRequired,
  isPlaying: bool.isRequired,
  at: number.isRequired,
});

export const profileShape = shape({
  name: string.isRequired,
  uid: string.isRequired,
});

export const arrayOfVideos = arrayOf(videoShape);
export const arrayOfQueueVideo = arrayOf(queueVideo);
export const arrayOfProfiles = arrayOf(profileShape);

export const partyShape = shape({
  name: string.isRequired,
  id: string.isRequired,
  users: arrayOfProfiles.isRequired,
  queue: arrayOfQueueVideo.isRequired,
  current: currentVideoShape,
});

export const firestoreShape = shape({
  signedIn: bool,
  userDataLoaded: bool,
  partyLoaded: bool,
  uid: string,
});

function watchConsole(fn) {
  const oldConsole = console.error;
  let message;
  console.error = msg => (message = msg);
  fn();
  console.error = oldConsole;
  return message;
}

export const validateReducer = (shape, reducerName) => reducer => {
  const env = process.env.NODE_ENV;

  if (env === 'development' || env === 'test') {
    return (state, action) => {
      const newState = reducer(state, action);
      const getStack = () => Error().stack;
      const result = watchConsole(() =>
        checkPropTypes(
          { state: shape },
          { state: newState },
          'property',
          reducerName,
          getStack
        )
      );
      if (result) {
        console.error(`${reducerName} Failed on action: `, action, result);
      }
      return newState;
    };
  }
  return reducer;
};
