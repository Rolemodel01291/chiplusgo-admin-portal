import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { makeStyles } from '@material-ui/core/styles';
import FuseLoading from '@fuse/core/FuseLoading';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import clsx from 'clsx';
import { Typography } from '@material-ui/core';
import { selectBusiness, selectBusinessById } from '../store/businessSlice';
import { getOrder, selectOrder, setOrder } from '../store/orderSlice';
import ListDate from '../components/ListDate';
import ListItem from '../components/ListItem';
import ListHeader from '../components/ListHeader';

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

function OrderHistory() {
	const classes = useStyles();
	const businessData = useSelector(({ account }) => account.accountWidgets.businessData);
	const selectedOrder = useSelector(({ account }) => account.order.selectedOrder);
	const orders = useSelector(selectOrder);
	console.log(orders);
	const dispatch = useDispatch();
	const [state, setState] = useState({
		orders,
		loading: true,
		openDetail: false,
		selectedOrder: {}
	});

	useEffect(() => {
		dispatch(getOrder(businessData.id)).then(() => {
			setState({ ...state, loading: false });
		});
	}, [dispatch]);

	useEffect(() => {
		setState({ ...state, selectedOrder });
	}, [selectedOrder]);

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
		dispatch(setOrder(data));
		setState({ ...state, openDetail: true });
	};

	const goBack = () => {
		setState({ ...state, openDetail: false });
	};

	if (state.loading) {
		return <FuseLoading />;
	}

	return (
		<motion.div className="flex flex-wrap " variants={container} initial="hidden" animate="show">
			{state.openDetail ? (
				<motion.div variants={item} className="widget flex w-full sm:w-full md:w-full p-12">
					<div className={classes.scroll}>
						<div className="flex p-12 items-center">
							<IconButton
								className={clsx('w-40 h-40')}
								aria-controls="font-size-menu"
								aria-haspopup="true"
								onClick={goBack}
							>
								<Icon>keyboard_backspace</Icon>
							</IconButton>
							<Typography className="text-base ">Order Info(Business account)</Typography>
						</div>

						{Object.keys(state.selectedOrder).length > 0 && (
							<div className="flex w-full p-12">
								<div className="w-1/2 pr-12">
									<div className="border-b-1 border-gray-400 py-12 flex justify-between">
										<Typography>Business ID: </Typography>
										<Typography>{state.selectedOrder.BusinessId}</Typography>
									</div>
									<div className="border-b-1 border-gray-400 py-12 flex justify-between">
										<Typography>Client ID:</Typography>
										<Typography> {state.selectedOrder.ClientId}</Typography>
									</div>
									<div className="border-b-1 border-gray-400 py-12 flex justify-between">
										<Typography>Client Name:</Typography>
										<Typography> {state.selectedOrder.ClientName}</Typography>
									</div>
									<div className="border-b-1 border-gray-400 py-12 flex justify-between">
										<Typography>Coupon ID:</Typography>
										<Typography>{state.selectedOrder.CouponId}</Typography>
									</div>
									<div className="border-b-1 border-gray-400 py-12 flex justify-between">
										<Typography>Coupon_Ticket ID:</Typography>
										<Typography> {state.selectedOrder.Coupon_ticketId}</Typography>
									</div>
									<div className="border-b-1 border-gray-400 py-12 flex justify-between">
										<Typography>Created Time:</Typography>
										<Typography> {state.selectedOrder.Create_date}</Typography>
									</div>
								</div>
								<div className="w-1/2 pl-12">
									{state.selectedOrder.Item.map((item, index) => (
										<div
											className="border-b-1 border-gray-400 py-12 flex justify-between"
											key={index}
										>
											<Typography>Item({String(index + 1)}): </Typography>
											<Typography>{item.Item}</Typography>
										</div>
									))}
									<div className="border-b-1 border-gray-400 py-12 flex justify-between">
										<Typography>Discount: </Typography>
										<Typography>${state.selectedOrder.Discount}</Typography>
									</div>
									<div className="border-b-1 border-gray-400 py-12 flex justify-between">
										<Typography>Orginal Price:</Typography>
										<Typography> ${state.selectedOrder.Original_price}</Typography>
									</div>
									<div className="border-b-1 border-gray-400 py-12 flex justify-between">
										<Typography>Price:</Typography>
										<Typography> ${state.selectedOrder.Price}</Typography>
									</div>
									<div className="border-b-1 border-gray-400 py-12 flex justify-between">
										<Typography>Tax:</Typography>
										<Typography> ${state.selectedOrder.Tax}</Typography>
									</div>
									<div className="border-b-1 border-gray-400 py-12 flex justify-between">
										<Typography>Subtotal:</Typography>
										<Typography> ${state.selectedOrder.Subtotal}</Typography>
									</div>
								</div>
							</div>
						)}
					</div>
				</motion.div>
			) : (
				<motion.div variants={item} className="widget flex w-full sm:w-full md:w-full p-12">
					<div className={classes.scroll}>
						{orders.map((item, index) => {
							if (
								Object.keys(previousItem).length === 0 ||
								(Object.keys(previousItem).length > 0 &&
									previousItem.Create_date.split(',')[0] !== item.Create_date.split(',')[0])
							) {
								previousItem = { ...item };

								return (
									<div key={index}>
										<ListDate date={item.Create_date} />
										<ListHeader />
										<ListItem number={index} data={item} onPress={goDetail} />
									</div>
								);
							} else {
								return <ListItem number={index} key={index} data={item} onPress={goDetail} />;
							}
						})}
					</div>
				</motion.div>
			)}
		</motion.div>
	);
}

export default OrderHistory;
