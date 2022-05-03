import React from 'react';
import { render, screen } from '@testing-library/react';

import MuiSizeWrapper from '../../helpers/MuiSizeWrapper';
import { PartyUiGrid } from './PartyUiGrid';

describe('PartyUiGrid', () => {
  let props;

  const renderGrid = () => {
    return render(
      <MuiSizeWrapper>
        <PartyUiGrid {...props}>
          <h1>Player section</h1>
          <h2>Control section</h2>
          <h3>This will not be rendered</h3>
        </PartyUiGrid>
      </MuiSizeWrapper>
    );
  };

  describe('when hidePlayer is off', () => {
    beforeEach(() => {
      props = {
        hidePlayer: false,
        classes: {},
      };
      return renderGrid();
    });

    it('renders player section by default', () => {
      expect(screen.getByText('Player section')).toBeInTheDocument();
    });

    it('renders player section', () => {
      expect(screen.getByText('Control section')).toBeInTheDocument();
    });

    it('renders only 2 child elements at most', () => {
      expect(
        screen.queryByText('This will not be rendered')
      ).not.toBeInTheDocument();
    });

    describe('sections structure', () => {
      it('has player component on player section', () => {
        expect(screen.getByText('Player section')).toBeInTheDocument();
      });

      it('has a control section', () => {
        expect(screen.getByText('Control section')).toBeInTheDocument();
      });

      it('has proper layout for player section', () => {
        const playerSection = document.querySelector('[iid="player"]');
        const classes = Array.from(playerSection.classList).join(' ');
        expect(classes).toContain('-xs-12');
        expect(classes).toContain('-sm-12');
        expect(classes).toContain('-md-8');
        expect(classes).toContain('-lg-9');
      });

      it('has proper layout for control section', () => {
        const controlSection = document.querySelector('[iid="control"]');
        const classes = Array.from(controlSection.classList).join(' ');
        expect(classes).toContain('-xs-12');
        expect(classes).toContain('-sm-12');
        expect(classes).toContain('-md-4');
        expect(classes).toContain('-lg-3');
      });
    });
  });

  describe('when hidePlayer is on', () => {
    beforeEach(() => {
      props = {
        hidePlayer: true,
        classes: {},
      };
      return renderGrid();
    });

    it('hides player section', () => {
      expect(screen.queryByText('Player section')).not.toBeInTheDocument();
    });

    it('still shows control section', () => {
      expect(screen.getByText('Control section')).toBeInTheDocument();
    });

    it('becomes main content', () => {
      const controlSection = document.querySelector('[iid="control"]');
      const classes = Array.from(controlSection.classList).join(' ');
      expect(classes).toContain('-xs-12');
      expect(classes).toContain('-sm-8');
      expect(classes).toContain('-md-8');
      expect(classes).toContain('-lg-8');
    });
  });
});
