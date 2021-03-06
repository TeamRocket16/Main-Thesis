import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Maps from '../map/googlemaps';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		appBar: {
			position: 'relative',
		},
		title: {
			marginLeft: theme.spacing(2),
			flex: 1,
		},
	})
);

export default function FullScreenDialog() {
	const classes = useStyles();
	const [open, setOpen] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<div>
			<Button variant='outlined' color='primary' onClick={handleClickOpen}>
				Open Map to select your location
			</Button>
			<Dialog fullScreen open={open} onClose={handleClose}>
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
				<Maps />
			</Dialog>
		</div>
	);
}
