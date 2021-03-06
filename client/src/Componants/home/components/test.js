import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';

import Map from '../../map/googlemaps';
// import Slide from '@material-ui/core/Slide';
// import { TransitionProps } from '@material-ui/core/transitions';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      position: 'relative',
    },
    title: {
      marginLeft: theme.spacing(2),
      color: '#ffffff',
      flex: 1,
    },
  })
);

// const Transition = React.forwardRef(function Transition(
//   props: TransitionProps & { children?: React.ReactElement },
//   ref: React.Ref<unknown>
// ) {
//   return <Slide direction='up' ref={ref} {...props} />;
// });

export default function FullScreenDialog(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  var showBusiness = props.showBusinessName;
  // const[showBusiness,setShowBusiness] = React.useState()
  // localStorage.setItem('compressedFunc', props.showBusiness.toString());
  // console.log('showBusiness111111', props.showBusinessName);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant='outlined' color='primary' onClick={handleClickOpen}>
        More Restaurants
      </Button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        // TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge='start'
              color='inherit'
              onClick={handleClose}
              aria-label='close'
            >
              <CloseIcon />
            </IconButton>
            <Typography variant='h6' className={classes.title}>
              Map
            </Typography>
            <Button autoFocus color='inherit' onClick={handleClose}>
              save
            </Button>
          </Toolbar>
        </AppBar>
        <Map
          mapOpen={handleClose}
          showBusiness={showBusiness}
          // handleClose={handleClose}
        />
      </Dialog>
    </div>
  );
}
