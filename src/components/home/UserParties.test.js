import React from 'react';

import mountWithRouter from 'helpers/mountWithRouter';

import UserParties from './UserParties';
import ListItem from '@material-ui/core/ListItem';
import { Link } from 'react-router-dom';

describe('UserParties', () => {
  let component, props;

  function mountUserParties() {
    return mountWithRouter(<UserParties {...props} />);
  }

  beforeEach(() => {
    props = {
      parties: [],
    };
  });

  it('renders without crashing', () => {
    expect(mountUserParties()).toExist();
  });

  it('does not render list items when there are no parties', () => {
    const listItems = mountUserParties().find(ListItem);
    expect(listItems.length).toEqual(0);
  });

  describe('when there are parties', () => {
    beforeEach(() => {
      props = {
        ...props,
        parties: ['a-party-123', 'another-party-456'],
      };
    });

    it('renders the parties as list item', () => {
      const listItems = mountUserParties().find(ListItem);
      expect(listItems.length).toEqual(2);
    });

    it('links to the parties', () => {
      const listItem = mountUserParties()
        .find(ListItem)
        .first();
      const link = listItem.find(Link);
      expect(link).toExist();
    });

    it('must link to parties', () => {
      const link = mountUserParties()
        .find(Link)
        .first();
      expect(link).toHaveProp('to', '/a-party-123');
    });
  });
});
