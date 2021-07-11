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
import { selectClientById, setClient, getClient } from '../store/clientSlice';
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
	Name: yup.string().required('Please enter nick name.')
});

function EditClientProfile() {
	const { enqueueSnackbar } = useSnackbar();
	const classes = useStyles();
	const dispatch = useDispatch();
	const clientData = useSelector(({ account }) => account.client.selectedClient);

	const [state] = useState({
		clientData: {
			Name: clientData.Name ? clientData.Name : '',
			Email: clientData.Email ? clientData.Email : '',
			Phone: clientData.Phone ? clientData.Phone : ''
		}
	});

	const { control, setValue, formState, handleSubmit, reset, trigger, setError } = useForm({
		mode: 'onChange',
		defaultValues: state.clientData,
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
				<motion.div variants={item} className="widget flex w-1/12 sm:w-1/12 md:w-1/12 p-12 justify-center">
					<div className="flex ">
						<Avatar
							className={clsx(classes.avatar, 'avatar w-96 h-96 p-8 box-content')}
							alt="user photo"
							src={clientData.Avatar ? clientData.Avatar : '/assets/images/avatars/profile.jpg'}
						/>
					</div>
				</motion.div>
				<motion.div variants={item} className="widget flex w-11/12 sm:w-11/12 md:w-11/12 p-12">
					<form className="flex flex-col justify-center w-full" onSubmit={handleSubmit(onSubmit)}>
						<Controller
							name="Name"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									className="mb-16"
									type="text"
									label="Name"
									error={!!errors.Name}
									helperText={errors?.Name?.message}
									required
									disabled
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
						<Controller
							name="Phone"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									className="mb-16"
									type="text"
									label="Phone"
									error={!!errors.Phone}
									helperText={errors?.Phone?.message}
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
			</motion.div>
		</SnackbarProvider>
	);
}

export default EditClientProfile;
