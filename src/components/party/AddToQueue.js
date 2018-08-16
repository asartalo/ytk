import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';

import SearchIcon from '@material-ui/icons/Search';

import queueData from './staticQueueData';
import VideoListItem from './VideoListItem';

const styles = theme => ({
  root: {
    width: '100%',
  },

  title: {
    fontSize: 16,
  },

  searchButton: {
    zIndex: 3,
  },

  searchField: {
    // padding: [2, 3].map(n => `${n * theme.spacing.unit}px` ).join(" ")
  },
});

export class AddToQueue extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    children: PropTypes.node,
    className: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.onAddQueue();
  }

  renderSearchResultItems() {
    return queueData.map(video => (
      <VideoListItem button key={video.videoId} video={video} />
    ));
  }

  render() {
    const { classes, className } = this.props;
    const rootClass = [classes.root, className].filter(x => x).join(' ');

    return (
      <div id="AddToQueue">
        <Card square elevation={0} className={rootClass}>
          <CardContent>
            <div className={classes.searchField}>
              <form onSubmit={this.handleSubmit}>
                <TextField
                  fullWidth
                  id="search-field"
                  label="Search"
                  inputRef={this.props.inputRef}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment
                        className={classes.searchButton}
                        position="end"
                      >
                        <IconButton>
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </form>
            </div>
          </CardContent>
        </Card>
        <Divider />
        <div className={classes.searchResult}>
          <List>{this.renderSearchResultItems()}</List>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(AddToQueue);
