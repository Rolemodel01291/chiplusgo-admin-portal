import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { makeStyles } from '@material-ui/core/styles';
import FuseLoading from '@fuse/core/FuseLoading';
import IconButton from '@material-ui/core/IconButton';
import { Typography } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import clsx from 'clsx';
import history from '@history';
import withReducer from 'app/store/withReducer';
import { getCoupon, selectCoupon } from './store/couponSlice';
import ClientListItem from '../account/components/ClientListItem';
import reducer from './store';
import ListItem from './components/list'

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

	const coupon = useSelector(selectCoupon);
	console.log(coupon)
	const dispatch = useDispatch();
	const [state, setState] = useState({
		// clients,
		loading: true,
		openDetail: false
	});

	useEffect(() => {
		dispatch(getCoupon()).then(()=>{
			setState({...state, loading:false})
		})
	}, [dispatch]);

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

	const goAdd = () => {
        history.push({
			pathname: '/apps/deals/add'
		});
		// dispatch(setClientData(data));
		// setState({ ...state, openDetail: true });
	};

	const goDetail = () => {

	}

	// if (state.loading) {
	// 	return <FuseLoading />;
	// }

	return (
		<>
			<motion.div className="flex flex-wrap " variants={container} initial="hidden" animate="show">
				<motion.div variants={item} className="widget w-full sm:w-full md:w-full p-12">
					<div className="flex items-center justify-between">
						<div>
							<Typography className="text-base font-bold" color="primary">
								Current Deals
							</Typography>
						</div>
						<div className="flex p-12 items-center">
							<Typography className="text-base ">Add new</Typography>
							<IconButton
								className={clsx('w-40 h-40')}
								aria-controls="font-size-menu"
								aria-haspopup="true"
								onClick={goAdd}
							>
								<Icon>control_point</Icon>
							</IconButton>
						</div>
					</div>
					<div className={classes.scroll}>
						
						{state.loading?<FuseLoading />:coupon.map((item, index) => {
								return <ListItem number={index} key={index} data={item} onPress={goDetail} />;
							})}
					</div>
				</motion.div>
			</motion.div>
		</>
	);
}

export default withReducer('deals', reducer)(ClientAccount);
