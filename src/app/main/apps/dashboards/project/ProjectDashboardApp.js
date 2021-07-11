import FusePageSimple from '@fuse/core/FusePageSimple';
import { motion } from 'framer-motion';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import { MenuItem } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import withReducer from 'app/store/withReducer';
import _ from '@lodash';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import { SnackbarProvider, useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import ProjectDashboardAppHeader from './ProjectDashboardAppHeader';
import ProjectDashboardAppSidebar from './ProjectDashboardAppSidebar';
import reducer from './store';
import { getWidgets, selectWidgets } from './store/widgetsSlice';
import { getBusiness, selectBusiness, setSelectedBusinessId, setPoint2Cash } from './store/businessSlice';
import BudgetSummaryTab from './tabs/BudgetSummaryTab';
import HomeTab from './tabs/HomeTab';
import BtnGroup from './btnGroups/btnGroup';
import { updateBusiness } from './store/businessSlice';

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
	btnSpace: {
		width: '100%',
		display: 'flex',
		'& > *': {
			margin: theme.spacing(1)
		}
	}
}));

const schema = yup.object().shape({
	point2Cash: yup.string().required('Amount should be between 0.05 to 1')
});

function ProjectDashboardApp(props) {
	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();
	const widgets = useSelector(selectWidgets);
	const business = useSelector(selectBusiness);
	const classes = useStyles(props);
	const pageLayout = useRef(null);
	const [tabValue, setTabValue] = useState(0);
	const [error, setSelectError] = useState(true)

	const point2Cash = useSelector(({ projectDashboardApp }) => projectDashboardApp.business.point2Cash);

	
	const { control, setValue, formState, handleSubmit, reset, trigger, setError } = useForm({
		mode: 'onChange',
		defaultValues: {
			point2Cash: 0
		},
		resolver: yupResolver(schema)
	});


	const { isValid, dirtyFields, errors } = formState;

	useEffect(() => {
		if (point2Cash > 0) {
			setValue('point2Cash', 1 / point2Cash, { shouldDirty: true });
		}
	}, [ point2Cash ]);

	

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
		dispatch(getWidgets());
		dispatch(getBusiness());
	}, [dispatch]);

	function handleChangeTab(event, value) {
		setTabValue(value);
	}

	const selectedBusinessId = useSelector(
		({ projectDashboardApp }) => projectDashboardApp.business.selectedBusinessId
	);

	function handleChangeRange(ev) {
		console.log(ev.target.value);
		setSelectError(false)
		dispatch(setSelectedBusinessId(ev.target.value));
	}

	if (_.isEmpty(widgets)) {
		return null;
	}

	function onSubmit(model) {
		const data_model = setModel(model);
		dispatch(updateBusiness({ selectedBusinessId, data_model })).then(res => {
			enqueueSnackbar('Saved successfully!', { variant: 'success', autoHideDuration: 2000 });
			dispatch(getBusiness());
		});
	}

	function setModel(model) {
		const tempCash = 1 / model.point2Cash;
		dispatch(setPoint2Cash(tempCash));
		model.point2Cash = tempCash;
		return model;
	}

	return (
		<FusePageSimple
			classes={{
				header: 'min-h-160 h-160 lg:ltr:rounded-br-20 lg:rtl:rounded-bl-20 lg:ltr:mr-12 lg:rtl:ml-12',
				rightSidebar: 'w-288 border-0 py-12',
				content: classes.content
			}}
			header1={<HomeTab />}
			content={
				<SnackbarProvider maxSnack={1}>
					<form className="flex flex-col justify-center w-full" onSubmit={handleSubmit(onSubmit)}>
						<motion.div  variants={container} initial="hidden" animate="show">
							<FormControl className="flex flex-wrap" error={error}>
								<Select
									className="w-1/3 mx-auto mt-8"
									onChange={handleChangeRange}
									variant="standard"
								>
									{business
										.filter(e => e.AccountType === 'MAIN')
										.map(name => {
											return (
												<MenuItem key={name.id} value={name.id}>
													{name.Business_name.English}
												</MenuItem>
											);
										})}
								</Select>
								<FormHelperText className="w-1/3 mx-auto mt-8">Select Business Name!</FormHelperText>
							</FormControl>
								
						</motion.div>

						<motion.div className="flex flex-wrap" variants={container} initial="hidden" animate="show">
							<motion.div variants={item} className="widget flex w-2/3 sm:w-2/3 md:w-2/3 p-12">
								<BtnGroup />
							</motion.div>
							<motion.div variants={item} className="widget flex w-1/3 sm:w-1/3 md:w-1/3 p-12">
								<Controller
									name="point2Cash"
									control={control}
									render={({ field }) => (
										<TextField
											{...field}
											type="number"
											label="Enter Amount"
											className="mb-16"
											id="point2Cash"
											error={!!errors.point2Cash}
											helperText={errors?.point2Cash?.message}
											fullWidth
										/>
									)}
								/>
							</motion.div>

							<Button
								type="submit"
								variant="contained"
								color="primary"
								className="w-1/3 mx-auto mt-16"
								aria-label="save/change"
								disabled={ _.isEmpty(dirtyFields) || !isValid }
								value="firebase"
							>
								Save/Change
							</Button>
						</motion.div>
					</form>
				</SnackbarProvider>
			}
		/>
	);
}

export default withReducer('projectDashboardApp', reducer)(ProjectDashboardApp);
