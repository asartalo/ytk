import React from 'react';
import Zoom from '@material-ui/core/Zoom';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

function FabAddButton(props) {
  const buttonProps = { ...props };
  delete buttonProps.show;
  return (
    <Zoom in={props.show}>
      <Button variant="fab" color="primary" {...buttonProps}>
        <AddIcon />
      </Button>
    </Zoom>
  );
}

export default FabAddButton;
