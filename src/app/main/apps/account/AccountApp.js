import FusePageSimple from '@fuse/core/FusePageSimple';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import withReducer from 'app/store/withReducer';
import _ from '@lodash';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import reducer from './store';
import { getAccountWidgets, selectAccountWidgets, setAccountState } from './store/accountWidgetsSlice';
import BusinessAccount from './tabs/BusinessAccount';
import ClientAccount from './tabs/ClientAccount';
import Widget3 from '../dashboards/project/widgets/Widget3';
import { getBusiness, selectBusiness, setBusinessLoading } from './store/businessSlice';
import { getClient, selectClient, setOpenDetail } from './store/clientSlice';

const useStyles = makeStyles(theme => ({
	content: {
		'& canvas': {
			maxHeight: '100%',
			backgroundColor: '#FFF'
		}
	},
	btnSpace: {
		width: '100%',
		display: 'flex',
		'& > *': {
			margin: theme.spacing(1)
		}
	}
}));

function CalendarApp(props) {
	const dispatch = useDispatch();
	const accountWidgets = useSelector(selectAccountWidgets);
	const classes = useStyles(props);
	const business = useSelector(selectBusiness);
	const clients = useSelector(selectClient);
	const [tabValue, setTabValue] = useState(0);

	const [state, setState] = useState({
		businessCount: 0,
		clientCount: 0,
		totalCount: 0
	});

	useEffect(() => {
		if (business.length > 0 || clients.length > 0) {
			var businessCount = business.length;
			var clientCount = clients.length;
			var totalCount = business.length + clients.length;
			setState({ ...state, businessCount, clientCount, totalCount });
		}
	}, [business, clients]);

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

	useEffect(() => {
		dispatch(getAccountWidgets());
		dispatch(getBusiness()).then(() => {
			dispatch(setBusinessLoading(false));
		});
		dispatch(getClient());
	}, [dispatch]);

	function handleChangeTab(event, value) {
		dispatch(setAccountState({ isBusinessaccount: false, isSubaccount: false }));
		dispatch(setOpenDetail(false));
		setTabValue(value);
	}

	if (_.isEmpty(accountWidgets)) {
		return null;
	}

	return (
		<FusePageSimple
			classes={{
				header: 'min-h-0 h-0 lg:ltr:rounded-br-20 lg:rtl:rounded-bl-20 lg:ltr:mr-12 lg:rtl:ml-12',
				rightSidebar: 'w-288 border-0 py-12',
				content: classes.content
			}}
			header1={
				<div className="p-12 lg:ltr:pr-0 lg:rtl:pl-0 w-full">
					<motion.div className="flex flex-wrap w-full" variants={container} initial="hidden" animate="show">
						<motion.div variants={item} className="widget flex w-full sm:w-1/3 md:w-1/3 p-12">
							<Widget3
								widget={{
									...accountWidgets.widget3,
									data: { ...accountWidgets.widget3.data, count: state.totalCount },
									title: 'Total Accounts'
								}}
							/>
						</motion.div>
						<motion.div variants={item} className="widget flex w-full sm:w-1/3 md:w-1/3 p-12">
							<Widget3
								widget={{
									...accountWidgets.widget3,
									data: { ...accountWidgets.widget3.data, count: state.businessCount },
									title: 'Business Accounts'
								}}
							/>
						</motion.div>
						<motion.div variants={item} className="widget flex w-full sm:w-1/3 md:w-1/3 p-12">
							<Widget3
								widget={{
									...accountWidgets.widget3,
									data: { ...accountWidgets.widget3.data, count: state.clientCount },
									title: 'Client Accounts'
								}}
							/>
						</motion.div>
					</motion.div>
				</div>
			}
			contentToolbar={
				<Tabs
					value={tabValue}
					onChange={handleChangeTab}
					indicatorColor="secondary"
					textColor="inherit"
					variant="scrollable"
					// scrollButtons="off"
					className="w-full px-24 -mx-4 min-h-40"
					// classes={{ indicator: 'flex justify-center w-full h-full' }}
					TabIndicatorProps={{
						children: <Divider className="w-full h-full rounded-full opacity-50" />
					}}
					// onClick={(e)=>onClickTab(e)}
					// selectionFollowsFocus={true}
				>
					<Tab
						className="text-14 font-semibold min-h-40 min-w-64 mx-4"
						disableRipple
						label="Business Account Info"
						// onClick={onClickBusiness}
					/>
					<Tab
						className="text-14 font-semibold min-h-40 min-w-64 mx-4"
						disableRipple
						label="Client Account Info"
						to="/account"
						// onClick={onClickClient}
					/>
				</Tabs>
			}
			content={
				<div className="p-12 lg:ltr:pr-0 lg:rtl:pl-0">
					{tabValue === 0 && <BusinessAccount />}
					{tabValue === 1 && <ClientAccount />}
				</div>
			}
		/>
	);
}

export default withReducer('account', reducer)(CalendarApp);
