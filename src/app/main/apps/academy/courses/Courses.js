import FusePageSimple from '@fuse/core/FusePageSimple';
import _ from '@lodash';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import FuseLoading from '@fuse/core/FuseLoading';
import withReducer from 'app/store/withReducer';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTransaction, selectTransaction } from '../store/transactionSlice';
import { getClient, selectClient } from '../store/clientSlice';
import { getBusiness, selectBusiness } from '../store/businessSlice';
import reducer from '../store';
import { getTransactionWidgets, selectTransactionWidgets} from '../store/transactionWidgetsSlice';
import HomeTab  from '../HomeTab';
import TransactionHistory  from '../TransactionHistory';

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

function Courses(props) {
	const dispatch = useDispatch();
	const transactionWidgets = useSelector(selectTransactionWidgets);
	const client = useSelector(selectClient);
	const business = useSelector(selectBusiness);
	const transactions = useSelector(selectTransaction);
	const classes = useStyles(props);
	
	const [state, setState] = useState({
		purchase : 0,
		redeem : 0
	})

	

	useEffect(() => {
		dispatch(getTransactionWidgets());
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
			const time = 1000;
			const type = 'typeAll';
			const startDate = moment('1976-04-19T12:59-0500')._d;
			const endDate = moment()._d;
			dispatch(getTransaction({result, type, time, startDate, endDate}));	
		}
	},[client, business])


	console.log("=======0000=============", transactions);

	function handleChangeTab(event, value) {
		setTabValue(value);
	}

	if (_.isEmpty(transactions)) {
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
				<TransactionHistory/>
			}
		/>
	);
}

export default withReducer('academyApp', reducer)(Courses);
