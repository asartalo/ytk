import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';

import SearchIcon from '@material-ui/icons/Search';

import { arrayOfVideos, partyShape } from '../propTypes';
import debounce from '../../helpers/debounce';
import * as partyActions from '../../actions/partyActions';
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

  searchField: {},
});

export class AddToQueue extends Component {
  static displayName = 'AddToQueue';
  static defaultProps = {
    searchResults: [],
    classes: {},
  };

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    onAddToQueue: PropTypes.func.isRequired,
    inputRef: PropTypes.func,
    classes: PropTypes.object,
    className: PropTypes.string,
    searchResults: arrayOfVideos,
    party: partyShape.isRequired,
  };

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSearch = debounce(this.handleSearch.bind(this), 300);
    this.setInputRef = this.setInputRef.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
  }

  handleSearch() {
    this.props.dispatch(partyActions.search(this.inputRef.value));
  }

  handleAddToQueue(video) {
    const { dispatch, onAddToQueue, uid } = this.props;
    dispatch(partyActions.addToQueue(video, uid));
    onAddToQueue(video);
    this.inputRef.value = '';
  }

  renderSearchResultItems() {
    return this.props.searchResults.map(video => (
      <VideoListItem
        button
        key={video.videoId}
        video={video}
        onClick={() => this.handleAddToQueue(video)}
      />
    ));
  }

  setInputRef(input) {
    this.inputRef = input;
    if (this.props.inputRef) this.props.inputRef(input);
  }

  render() {
    const { classes, className, party } = this.props;
    const rootClass = [classes.root, className].filter(x => x).join(' ');

    return (
      <div id="add-to-queue">
        <Card square elevation={0} className={rootClass}>
          <CardContent>
            <div className={classes.searchField}>
              <form onSubmit={this.handleSubmit}>
                <TextField
                  fullWidth
                  id="search-field"
                  label="Search"
                  inputRef={this.setInputRef}
                  onChange={this.handleSearch}
                  autoFocus={party.queue.length === 0}
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

export default connect(state => {
  const { ui, firestore, party } = state;

  return {
    searchResults: ui.searchResults,
    uid: firestore.uid,
    party: party,
  };
})(withStyles(styles)(AddToQueue));
