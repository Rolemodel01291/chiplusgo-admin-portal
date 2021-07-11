import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { motion } from 'framer-motion';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import clsx from 'clsx';
import { selectBusinessById, updateClient, getBusiness } from '../store/businessSlice';
import { SnackbarProvider, useSnackbar } from 'notistack';

const useStyles = makeStyles(theme => ({
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
	Nick_name: yup.string().required('Please enter nick name.')
});

function EditProfile() {
	const { enqueueSnackbar } = useSnackbar();
	const classes = useStyles();
	const dispatch = useDispatch();
	const subaccountData = useSelector(({ account }) => account.accountWidgets.subaccountData);
	const businessData = useSelector(state => selectBusinessById(state, subaccountData.BusinessId));

	const [state] = useState({
		subaccountData: {
			Nick_name: subaccountData.Nick_name ? subaccountData.Nick_name : '',
			Email: subaccountData.Email ? subaccountData.Email : '',
			BusinessId: subaccountData.BusinessId ? subaccountData.BusinessId : '',
			SubaccountId: subaccountData.SubaccountId ? subaccountData.SubaccountId : ''
		}
	});

	const { control, setValue, formState, handleSubmit, reset, trigger, setError } = useForm({
		mode: 'onChange',
		defaultValues: state.subaccountData,
		resolver: yupResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

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

	function onSubmit(model) {
		console.log(model);
		dispatch(updateClient({ businessData, model })).then(res => {
			enqueueSnackbar('Saved successfully!', { variant: 'success', autoHideDuration: 2000 });
			dispatch(getBusiness());
		});
	}

	return (
		<SnackbarProvider maxSnack={1}>
			<motion.div className="flex flex-wrap" variants={container} initial="hidden" animate="show">
				<motion.div variants={item} className="widget flex w-1/3 sm:w-2/3 md:w-2/3 p-12">
					<form className="flex flex-col justify-center w-full" onSubmit={handleSubmit(onSubmit)}>
						<Controller
							name="Nick_name"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									className="mb-16"
									type="text"
									label="Nick name"
									error={!!errors.Nick_name}
									helperText={errors?.Nick_name?.message}
									required
								/>
							)}
						/>
						<Controller
							name="Email"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									className="mb-16"
									type="text"
									label="Email"
									error={!!errors.Email}
									helperText={errors?.Email?.message}
									disabled
								/>
							)}
						/>
						<Button
							type="submit"
							variant="contained"
							color="primary"
							className="w-1/3 mx-auto mt-16"
							aria-label="save/change"
							disabled={_.isEmpty(dirtyFields) || !isValid}
							value="firebase"
						>
							Save/Change
						</Button>
					</form>
				</motion.div>
				<motion.div variants={item} className="widget flex w-1/3 sm:w-1/3 md:w-1/3 p-12">
					<form className="flex flex-col justify-center w-full" onSubmit={handleSubmit(onSubmit)}>
						<Typography className="text-base">This account belong to</Typography>
						<div className="flex items-center">
							<Avatar
								className={clsx(classes.avatar, 'avatar w-72 h-72 p-8 box-content')}
								alt="user photo"
								src={businessData.Business_logo}
							/>
							<Typography color="primary" className="text-lg">
								{businessData.Business_name.English}
							</Typography>
						</div>
					</form>
				</motion.div>
			</motion.div>
		</SnackbarProvider>
	);
}

export default EditProfile;
