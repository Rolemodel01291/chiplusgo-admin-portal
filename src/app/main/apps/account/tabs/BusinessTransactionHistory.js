import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { makeStyles } from '@material-ui/core/styles';
import FuseLoading from '@fuse/core/FuseLoading';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import clsx from 'clsx';
import moment from 'moment';
import { Typography } from '@material-ui/core';
import { CSVLink } from 'react-csv';
import { getTransaction, selectTransaction, setTransactionData } from '../store/transactionSlice';
import ListDate from '../components/ListDate';
import ListItem from '../components/ClientTransactionListItem';
import ListHeader from '../components/ClientTransactionListHeader';

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

const headers = [
	{ label: 'Transaction Id', key: 'Id' },
	{ label: 'Business Id', key: 'BusinessId' },
	{ label: 'Client Id', key: 'ClientId' },
	{ label: 'Client Name', key: 'ClientName' },
	{ label: 'Create Date', key: 'Create_date' },
	{ label: 'Title', key: 'Title' },
	{ label: 'Type', key: 'Type' },
	{ label: 'Earned Point', key: 'Earned_point' },
	{ label: 'Chared Cash', key: 'Charged_cash' },
	{ label: 'Used CreditLine balance', key: 'Used_creditLine_balance' },
	{ label: 'Used Point', key: 'Used_point' },
	{ label: 'Final Cash Balance', key: 'Final_cash_balance' },
	{ label: 'Final Credit Balance', key: 'Final_credit_balance' },
	{ label: 'Final Point Balance', key: 'Final_point_balance' },
	{ label: 'Subtotal', key: 'Used_point' },
	{ label: 'Note', key: 'Note' }
];

function TransactionHistory() {
	const classes = useStyles();
	const businessData = useSelector(({ account }) => account.accountWidgets.businessData);
	const selectedTransaction = useSelector(({ account }) => account.transaction.selectedTransaction);
	const transactions = useSelector(selectTransaction);
	console.log(transactions);
	const dispatch = useDispatch();
	const [state, setState] = useState({
		transactions,
		loading: true,
		openDetail: false,
		selectedTransaction: {}
	});
	const csvReport = {
		data: transactions,
		headers: headers,
		filename: `${moment().format('MMMM Do YYYY, h-mm-ss a')}.csv`
	};

	useEffect(() => {
		dispatch(getTransaction(businessData.id)).then(() => {
			setState({ ...state, loading: false });
		});
	}, [dispatch]);

	useEffect(() => {
		setState({ ...state, selectedTransaction });
	}, [selectedTransaction]);

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
		dispatch(setTransactionData(data));
		setState({ ...state, openDetail: true });
	};

	const goBack = () =>{
		setState({ ...state, openDetail: false });
	}

	const exportCSV = () => {
		// setState({ ...state, openDetail: false });
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
							<Typography className="text-base ">Transaction Info(Client)</Typography>
						</div>

						{Object.keys(state.selectedTransaction).length > 0 && (
							<div className="flex w-full p-12">
							<div className="w-1/2 pr-12">
								<div className="border-b-1 border-gray-400 py-12 flex justify-between">
									<Typography>Business ID: </Typography>
									<Typography>{state.selectedTransaction.BusinessId}</Typography>
								</div>
								<div className="border-b-1 border-gray-400 py-12 flex justify-between">
									<Typography>Client ID:</Typography>
									<Typography> {state.selectedTransaction.ClientId}</Typography>
								</div>
								<div className="border-b-1 border-gray-400 py-12 flex justify-between">
									<Typography>Client Name:</Typography>
									<Typography> {state.selectedTransaction.ClientName}</Typography>
								</div>

								<div className="border-b-1 border-gray-400 py-12 flex justify-between">
									<Typography>Created Time:</Typography>
									<Typography> {state.selectedTransaction.Create_date}</Typography>
								</div>
								<div className="border-b-1 border-gray-400 py-12 flex justify-between">
									<Typography>Earned Point:</Typography>
									<Typography> {state.selectedTransaction.Earned_point}</Typography>
								</div>
							</div>
							<div className="w-1/2 pl-12">
								<div className="border-b-1 border-gray-400 py-12 flex justify-between">
									<Typography>Final Cash Balance:</Typography>
									<Typography> ${state.selectedTransaction.Final_cash_balance}</Typography>
								</div>
								<div className="border-b-1 border-gray-400 py-12 flex justify-between">
									<Typography>Final Credit Balance:</Typography>
									<Typography> ${state.selectedTransaction.Final_credit_balance}</Typography>
								</div>
								<div className="border-b-1 border-gray-400 py-12 flex justify-between">
									<Typography>Final Point Balance:</Typography>
									<Typography>{state.selectedTransaction.Final_point_balance}</Typography>
								</div>
								<div className="border-b-1 border-gray-400 py-12 flex justify-between">
									<Typography>Subtotal:</Typography>
									<Typography> ${state.selectedTransaction.Subtotal}</Typography>
								</div>
								<div className="border-b-1 border-gray-400 py-12 flex justify-between">
									<Typography>Title:</Typography>
									<Typography>{state.selectedTransaction.Title}</Typography>
								</div>
							</div>
						</div>
						)}
					</div>
				</motion.div>
			) : (
				<motion.div variants={item} className="widget flex w-full sm:w-full md:w-full p-12">
					<div className={classes.scroll}>
						<div className="flex p-12 items-baseline justify-end">
							<div className="h-20 px-12 text-black">
								<CSVLink {...csvReport}>Export</CSVLink>
							</div>

							<IconButton
								className={clsx('h-40 px-12')}
								aria-controls="font-size-menu"
								aria-haspopup="true"
								// onClick={goBack}
							>
								<Typography color="primary">Filter/Sort</Typography>
							</IconButton>
						</div>
						{transactions.map((item, index) => {
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

export default TransactionHistory;
