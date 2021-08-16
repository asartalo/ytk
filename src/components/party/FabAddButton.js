import React from 'react';
import Zoom from '@material-ui/core/Zoom';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

function FabAddButton(props) {
  const buttonProps = { ...props };
  delete buttonProps.show;
  return (
    <Zoom in={props.show}>
      <Fab color="primary" {...buttonProps}>
        <AddIcon />
      </Fab>
    </Zoom>
  );
}

export default FabAddButton;
