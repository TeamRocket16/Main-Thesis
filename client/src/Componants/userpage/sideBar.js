import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Collapse from '@material-ui/core/Collapse';
import IconExpandLess from '@material-ui/icons/ExpandLess';
import IconExpandMore from '@material-ui/icons/ExpandMore';

// React runtime PropTypes
export const AppMenuItemPropTypes = {
	name: PropTypes.string.isRequired,
	link: PropTypes.string,
	Icon: PropTypes.elementType,
	items: PropTypes.array,
};

const AppMenuItem = (props) => {
	const { name, Icon, items = [] } = props;
	const classes = useStyles();
	const isExpandable = items && items.length > 0;
	const [open, setOpen] = React.useState(false);

	function handleClick() {
		setOpen(!open);
	}

	const MenuItemRoot = (
		<ListItem button className={classes.menuItem} onClick={handleClick}>
			{!!Icon && (
				<ListItemIcon className={classes.menuItemIcon}>
					<Icon />
				</ListItemIcon>
			)}
			<ListItemText primary={name} inset={!Icon} />
			{isExpandable && !open && <IconExpandMore />}
			{isExpandable && open && <IconExpandLess />}
		</ListItem>
	);

	const MenuItemChildren = isExpandable ? (
		<Collapse in={open} timeout='auto' unmountOnExit>
			<Divider />
			<List component='div' disablePadding>
				{items.map((item, index) => (
					<AppMenuItem {...item} key={index} />
				))}
			</List>
		</Collapse>
	) : null;

	return (
		<>
			{MenuItemRoot}
			{MenuItemChildren}
		</>
	);
};

AppMenuItem.propTypes = AppMenuItemPropTypes;

const useStyles = makeStyles((theme) =>
	createStyles({
		menuItem: {},
		menuItemIcon: {
			color: '#97c05c',
		},
	})
);

export default AppMenuItem;
