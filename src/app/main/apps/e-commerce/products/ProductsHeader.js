import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import { ThemeProvider } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { selectMainTheme } from 'app/store/fuse/settingsSlice';
import { setProductsSearchText } from '../store/productsSlice';
import reducer from '../store';
import { getOrdersWidgets, selectOrdersWidgetsEntities } from '../store/ordersWidgetsSlice';
import Widget3 from '../../dashboards/project/widgets/Widget3';


function ProductsHeader(props) {
	const dispatch = useDispatch();
	const searchText = useSelector(({ eCommerceApp }) => eCommerceApp.products.searchText);
	const ordersWidgets = useSelector(selectOrdersWidgetsEntities);
	const mainTheme = useSelector(selectMainTheme);

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
		dispatch(getOrdersWidgets());
	}, [dispatch]);

	if (_.isEmpty(ordersWidgets)) {
		return null;
	}

	console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~', ordersWidgets);

	return (
		<div className="p-12 lg:ltr:pr-0 lg:rtl:pl-0">
			<motion.div className="flex flex-wrap" variants={container} initial="hidden" animate="show">
				<motion.div variants={item} className="widget flex w-full sm:w-1/3 md:w-1/3 p-12">
					<Widget3 widget={ordersWidgets.widget3} />
				</motion.div>
				<motion.div variants={item} className="widget flex w-full sm:w-1/3 md:w-1/3 p-12">
					<Widget3 widget={ordersWidgets.widget3} />
				</motion.div>
				<motion.div variants={item} className="widget flex w-full sm:w-1/3 md:w-1/3 p-12">
					<Widget3 widget={ordersWidgets.widget3} />
				</motion.div>
			</motion.div>
		</div>
	);
}

export default ProductsHeader;
