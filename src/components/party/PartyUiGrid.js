import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import styles from './PartyUiGrid.styles.js';

export class PartyUiGrid extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    hidePlayer: PropTypes.bool,
  };

  renderPlayerSection(playerComponent, hidePlayer, classes) {
    if (hidePlayer) {
      return null;
    }
    return (
      <Grid
        item
        iid="player"
        className={classes.mainSection}
        xs={12}
        sm={12}
        md={8}
        lg={9}
      >
        {playerComponent}
      </Grid>
    );
  }

  renderControlSection(controlComponent, hidePlayer, classes) {
    const gridProps = hidePlayer
      ? { xs: 12, sm: 8, md: 8, lg: 8 }
      : { xs: 12, sm: 12, md: 4, lg: 3 };
    const classNames = [classes.sidePanel];
    if (hidePlayer) {
      classNames.push(classes.sidePanelStandalone);
    }
    return (
      <Grid item iid="control" className={classNames.join(' ')} {...gridProps}>
        {controlComponent}
      </Grid>
    );
  }

  render() {
    const { classes, children, hidePlayer } = this.props;
    const [playerComponent, controlComponent] = children;
    return (
      <Grid container spacing={0} className={classes.root}>
        {this.renderPlayerSection(playerComponent, hidePlayer, classes)}
        {this.renderControlSection(controlComponent, hidePlayer, classes)}
      </Grid>
    );
  }
}

export default withStyles(styles)(PartyUiGrid);
