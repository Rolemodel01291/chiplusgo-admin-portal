import FusePageSimple from '@fuse/core/FusePageSimple';
import { motion } from 'framer-motion';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import _ from '@lodash';
import FuseLoading from '@fuse/core/FuseLoading';
import FormControl from '@material-ui/core/FormControl';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import { MenuItem } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import moment from 'moment';
import withReducer from 'app/store/withReducer';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SnackbarProvider, useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import reducer from './store';
import { getOrderWidgets, selectOrderWidgets, setAccountState } from './store/orderWidgetsSlice';
import { getClient, selectClient } from './store/clientSlice';
import { getBusiness, selectBusiness } from './store/businessSlice';
import { getOrder, selectOrder } from './store/orderSlice';
import HomeTab from './HomeTab';
import OrderHistory from './OrderBusinessHistory';



const useStyles = makeStyles(theme => ({
	formControl: {
		margin: theme.spacing(2),
		minWidth: 180
	},
	content: {
		'& canvas': {
			maxHeight: '100%'
		}
	},
	
}));


function FileManagerApp(props) {

	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();
	const orderWidgets = useSelector(selectOrderWidgets);
	const client = useSelector(selectClient);
	const business = useSelector(selectBusiness);
	const orders = useSelector(selectOrder);
	const classes = useStyles(props);
	const pageLayout = useRef(null);
	const [tabValue, setTabValue] = useState(0);

	
	
	const [state, setState] = useState({
		purchase : 0,
		redeem : 0,
		orders: []
	})

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
		dispatch(getOrderWidgets());
		dispatch(getClient());
		dispatch(getBusiness());
	}, [dispatch])

	

	useEffect(()=> {
		const temp = [];
		const fn = _.spread(_.union);
		if (client.length > 0 && business.length > 0){
			temp.push(client);
			temp.push(business);	
			const result = fn(temp);
			const time = 100;
			const startDate = moment('1976-04-19T12:59-0500')._d;
			const endDate = moment()._d;
			dispatch(getOrder({result, time, startDate, endDate}));	
		}
	},[client, business])

	console.log("==================", orders);

	function handleChangeTab(event, value) {
		setTabValue(value);
	}

	if (_.isEmpty(orders)) {
		return <FuseLoading />;
	}

	return (
		<FusePageSimple
			classes={{
				header: 'min-h-160 h-160 lg:ltr:rounded-br-20 lg:rtl:rounded-bl-20 lg:ltr:mr-12 lg:rtl:ml-12',
				toolbar: 'min-h-56 h-56 items-end',
				rightSidebar: 'w-288 border-0 py-12',
				content: classes.content
			}}
			header1={<HomeTab />}
			content={
				<OrderHistory/>
			}
		/>
	);
}

export default withReducer('fileManagerApp', reducer)(FileManagerApp);
