import { ActionTypes as types } from '../constants';
import { partyShape, validateReducer } from 'components/propTypes';
import { prepForQueue } from 'helpers/party';

export const defaultState = {
  name: '',
  users: [],
  queue: [],
  id: '',
};

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
        current: {
          ...videoData,
          isPlaying: false,
        },
      };

    case types.PARTY_REMOVE_FROM_QUEUE:
      return {
        ...state,
        queue: state.queue.filter(item => item.queueId !== action.data.queueId),
      };

    default:
      return state;
  }
}

export default validateReducer(partyShape, 'party')(party);
