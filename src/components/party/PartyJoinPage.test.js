import React from 'react';
import { mount } from 'enzyme';

import { currentUserActions, partyActions } from 'actions';
import HomePage from 'components/home/HomePage';
import NameForm from 'components/home/NameForm';
import HomeButton from 'components/ytk/HomeButton';

import PartyJoinPageWithStyles, { PartyJoinPage } from './PartyJoinPage';

describe('PartyJoinPage', () => {
  let component, props;

  function mountPage() {
    return mount(<PartyJoinPage {...props} />);
  }

  beforeEach(() => {
    props = {
      classes: {},
      partyId: 'the-party-id',
      currentUser: {
        name: '',
        intent: '',
        homeState: 'started',
      },
      firestore: {},
      dispatch: jest.fn(),
    };
  });

  describe('default state', () => {
    let page;
    beforeEach(() => {
      page = mountPage();
    });

    it('renders without crashing', () => {
      expect(page).toExist();
    });

    it('renders HomePage', () => {
      expect(page.find(HomePage)).toExist();
    });

    it('sets HomePage properties', () => {
      const wrapper = page.find(HomePage);
      expect(wrapper).toHaveProp('subtext', 'Join the Party!');
      expect(wrapper).toHaveProp('homeState', 'join');
    });

    it('does not show the join party button', () => {
      expect(page.find('#join-button')).not.toExist();
    });

    describe('NameForm', () => {
      let nameForm;
      beforeEach(() => {
        nameForm = page.find(NameForm);
      });

      it('shows NameForm when there is no name set for user', () => {
        expect(nameForm).toExist();
      });

      it('sets handleNameSet as onNameSet listener', () => {
        expect(nameForm).toHaveProp('onNameSet', page.instance().handleNameSet);
      });

      describe('when #handleNameSet() is called', () => {
        describe('with start intent', () => {
          beforeEach(() => {
            page.instance().handleNameSet('Gene');
          });

          it('dispatches a set current user name and intent action ', () => {
            expect(props.dispatch).toHaveBeenCalledWith(
              currentUserActions.setName('Gene')
            );
          });
        });
      });
    });

    describe('when user name is already set', () => {
      let page;
      beforeEach(() => {
        props = {
          ...props,
          currentUser: {
            ...props.currentUser,
            name: 'Hamil',
          },
        };
        page = mountPage();
      });

      it('does not render NameForm', () => {
        expect(page.find(NameForm)).not.toExist();
      });

      it('shows the join party button', () => {
        expect(page.find('#join-button')).toExist();
      });

      it('shows user name', () => {
        expect(page).toIncludeText('Hamil');
      });

      describe('when the join button is clicked', () => {
        beforeEach(() => {
          page.find('button#join-button').simulate('click');
        });

        it('dispatches join party action', () => {
          expect(props.dispatch).toHaveBeenCalledWith(
            partyActions.joinParty(props.partyId)
          );
        });
      });
    });
  });
});
