import { ActionTypes as types } from '../constants';
import { partyShape, validateReducer } from 'components/propTypes';
import { prepForQueue } from 'helpers/party';

export const defaultState = {
  name: '',
  users: [],
  queue: [],
  id: '',
};

function toCurrent(video) {
  return {
    isPlaying: false,
    at: 0.0,
    ...video,
  };
}

export function party(state = defaultState, action = {}) {
  switch (action.type) {
    case types.PARTY_LOAD:
      return {
        ...state,
        ...action.data,
      };

    case types.PARTY_ADD_TO_QUEUE:
      const { video, addedBy } = action.data;
      const videoData = prepForQueue(video, addedBy);
      if (state.queue.length > 0 || state.current) {
        return {
          ...state,
          queue: state.queue.concat([videoData]),
        };
      }
      return {
        ...state,
        current: toCurrent(videoData),
      };

    case types.PARTY_REMOVE_FROM_QUEUE:
      return {
        ...state,
        queue: state.queue.filter(item => item.queueId !== action.data.queueId),
      };

    case types.PARTY_SET_CURRENT_PLAYBACK:
      if (state.current && state.current.isPlaying === action.data) {
        return state;
      }
      return {
        ...state,
        current: {
          ...state.current,
          isPlaying: action.data,
        },
      };

    case types.PARTY_SKIP:
      if (state.queue.length === 0) {
        return {
          ...state,
          current: {
            ...state.current,
            isPlaying: false,
          },
        };
      }
      return {
        ...state,
        current: toCurrent({
          ...state.queue[0],
          isPlaying: true,
        }),
        queue: state.queue.slice(1),
      };

    case types.PARTY_SET_CURRENT_AT:
      if (state.current.at === action.data) return state;
      return {
        ...state,
        current: { ...state.current, at: action.data },
      };

    default:
      return state;
  }
}

export default validateReducer(partyShape, 'party')(party);
