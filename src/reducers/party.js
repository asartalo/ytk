import { ActionTypes as types } from '../constants';
import { partyShape, validateReducer } from '../components/propTypes';
import { prepForQueue } from '../helpers/party';

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

function setNext(to, queue) {
  const newQueue = [];
  let next;
  queue.forEach(item => {
    if (item.queueId === to) {
      next = item;
    } else {
      newQueue.push(item);
    }
  });
  return { next, newQueue };
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
      const { queue, current } = state;
      if (state.queue.length === 0) {
        return {
          ...state,
          current: {
            ...current,
            isPlaying: false,
          },
        };
      }
      const { from, to } = action.data;
      const { next, newQueue } = setNext(to, queue);
      if (current.queueId === from && next) {
        return {
          ...state,
          current: toCurrent({
            ...next,
            isPlaying: true,
          }),
          queue: newQueue,
        };
      }
      return state;

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
