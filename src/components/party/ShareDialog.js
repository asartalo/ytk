import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Zoom from '@material-ui/core/Zoom';
import TextField from '@material-ui/core/TextField';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import CheckIcon from '@material-ui/icons/Check';

import IconButtonWithTooltip from '../ytk/IconButtonWithTooltip';

const styles = theme => ({
  root: {},
  copiedField: {
    '& textarea::selection': {
      backgroundColor: theme.palette.secondary.light,
    },
  },

  copiedUnderline: {
    '&:after': {
      borderColor: theme.palette.secondary.main,
    },
  },
});

export class ShareDialog extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = { copied: false };
    this.handleCopy = this.handleCopy.bind(this);
    this.focusOnText = this.focusOnText.bind(this);
  }

  focusOnText() {
    document.getElementById('party-url-copy-field').focus();
  }

  handleCopy() {
    this.setState({ copied: true });
    this.focusOnText();
  }

  renderCopyButton() {
    return (
      <IconButtonWithTooltip
        tooltipTitle={this.state.copied ? 'Copied!' : 'Copy'}
        tooltipPlacement="top"
      >
        {this.state.copied ? (
          <Zoom in={this.state.copied}>
            <CheckIcon color="secondary" />
          </Zoom>
        ) : (
          <Zoom in={!this.state.copied}>
            <FileCopyIcon />
          </Zoom>
        )}
      </IconButtonWithTooltip>
    );
  }

  render() {
    const { open, onClose, partyUrl, classes } = this.props;
    const copiedFieldClass = this.state.copied ? classes.copiedField : '';
    return (
      <Dialog
        open={open}
        keepMounted
        onClose={onClose}
        TransitionProps={{
          onEntered: e => {
            setTimeout(this.focusOnText, 100);
          },
        }}
      >
        <DialogTitle>Let others join in on the fun</DialogTitle>
        <DialogContent>
          <DialogContentText component="div">
            Copy the URL below and send it to your friends!
          </DialogContentText>
          <TextField
            fullWidth
            multiline
            className={copiedFieldClass}
            id="party-url-copy-field"
            defaultValue={partyUrl}
            onFocus={e => e.target.select()}
            InputProps={{
              readOnly: true,
              classes: {
                underline: this.state.copied
                  ? classes.copiedUnderline
                  : undefined,
              },
              endAdornment: (
                <InputAdornment position="end">
                  <CopyToClipboard text={partyUrl} onCopy={this.handleCopy}>
                    {this.renderCopyButton()}
                  </CopyToClipboard>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Done
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(ShareDialog);
