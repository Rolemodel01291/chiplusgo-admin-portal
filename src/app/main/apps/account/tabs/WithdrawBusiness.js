import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import IconButton from '@material-ui/core/IconButton';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';
import clsx from 'clsx';
import Icon from '@material-ui/core/Icon';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import { SnackbarProvider, useSnackbar } from 'notistack';
import { useForm, FormProvider, Controller, useFormContext } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { selectBusiness } from '../store/businessSlice';
import WithdrawListItem from '../components/WithdrawListItem';
import { getWithdraw, selectWithdraw, deleteWithdraw } from '../store/withdrawSlice';
import { addTransaction } from '../store/transactionSlice';
import WithdrawListHeader from '../components/WithdrawListHeader';
import WithdrawListDetailItem from '../components/WithdrawListDetailItem';
import LeftForm from '../components/LeftForm';
import MiddleForm from '../components/MiddleForm';
import RightForm from '../components/RightForm';
import { gridColumnsTotalWidthSelector } from '@material-ui/data-grid';

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
		overflow: 'auto'
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

const schema = yup.object().shape({
	Activiy_Type: yup.string(),
	Activiy_Number: yup.string(),
	note: yup.string().required("please enter notes!")
});

function WithdrawBusiness() {
	const classes = useStyles();
	const [open, setOpen] = useState(-1);
	const { enqueueSnackbar } = useSnackbar();
	const business = useSelector(selectBusiness);
	const withdraw = useSelector(selectWithdraw);
	const dispatch = useDispatch();
	const [state, setState] = useState({
		loading: true,
		openDetail: false,
		openApprove: false,
		item: [],
	});
	let previousItem = {};

	const methods = useForm({
		mode: 'onChange',
		defaultValues: {
			Activity_Number: '',
			Activity_Type: ''
		},
		resolver: yupResolver(schema)
	});

	const { formState, setValue, getValues, control, errors } = methods;

	const { dirtyFields, isValid } = formState;

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
		console.log("----------123123123------------", data.id);
		dispatch(getWithdraw(data.id));
		setState({ ...state, openDetail: true });
	};

	function handleUpdateProduct() {
		dispatch(addTransaction({ ...getValues(), item: state.item, id: state.item.BusinessId })).then(res => {
			enqueueSnackbar('Add Transaction History successfully!', { variant: 'success', autoHideDuration: 2000 });
			if (res){
				dispatch(deleteWithdraw({...getValues(), item:state.item, id:state.item.BusinessId})).then(res => {
					enqueueSnackbar('Delete Withdraw History successfully!', { variant: 'error', autoHideDuration: 2000 });
				});
			}  
		});
	}

	const goApprove = data => {
		setState({ ...state, openApprove: true, item: data });
		setValue('Activity_Number', data.id);
		setValue('Activity_Type', data.Type);
	};

	const goBack = () => {
		setState({ ...state, openDetail: false });
	};

	console.log("--------all withdraw-------------", withdraw);

	return (
		<>
			{state.openDetail ? (
				<>
					{state.openApprove ? (
						<>
							<motion.div
								className="flex flex-wrap w-full px-12"
								variants={container}
								initial="hidden"
								animate="show"
							>
								<SnackbarProvider maxSnack={1}>
									<FormProvider {...methods}>
										<motion.div
											variants={item}
											className="widget flex w-full sm:w-full md:w-1/3 p-12"
										>
											<LeftForm data={state.item}/>
										</motion.div>
										<motion.div
											variants={item}
											className="widget flex w-full sm:w-full md:w-1/3 p-12"
										>
											<MiddleForm />
										</motion.div>
										<motion.div
											variants={item}
											className="widget flex w-full sm:w-full md:w-1/3 p-12"
										>
											<RightForm />
										</motion.div>
										<motion.div
											variants={item}
											className="widget flex w-full sm:w-full md:w-full p-12"
										>
											<Button
												variant="contained"
												color="primary"
												className="w-1/3 mx-16 mt-16"
												aria-label="save/change"
												disabled={_.isEmpty(dirtyFields) || !isValid}
												value="firebase"
												onClick={handleUpdateProduct}
											>
												Approve
											</Button>
										</motion.div>
									</FormProvider>
								</SnackbarProvider>
							</motion.div>
						</>
					) : (
						<>
							<motion.div variants={item} className="widget flex w-full sm:w-full md:w-full p-12">
								<div className={classes.scroll}>
									{withdraw.map((item, index) => {
										if (
											Object.keys(previousItem).length === 0 ||
											(Object.keys(previousItem).length > 0 &&
												previousItem.Create_date.split(',')[0] !==
													item.Create_date.split(',')[0])
										) {
											previousItem = { ...item };

											return (
												<div key={index}>
													{/* <ListDate date={item.Create_date} /> */}
													<WithdrawListHeader />
													<WithdrawListDetailItem
														number={index}
														data={item}
														onPress={goApprove}
													/>
												</div>
											);
										} else {
											return (
												<WithdrawListDetailItem
													number={index}
													key={index}
													data={item}
													onPress={goApprove}
												/>
											);
										}
									})}
								</div>
							</motion.div>
						</>
					)}
				</>
			) : (
				<motion.div className="flex flex-wrap " variants={container} initial="hidden" animate="show">
					<motion.div variants={item} className="widget flex w-full sm:w-full md:w-full p-12 flex-col">
						<div className={classes.scroll}>
							{business.map((item, index) => {
								return <WithdrawListItem number={index} key={index} data={item} onPress={goDetail} />;
							})}
						</div>
					</motion.div>
				</motion.div>
			)}
		</>
	);
}

export default WithdrawBusiness;
