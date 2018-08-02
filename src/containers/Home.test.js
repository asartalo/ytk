import React from 'react';
import { shallow } from 'enzyme';
import { Home } from './Home';
import HomePage from 'components/home/HomePage';
import NameForm from 'components/home/NameForm';
import Start from 'components/home/Start';
import Join from 'components/home/Join';
import { currentUserActions } from 'actions';
import { Redirect } from 'react-router';

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

  it('does not render a Redirect by default', () => {
    const redirect = mountHome().find(Redirect);
    expect(redirect).not.toExist();
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
          home.instance().handleNameSet('Arnold', 'start');
        });

        it('dispatches a set current user name and intent action ', () => {
          expect(props.dispatch).toHaveBeenCalledWith(
            currentUserActions.setNameAndIntent('Arnold', 'start')
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

      it('renders Start', () => {
        const start = mountHome().find(Join);
        expect(start).toExist();
      });

      it('does not show NameForm', () => {
        const form = mountHome().find(NameForm);
        expect(form).not.toExist();
      });
    });
  });

  describe('when the party is set', () => {
    let redirect;
    beforeEach(() => {
      props.currentUser.party = 'the-great-party-2568';
      redirect = mountHome().find(Redirect);
    });

    it('renders redirect', () => {
      expect(redirect).toExist();
    });

    it('redirects to party page', () => {
      expect(redirect).toHaveProp('to', '/the-great-party-2568');
    });
  });
});
