import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import FuseLoading from '@fuse/core/FuseLoading';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Divider from '@material-ui/core/Divider';
import { selectBusiness } from '../store/businessSlice';
import AddAccount from './AddAccount';
import AllAccount from './AllAccount';
import Withdraw from './Withdraw';
import EditProfile from './EditProfile';
import OrderHistory from './OrderHistory';
import EditBusinessProfile from './EditBusinessProfile';
import OrderBusinessHistory from './OrderBusinessHistory';
import WithdrawBusiness from './WithdrawBusiness';
import BusinessTransactionHistory from './BusinessTransactionHistory'

function BusinessAccount() {
	const business = useSelector(selectBusiness);
	const loading = useSelector(({account})=>account.business.loading)
	const isSub = useSelector(({ account }) => account.accountWidgets.isSubaccount);
	const isBussiness = useSelector(({ account }) => account.accountWidgets.isBusinessaccount);
	const [clientTabValue, setClientTabValue] = useState(0);
	const [tabValue, setTabValue] = useState(0);

	const [state, setState] = useState({
		isSubaccount: false,
		isBusinessaccount: false,
	});

	const { isSubaccount, isBusinessaccount } = state;
	console.log({ isSubaccount, isBusinessaccount });
	useEffect(() => {
		setState({ ...state, isSubaccount: isSub, isBusinessaccount: isBussiness });
	}, [isSub, isBussiness]);

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

	function handleChangeTab(event, value) {
		setTabValue(value);
	}
	function handleClientChangeTab(event, value) {
		setClientTabValue(value);
	}

	if (loading) {
		return <FuseLoading />;
	}

	return (
		<>
			{!isBusinessaccount && isSubaccount && (
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
							label="Transaction History"
						/>
						<Tab
							className="text-14 font-semibold min-h-40 min-w-64 mx-4"
							disableRipple
							label="Withdraw history"
						/>
					</Tabs>
					<div className="p-12 lg:ltr:pr-0 lg:rtl:pl-0">
						{clientTabValue === 0 && <EditProfile />}
						{clientTabValue === 1 && <OrderHistory />}
						{clientTabValue === 2 && <BusinessTransactionHistory />}
						{clientTabValue === 3 && <Withdraw />}
					</div>
				</>
			)}

			{isBusinessaccount && !isSubaccount && (
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
							label="Transaction History"
						/>
						<Tab
							className="text-14 font-semibold min-h-40 min-w-64 mx-4"
							disableRipple
							label="Withdraw history"
						/>
					</Tabs>
					<div className="p-12 lg:ltr:pr-0 lg:rtl:pl-0">
						{clientTabValue === 0 && <EditBusinessProfile />}
						{clientTabValue === 1 && <OrderBusinessHistory />}
						{clientTabValue === 2 && <BusinessTransactionHistory />}
						{clientTabValue === 3 && <Withdraw />}
					</div>
				</>
			)}
			{!isBusinessaccount && !isSubaccount && (
				<>
					<Tabs
						value={tabValue}
						onChange={handleChangeTab}
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
						<Tab className="text-14 font-semibold min-h-40 min-w-64 mx-4" disableRipple label="Add" />
						<Tab
							className="text-14 font-semibold min-h-40 min-w-64 mx-4"
							disableRipple
							label="All Account"
						/>
						<Tab className="text-14 font-semibold min-h-40 min-w-64 mx-4" disableRipple label="Withdraw" />
					</Tabs>
					<div className="p-12 lg:ltr:pr-0 lg:rtl:pl-0">
						{tabValue === 0 && <AddAccount />}
						{tabValue === 1 && <AllAccount />}
						{tabValue === 2 && <WithdrawBusiness />}
					</div>
				</>
			)}
		</>
	);
}

export default BusinessAccount;
