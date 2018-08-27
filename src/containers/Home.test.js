import React from 'react';
import { shallow } from 'enzyme';
import { Home } from './Home';
import HomePage from 'components/home/HomePage';
import NameForm from 'components/home/NameForm';
import ChooseParty from 'components/home/ChooseParty';
import Start from 'components/home/Start';
import Join from 'components/home/Join';
import { currentUserActions } from 'actions';

describe('Home', () => {
  let home, props;

  const mountHome = () => {
    return shallow(<Home {...props} />);
  };

  beforeEach(() => {
    props = {
      currentUser: {
        name: '',
        intent: '',
        homeState: 'started',
      },
      firestore: {
        userDataLoaded: true,
      },
      dispatch: jest.fn(),
    };
  });

  it('renders without crashing', () => {
    mountHome();
  });

  it('sets homeState prop of HomePage to value of currentUser.homeState', () => {
    const page = mountHome().find(HomePage);
    expect(page.prop('homeState')).toEqual(props.currentUser.homeState);
  });

  describe('NameForm and callback', () => {
    let form;
    beforeEach(() => {
      home = mountHome();
      form = home.find(NameForm);
    });

    it('renders NameForm when there is no current user name', () => {
      expect(form).toExist();
    });

    it('sets handleNameSet as onNameSet listener', () => {
      expect(form).toHaveProp('onNameSet', home.instance().handleNameSet);
    });

    it('sets handleInputStarted as onInputStarted listener', () => {
      expect(form).toHaveProp(
        'onInputStarted',
        home.instance().handleInputStarted
      );
    });

    describe('when #handleNameSet() is called', () => {
      describe('with start intent', () => {
        beforeEach(() => {
          home.instance().handleNameSet('Arnold');
        });

        it('dispatches a set current user name and intent action ', () => {
          expect(props.dispatch).toHaveBeenCalledWith(
            currentUserActions.setName('Arnold')
          );
        });
      });
    });

    describe('when #handleInputStarted', () => {
      beforeEach(() => {
        home.instance().handleInputStarted();
      });

      it('dispatches to set currentUser.homeState to inputStarted action', () => {
        expect(props.dispatch).toHaveBeenCalledWith(
          currentUserActions.setHomeState('inputStarted')
        );
      });
    });
  });

  describe('when homeState is "inputStarted"', () => {
    beforeEach(() => {
      props.currentUser.homeState = 'inputStarted';
      home = mountHome();
    });

    it('sets state inputStarted prop of HomePage', () => {
      const page = home.find(HomePage);
      expect(page.prop('homeState')).toEqual('inputStarted');
    });
  });

  describe('when the user name is set', () => {
    beforeEach(() => {
      props.currentUser.name = 'Armee';
    });

    describe('Choose Party', () => {
      let chooseUi, home;
      beforeEach(() => {
        home = mountHome();
        chooseUi = home.find(ChooseParty);
      });

      it('should show Choose Party UI', () => {
        expect(chooseUi).toExist();
      });

      it('should pass user name to ChooseParty', () => {
        expect(chooseUi).toHaveProp('userName', props.currentUser.name);
      });

      it('should pass handleSetIntent callback', () => {
        expect(chooseUi).toHaveProp(
          'onSetIntent',
          home.instance().handleSetIntent
        );
      });

      describe('when user has a party', () => {
        beforeEach(() => {
          props.currentUser.party = 'my-current-party-1234';
        });

        it('should pass in an array to Choose Party UI', () => {
          home = mountHome();
          chooseUi = home.find(ChooseParty);
          expect(chooseUi).toHaveProp('parties', ['my-current-party-1234']);
        });
      });

      describe('when handleSetIntent is called', () => {
        beforeEach(() => {
          home.instance().handleSetIntent('join');
        });

        it('dispatches setIntent action', () => {
          expect(props.dispatch).toHaveBeenCalledWith(
            currentUserActions.setIntent('join')
          );
        });
      });
    });

    describe('and the intent is start', () => {
      beforeEach(() => {
        props.currentUser.intent = 'start';
      });

      it('renders Start', () => {
        const start = mountHome().find(Start);
        expect(start).toExist();
      });

      it('does not show NameForm', () => {
        const form = mountHome().find(NameForm);
        expect(form).not.toExist();
      });
    });

    describe('and the intent is join', () => {
      beforeEach(() => {
        props.currentUser.intent = 'join';
      });

      it('renders Join', () => {
        const start = mountHome().find(Join);
        expect(start).toExist();
      });

      it('does not show NameForm', () => {
        const form = mountHome().find(NameForm);
        expect(form).not.toExist();
      });
    });
  });
});
