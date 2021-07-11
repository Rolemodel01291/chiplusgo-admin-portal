import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getOrderWidgets, selectOrderWidgets } from './store/orderWidgetsSlice';
import { getOrder, selectOrder } from './store/orderSlice';
import Widget4 from '../dashboards/project/widgets/Widget4';
import _ from 'lodash';

function HomeTab() {
	const widgets = useSelector(selectOrderWidgets);
	const orders = useSelector(selectOrder);
	const dispatch = useDispatch();
	const container = {
		show: {
			transition: {
				staggerChildren: 0.1
			}
		}
	};

	const [state, setState] = useState({
		purchase: 0,
		redeem: 0
	});

	useEffect(() => {
		dispatch(getOrderWidgets());
	}, [dispatch]);

	const purchase_count = _.sumBy(orders, ({ Order_type }) => Number(Order_type === 'PURCHASE'));
	const redeemt_count = orders.length - purchase_count;

	useEffect(() => {
		if (purchase_count > 0 && redeemt_count > 0) {
			setState({ ...state, purchase: purchase_count, redeem: redeemt_count });
		}
	}, [orders]);

	const item = {
		hidden: { opacity: 0, y: 20 },
		show: { opacity: 1, y: 0 }
	};

	
	return (
		<motion.div className="flex flex-wrap" variants={container} initial="hidden" animate="show">
			<motion.div variants={item} className="widget flex w-full sm:w-1/3 md:w-1/3 p-12 mx-auto">
				<Widget4
					widget={{
						...widgets.widget4,
						data: {
							...widgets.widget4.data,
							count: state.purchase
						},
						title: 'Purchase Orders Amount'
					}}
				/>
			</motion.div>
			<motion.div variants={item} className="widget flex w-full sm:w-1/3 md:w-1/3 p-12 mx-auto">
				<Widget4
					widget={{
						...widgets.widget4,
						data: {
							...widgets.widget4.data,
							count: state.redeem
						},
						title: 'Redeem Orders Amount'
					}}
				/>
			</motion.div>
		</motion.div>
	);
}

export default HomeTab;
