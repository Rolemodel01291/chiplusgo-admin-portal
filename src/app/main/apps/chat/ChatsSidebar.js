import FuseScrollbars from '@fuse/core/FuseScrollbars';
import FuseUtils from '@fuse/utils';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import { useTheme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ContactListItem from './ContactListItem';
import StatusIcon from './StatusIcon';
import { getChat } from './store/chatSlice';
import { selectContacts } from './store/contactsSlice';
import { openUserSidebar } from './store/sidebarsSlice';
import { updateUserData } from './store/userSlice';

const statusArr = [
	{
		title: 'Online',
		value: 'online'
	},
	{
		title: 'Away',
		value: 'away'
	},
	{
		title: 'Do not disturb',
		value: 'do-not-disturb'
	},
	{
		title: 'Offline',
		value: 'offline'
	}
];

function ChatsSidebar(props) {
	const dispatch = useDispatch();
	const contacts = useSelector(selectContacts);
	
	const user = useSelector(({ chatApp }) => chatApp.user);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));
	
	const [searchText, setSearchText] = useState('');
	const [statusMenuEl, setStatusMenuEl] = useState(null);
	const [moreMenuEl, setMoreMenuEl] = useState(null);

	function handleMoreMenuClick(event) {
		setMoreMenuEl(event.currentTarget);
	}

	function handleMoreMenuClose(event) {
		setMoreMenuEl(null);
	}

	function handleStatusMenuClick(event) {
		event.preventDefault();
		event.stopPropagation();
		setStatusMenuEl(event.currentTarget);
	}

	function handleStatusSelect(event, status) {
		event.preventDefault();
		event.stopPropagation();
		dispatch(
			updateUserData({
				...user,
				status
			})
		);
		setStatusMenuEl(null);
	}

	function handleStatusClose(event) {
		event.preventDefault();
		event.stopPropagation();
		setStatusMenuEl(null);
	}

	function handleSearchText(event) {
		setSearchText(event.target.value);
	}

	return (
		<div className="flex flex-col flex-auto h-full">
			<AppBar position="static" color="default" elevation={0}>
				
				{useMemo(
					() => (
						<Toolbar className="px-16">
							<Paper className="flex p-4 items-center w-full px-8 py-4 shadow">
								<Icon color="action">search</Icon>

								<Input
									placeholder="Search or start new chat"
									className="flex flex-1 px-8"
									disableUnderline
									fullWidth
									value={searchText}
									inputProps={{
										'aria-label': 'Search'
									}}
									onChange={handleSearchText}
								/>
							</Paper>
						</Toolbar>
					),
					[searchText]
				)}
			</AppBar>

			<FuseScrollbars className="overflow-y-auto flex-1">
				<List className="w-full">
					{useMemo(() => {
						function getFilteredArray(arr, _searchText) {
							if (_searchText.length === 0) {
								return arr;
							}
							return FuseUtils.filterArrayByString(arr, _searchText);
						}
						console.log(user)
						const chatListContacts =
							contacts.length > 0 && user && user.chatList
								? contacts.map(_contact => ({
										..._contact,
										...user.chatList.find(_chat => _contact.id === _chat.contactId)
								  }))
								: [];
						const filteredContacts = getFilteredArray([...chatListContacts], searchText);

						const container = {
							show: {
								transition: {
									staggerChildren: 0.1
								}
							}
						};

						const item = {
							hidden: { opacity: 0, y: 20 },
							show: { opacity: 1, y: 0 }
						};

						return (
							<motion.div
								className="flex flex-col flex-shrink-0"
								variants={container}
								initial="hidden"
								animate="show"
							>						

								{filteredContacts.length > 0 && (
									<motion.div variants={item}>
										<Typography className="font-medium text-20 px-16 py-24" color="secondary">
											Contacts
										</Typography>
									</motion.div>
								)}

								{filteredContacts.map(contact => (
									<motion.div variants={item} key={contact.id}>
										<ContactListItem
											contact={contact}
											onContactClick={contactId => dispatch(getChat({ contactId, isMobile, contact }))}
										/>
									</motion.div>
								))}
							</motion.div>
						);
					}, [contacts, user, searchText, dispatch, isMobile])}
				</List>
			</FuseScrollbars>
		</div>
	);
}

export default ChatsSidebar;
