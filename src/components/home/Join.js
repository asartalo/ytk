import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import HomeButton from 'components/ytk/HomeButton';

const styles = theme => ({});

class Join extends Component {
  static propTypes = {
    children: PropTypes.node,
    classes: PropTypes.object.isRequired,
    userName: PropTypes.string.isRequired,
  };

  render() {
    const { userName } = this.props;
    return (
      <div className="Join">
        <h1>Hello {userName}</h1>
        <HomeButton>Join a Party</HomeButton>
      </div>
    );
  }
}

export default withStyles(styles)(Join);
