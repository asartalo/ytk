import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import searchResults from '../../fixtures/staticVideoData';
import mockStore from '../../helpers/mockStore';

import { search, addToQueue } from '../../actions/partyActions';

import AddToQueueWithStyles, { AddToQueue } from './AddToQueue';
import userEvent from '@testing-library/user-event';

describe('AddToQueue', () => {
  let props;
  beforeEach(() => {
    props = {
      dispatch: jest.fn(),
      onAddToQueue: jest.fn(),
      uid: 'MYUID',
      party: {
        name: 'Pedro Penduko Graduation',
        id: 'pedro-penduko-graduation',
        users: [
          {
            name: 'Jane',
            uid: 'aabbcc',
          },
        ],
        queue: [],
      },
    };
  });

  const renderAddToQueue = props => render(<AddToQueue {...props} />);

  it('renders without crashing', () => {
    expect(() => renderAddToQueue(props)).not.toThrow();
  });

  const simulateSearch = value => {
    jest.useFakeTimers();
    const input = document.querySelector('input#search-field');
    userEvent.clear(input);
    userEvent.type(input, value);
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  };

  describe('when attempting to search', () => {
    beforeEach(() => {
      renderAddToQueue(props);
      simulateSearch('Foo');
    });

    it('should dispatch search action', () => {
      expect(props.dispatch).toHaveBeenCalledWith(search('Foo'));
    });
  });

  describe('when there are search results', () => {
    beforeEach(() => {
      props = {
        ...props,
        searchResults,
      };
      renderAddToQueue(props);
    });

    it('should render results', () => {
      const list = screen.getByRole('list');
      const items = list.querySelectorAll('li');
      expect(items.length).toEqual(searchResults.length);
    });

    describe('when an item is selected', () => {
      beforeEach(() => {
        const list = screen.getByRole('list');
        const item = list.querySelector('li:first-child');
        userEvent.click(item);
      });

      it('dispatches addToQueue action', () => {
        expect(props.dispatch).toHaveBeenCalledWith(
          addToQueue(searchResults[0], props.uid)
        );
      });

      it('calls onAddToQueue prop', () => {
        expect(props.onAddToQueue).toHaveBeenCalledWith(searchResults[0]);
      });

      it('should set the input search field value to empty', () => {
        const searchField = document.querySelector('input#search-field');
        expect(searchField.value).toEqual('');
      });
    });
  });
});

describe('AddToQueueWithStyles', () => {
  let props, store;
  beforeEach(() => {
    store = mockStore();
    props = {
      onAddToQueue: jest.fn(),
      uid: 'MYUID',
    };
  });

  it('renders without crashing', () => {
    expect(() => {
      render(
        <Provider store={store}>
          <AddToQueueWithStyles {...props} />
        </Provider>
      );
    }).not.toThrow();
  });
});
