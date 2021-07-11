import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { makeStyles } from '@material-ui/core/styles';
import FuseLoading from '@fuse/core/FuseLoading';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Divider from '@material-ui/core/Divider';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import Icon from '@material-ui/core/Icon';
import { getClient, selectClient, setClientData, setOpenDetail, setClientLoading } from '../store/clientSlice';
import ClientListItem from '../components/ClientListItem';
import EditClientProfile from './EditClientProfile';
import OrderClientHistory from './OrderClientHistory';
import TransactionHistory from './TransactionHistory';
import BalanceClient from './BalanceClient';

const useStyles = makeStyles(theme => ({
	root: {
		width: '100%',
		maxWidth: '100%',
		backgroundColor: theme.palette.background.paper
	},
	scroll: {
		width: '100%',
		maxWidth: '100%',
		backgroundColor: theme.palette.background.paper,
		overflow: 'scroll'
	},
	list: {
		border: '1px',
		borderColor: 'red'
	},
	nested: {
		paddingLeft: theme.spacing(4)
	},
	avatar: {
		background: theme.palette.background.default,
		transition: theme.transitions.create('all', {
			duration: theme.transitions.duration.shortest,
			easing: theme.transitions.easing.easeInOut
		}),
		bottom: 0,
		'& > img': {
			borderRadius: '50%'
		}
	}
}));

function ClientAccount() {
	const classes = useStyles();
	const loading = useSelector(({ account }) => account.client.loading);
	const openDetail = useSelector(({ account }) => account.client.openDetail);
	const clients = useSelector(selectClient);
	const [clientTabValue, setClientTabValue] = useState(0);
	const dispatch = useDispatch();
	const [state, setState] = useState({
		client: [],
		openDetail: false
	});

	useEffect(() => {
		dispatch(getClient()).then(() => {
			dispatch(setClientLoading(false));
		});
	}, [dispatch]);

	useEffect(() => {
		if (clients.length > 0) {
			setState({ ...state, client: clients });
		}
	}, [clients]);

	let previousItem = {};

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

	const goDetail = data => {
		dispatch(setClientData(data));
		dispatch(setOpenDetail(true));
	};

	const goBack = () => {
		dispatch(setOpenDetail(false));
	};

	function handleClientChangeTab(event, value) {
		setClientTabValue(value);
	}

	if (loading) {
		return <FuseLoading />;
	}

	const handleChange = ev => {
		const temp = clients.filter(name => name.Name.toLowerCase().includes(ev.target.value));
		setState({ ...state, client: temp });
	};

	return (
		<>
			{openDetail ? (
				<>
					<Tabs
						value={clientTabValue}
						onChange={handleClientChangeTab}
						indicatorColor="primary"
						textColor="inherit"
						variant="scrollable"
						scrollButtons="off"
						className="w-full px-24 -mx-4 min-h-40"
						classes={{ indicator: 'flex justify-center bg-transparent w-full h-full' }}
						TabIndicatorProps={{
							children: <Divider className="w-full h-full rounded-full opacity-50" />
						}}
					>
						<Tab
							className="text-14 font-semibold min-h-40 min-w-64 mx-4"
							disableRipple
							label="Edit Profile"
						/>
						<Tab
							className="text-14 font-semibold min-h-40 min-w-64 mx-4"
							disableRipple
							label="Order History"
						/>
						<Tab
							className="text-14 font-semibold min-h-40 min-w-64 mx-4"
							disableRipple
							label="Transaction history"
						/>
						<Tab className="text-14 font-semibold min-h-40 min-w-64 mx-4" disableRipple label="Balance" />
					</Tabs>
					<div className="p-12 lg:ltr:pr-0 lg:rtl:pl-0">
						{clientTabValue === 0 && <EditClientProfile />}
						{clientTabValue === 1 && <OrderClientHistory />}
						{clientTabValue === 2 && <TransactionHistory />}
						{clientTabValue === 3 && <BalanceClient />}
					</div>
				</>
			) : (
				<motion.div className="flex flex-wrap " variants={container} initial="hidden" animate="show">
					<motion.div variants={item} className="widget flex w-full sm:w-full md:w-full p-12 flex-col">
						<Paper className="flex items-center h-44 w-full px-16 rounded-16 shadow my-16">
							<Input
								placeholder="Search..."
								disableUnderline
								fullWidth
								inputProps={{
									'aria-label': 'Search'
								}}
								onChange={handleChange}
							/>
							<Icon color="action">search</Icon>
						</Paper>
						<div className={classes.scroll}>
							{state.client.map((item, index) => {
								return <ClientListItem number={index} key={index} data={item} onPress={goDetail} />;
							})}
						</div>
					</motion.div>
				</motion.div>
			)}
		</>
	);
}

export default ClientAccount;
