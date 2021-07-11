import { amber } from '@material-ui/core/colors';
import Divider from '@material-ui/core/Divider';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import { selectFlatNavigation } from 'app/store/fuse/navigationSlice';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { memo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { updateUserShortcuts } from 'app/auth/store/userSlice';

const useStyles = makeStyles({
	root: {
		'&.horizontal': {},
		'&.vertical': {
			flexDirection: 'column'
		}
	},
	item: {
		textDecoration: 'none!important',
		color: 'inherit'
	},
	addIcon: {
		color: 'rgb(0, 0, 0)'
	}
});

function FuseShortcuts(props) {
	const dispatch = useDispatch();
	const shortcuts = useSelector(({ auth }) => auth.user.data.shortcuts);
	const navigation = useSelector(selectFlatNavigation);

	const classes = useStyles(props);
	const searchInputRef = useRef(null);
	const [addMenu, setAddMenu] = useState(null);
	const [searchText, setSearchText] = useState('');
	const [searchResults, setSearchResults] = useState(null);
	const [dateState, setDateState] = useState(new Date());
	const shortcutItems = shortcuts ? shortcuts.map(id => navigation.find(item => item.id === id)) : [];

	const [state, setState] = useState({
		open: false
	});

	function addMenuClick(event) {
		// setAddMenu(event.currentTarget);
		setState({ ...state, open: true });
	}

	function addMenuClose() {
		setAddMenu(null);
	}

	function changeDate(e) {
		setDateState(e);
	}

	function search(ev) {
		const newSearchText = ev.target.value;

		setSearchText(newSearchText);

		if (newSearchText.length !== 0 && navigation) {
			setSearchResults(navigation.filter(item => item.title.toLowerCase().includes(newSearchText.toLowerCase())));
			return;
		}
		setSearchResults(null);
	}

	function toggleInShortcuts(id) {
		let newShortcuts = [...shortcuts];
		newShortcuts = newShortcuts.includes(id) ? newShortcuts.filter(_id => id !== _id) : [...newShortcuts, id];
		dispatch(updateUserShortcuts(newShortcuts));
	}

	function ShortcutMenuItem({ item, onToggle }) {
		return (
			<Link to={item.url} className={classes.item} role="button">
				<MenuItem key={item.id}>
					<ListItemIcon className="min-w-40">
						{item.icon ? (
							<Icon>{item.icon}</Icon>
						) : (
							<span className="text-20 font-semibold uppercase text-center">{item.title[0]}</span>
						)}
					</ListItemIcon>
					<ListItemText primary={item.title} />
					<IconButton
						onClick={ev => {
							ev.preventDefault();
							ev.stopPropagation();
							onToggle(item.id);
						}}
					>
						<Icon color="action">{shortcuts.includes(item.id) ? 'star' : 'star_border'}</Icon>
					</IconButton>
				</MenuItem>
			</Link>
		);
	}
	const container = {
		show: {
			transition: {
				staggerChildren: 0.1
			}
		}
	};

	const item = {
		hidden: { opacity: 0, scale: 0.6 },
		show: { opacity: 1, scale: 1 }
	};

	return (
		<div
			className={clsx(
				classes.root,
				props.variant,
				'flex',
				props.variant === 'vertical' && 'flex-grow-0 flex-shrink',
				props.className
			)}
		>
			<motion.div
				variants={container}
				initial="hidden"
				animate="show"
				className={clsx('flex flex-1', props.variant === 'vertical' && 'flex-col')}
			>
				{/* {state.open ? <Calendar value={dateState} onChange={changeDate} /> : <></>} */}
				{shortcutItems.map(
					_item =>
						_item && (
							<Link to={_item.url} key={_item.id} className={classes.item} role="button">
								<Tooltip
									title={_item.title}
									placement={props.variant === 'horizontal' ? 'bottom' : 'left'}
								>
									<IconButton className="w-40 h-40 p-0" component={motion.div} variants={item}>
										{_item.icon ? (
											<Icon>{_item.icon}</Icon>
										) : (
											<span className="text-20 font-semibold uppercase">{_item.title[0]}</span>
										)}
									</IconButton>
								</Tooltip>
							</Link>
						)
				)}

				<Tooltip title="Click to calendar" placement={props.variant === 'horizontal' ? 'bottom' : 'left'}>
					<IconButton
						component={motion.div}
						variants={item}
						className="w-40 h-40 p-0"
						aria-owns={addMenu ? 'add-menu' : null}
						aria-haspopup="true"
						onClick={addMenuClick}
					>
						<Icon className={classes.addIcon}>event</Icon>
						
					</IconButton>
				</Tooltip>
			</motion.div>

			<Menu
				id="add-menu"
				anchorEl={addMenu}
				open={Boolean(addMenu)}
				onClose={addMenuClose}
				classes={{
					paper: 'mt-48 min-w-256'
				}}
				onEntered={() => {
					searchInputRef.current.focus();
				}}
				onExited={() => {
					setSearchText('');
				}}
			>
				<div className="p-16 pt-8">
					<Input
						inputRef={searchInputRef}
						value={searchText}
						onChange={search}
						placeholder="Search for an app or page"
						className=""
						fullWidth
						inputProps={{
							'aria-label': 'Search'
						}}
						disableUnderline
					/>
				</div>

				<Divider />

				{searchText.length !== 0 &&
					searchResults &&
					searchResults.map(_item => (
						<ShortcutMenuItem key={_item.id} item={_item} onToggle={() => toggleInShortcuts(_item.id)} />
					))}

				{searchText.length !== 0 && searchResults.length === 0 && (
					<Typography color="textSecondary" className="p-16 pb-8">
						No results..
					</Typography>
				)}

				{searchText.length === 0 &&
					shortcutItems.map(
						_item =>
							_item && (
								<ShortcutMenuItem
									key={_item.id}
									item={_item}
									onToggle={() => toggleInShortcuts(_item.id)}
								/>
							)
					)}
			</Menu>
		</div>
	);
}

FuseShortcuts.propTypes = {};
FuseShortcuts.defaultProps = {
	variant: 'horizontal'
};

export default memo(FuseShortcuts);
