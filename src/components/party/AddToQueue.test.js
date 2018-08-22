import React from 'react';
import { mount } from 'enzyme';
import searchResults from 'fixtures/staticVideoData';
import { profiles } from 'fixtures/users';

import { search, addToQueue } from 'actions/partyActions';
import VideoListItem from './VideoListItem';

import { AddToQueue } from './AddToQueue';

describe('AddToQueue', () => {
  let component, props;
  beforeEach(() => {
    props = {
      dispatch: jest.fn(),
      onAddToQueue: jest.fn(),
      uid: 'MYUID',
    };
  });

  it('renders without crashing', () => {
    component = mount(<AddToQueue {...props} />);
    expect(component).toExist();
  });

  const simulateSearch = (component, value) => {
    jest.useFakeTimers();
    const input = component.find('input#search-field');
    input.instance().value = value;
    input.simulate('change');
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  };

  describe('when attempting to search', () => {
    beforeEach(() => {
      component = mount(<AddToQueue {...props} />);
      simulateSearch(component, 'Foo');
    });

    it('should dispatch search action', () => {
      expect(props.dispatch).toHaveBeenCalledWith(search('Foo'));
    });
  });

  describe('when there are search results', () => {
    let searchField;
    beforeEach(() => {
      props = {
        ...props,
        searchResults,
      };
      component = mount(<AddToQueue {...props} />);
      searchField = component.find('input#search-field');
      searchField.instance().value = 'Search Term';
    });

    it('should render results', () => {
      expect(component.find(VideoListItem).length).toEqual(
        searchResults.length
      );
    });

    describe('when an item is selected', () => {
      beforeEach(() => {
        component
          .find(VideoListItem)
          .first()
          .simulate('click');
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
        expect(searchField.instance().value).toEqual('');
      });
    });
  });
});
