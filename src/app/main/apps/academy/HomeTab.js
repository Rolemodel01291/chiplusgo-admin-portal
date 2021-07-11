import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getTransactionWidgets, selectTransactionWidgets } from './store/transactionWidgetsSlice';
import { getTransaction, selectTransaction } from './store/transactionSlice';
import Widget5 from '../dashboards/project/widgets/Widget5';
import _ from 'lodash';
import BreakpointOnly from 'app/main/documentation/material-ui-components/components/hidden/BreakpointOnly';

function HomeTab() {
	const widgets = useSelector(selectTransactionWidgets);
	const transactions = useSelector(selectTransaction);
	const dispatch = useDispatch();
	const container = {
		show: {
			transition: {
				staggerChildren: 0.1
			}
		}
	};

	useEffect(() => {
		dispatch(getTransactionWidgets());
	}, [dispatch]);

	var total = 0
	var tempRecharge = 0;
	var direct = 0;
	var refund = 0;
	var purchase = 0;
	var withdraw = 0;
	

	
	const [state, setState] = useState({
		total: 0,
		recharge: 0,
		direct: 0,
		refund: 0,
		purchase: 0,
		withdraw: 0
	});

	useEffect(() => {	
		transactions.map(transaction => {
			switch (transaction.Type) {
				case 'Pay':
					direct = direct + transaction.Subtotal;
					break;
				case 'Refund':
					refund = refund + transaction.Subtotal;
					break;
				case 'Charge':
					tempRecharge = tempRecharge + transaction.Subtotal;
					break;
				case 'Purchase':
					purchase = purchase + transaction.Subtotal;
					break;
				case 'Withdraw':
					withdraw = withdraw + transaction.Subtotal;
					break;
				default:
					break;
			}
		});

		total = direct + refund + tempRecharge + purchase + withdraw; 

		setState({
			...state,
			total: total,
			recharge: tempRecharge,
			direct: direct,
			refund: refund,
			purchase: purchase,
			withdraw: withdraw
		});
	}, [transactions]);

	const item = {
		hidden: { opacity: 0, y: 20 },
		show: { opacity: 1, y: 0 }
	};

	return (
		<motion.div className="flex flex-wrap" variants={container} initial="hidden" animate="show">
			<motion.div variants={item} className="widget flex w-full sm:w-1/3 md:w-1/6 p-12 mx-auto">
				<Widget5
					widget={{
						...widgets.widget4,
						data: {
							...widgets.widget4.data,
							count: parseFloat(state.total).toFixed(2)
						},
						title: 'Total Dollars'
					}}
				/>
			</motion.div>
			<motion.div variants={item} className="widget flex w-full sm:w-1/3 md:w-1/6 p-12 mx-auto">
				<Widget5
					widget={{
						...widgets.widget4,
						data: {
							...widgets.widget4.data,
							count: parseFloat(state.recharge).toFixed(2)
						},
						title: 'Recharge Dollars'
					}}
				/>
			</motion.div>
			<motion.div variants={item} className="widget flex w-full sm:w-1/3 md:w-1/6 p-12 mx-auto">
				<Widget5
					widget={{
						...widgets.widget4,
						data: {
							...widgets.widget4.data,
							count: parseFloat(state.direct).toFixed(2)
						},
						title: 'Directpay Dollars'
					}}
				/>
			</motion.div>
			<motion.div variants={item} className="widget flex w-full sm:w-1/3 md:w-1/6 p-12 mx-auto">
				<Widget5
					widget={{
						...widgets.widget4,
						data: {
							...widgets.widget4.data,
							count: parseFloat(state.refund).toFixed(2)
						},
						title: 'Refund Dollars'
					}}
				/>
			</motion.div>
			<motion.div variants={item} className="widget flex w-full sm:w-1/3 md:w-1/6 p-12 mx-auto">
				<Widget5
					widget={{
						...widgets.widget4,
						data: {
							...widgets.widget4.data,
							count: parseFloat(state.purchase).toFixed(2)
						},
						title: 'Purchase Deal Dollars'
					}}
				/>
			</motion.div>
			<motion.div variants={item} className="widget flex w-full sm:w-1/3 md:w-1/6 p-12 mx-auto">
				<Widget5
					widget={{
						...widgets.widget4,
						data: {
							...widgets.widget4.data,
							count: parseFloat(state.withdraw).toFixed(2)
						},
						title: 'Withdraw Dollars'
					}}
				/>
			</motion.div>
		</motion.div>
	);
}

export default HomeTab;
