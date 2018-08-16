import React from 'react';
import { mount } from 'enzyme';
import Grid from '@material-ui/core/Grid';

import { PartyUiGrid } from './PartyUiGrid';

describe('PartyUiGrid', () => {
  let grid, props;

  const mountGrid = () => {
    return mount(
      <PartyUiGrid {...props}>
        <h1>Player section</h1>
        <h2>Control section</h2>
        <h3>This will not be rendered</h3>
      </PartyUiGrid>
    );
  };

  const findSection = section =>
    grid.find({ iid: section, item: true, container: false });

  beforeEach(() => {
    props = {
      hidePlayer: false,
      classes: {},
    };
    grid = mountGrid();
  });

  it('renders without crashing', () => {
    expect(grid).toExist();
  });

  it('renders player section by default', () => {
    expect(grid.find('h1')).toExist();
  });

  it('renders player section', () => {
    expect(grid.find('h2')).toExist();
  });

  it('renders only 2 child elements at most', () => {
    expect(grid.find('h3')).not.toExist();
  });

  describe('sections structure', () => {
    let playerSection, controlSection;

    beforeEach(() => {
      playerSection = findSection('player');
      controlSection = findSection('control');
    });

    it('has a player section', () => {
      expect(playerSection).toExist();
    });

    it('has player component on player section', () => {
      expect(playerSection.find('h1')).toExist();
    });

    it('has a control section', () => {
      expect(controlSection).toExist();
    });

    it('has control component on player section', () => {
      expect(controlSection.find('h2')).toExist();
    });

    it('has proper layout for player section', () => {
      expect(playerSection.props()).toMatchObject({
        xs: 12,
        sm: 12,
        md: 8,
        lg: 9,
      });
    });

    it('has proper layout for control section', () => {
      expect(controlSection.props()).toMatchObject({
        xs: 12,
        sm: 12,
        md: 4,
        lg: 3,
      });
    });
  });

  describe('when hidePlayer is on', () => {
    let controlSection;

    beforeEach(() => {
      props.hidePlayer = true;
      grid = mountGrid();
      controlSection = findSection('control');
    });

    it('hides player section', () => {
      expect(findSection('player')).not.toExist();
    });

    it('still shows control section', () => {
      expect(controlSection).toExist();
    });

    it('becomes main content', () => {
      expect(controlSection.props()).toMatchObject({
        xs: 12,
        sm: 8,
        md: 8,
        lg: 8,
      });
    });
  });
});
