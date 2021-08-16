import React from 'react';
import { mount } from 'enzyme';
import queuedVideos from '../../fixtures/queuedVideos';
import { profiles } from '../../fixtures/users';

import { removeFromQueue } from '../../actions/partyActions';
import { VideoListItem } from './VideoListItem';

import { Queue } from './Queue';

describe('Queue', () => {
  let component, props;
  beforeEach(() => {
    props = {
      classes: { clearButton: 'clearButton' },
      dispatch: jest.fn(),
      queue: [],
      users: [],
    };
  });

  describe('default', () => {
    beforeEach(() => {
      component = mount(<Queue {...props} />);
    });

    it('renders without crashing', () => {
      expect(component).toExist();
    });
  });

  describe('when it has videos on queue', () => {
    let listItems;
    beforeEach(() => {
      props = {
        ...props,
        queue: queuedVideos,
        users: profiles,
      };
      component = mount(<Queue {...props} />);
      listItems = component.find(VideoListItem);
    });

    it('renders video list', () => {
      expect(listItems.length).toEqual(queuedVideos.length);
    });

    describe('when a video is removed', () => {
      beforeEach(() => {
        const clearButton = listItems.find('button.clearButton').first();
        clearButton.simulate('click');
      });

      it('dispatches remove video from queue action', () => {
        expect(props.dispatch).toHaveBeenCalledWith(
          removeFromQueue(queuedVideos[0])
        );
      });
    });
  });
});
