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
import Icon from '@material-ui/core/Icon';
import InputAdornment from '@material-ui/core/InputAdornment';
import MaskedInput from 'react-text-mask';
import { selectBusinessById, updateBusiness, getBusiness } from '../store/businessSlice';
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
	Business_name: yup.string().required('Please enter nick name.'),
	Business_name_cn: yup.string().required('Please enter nick name.')
});

function TextMaskCustom(props) {
	const { inputRef, ...other } = props;

	return (
		<MaskedInput
			{...other}
			ref={ref => {
				inputRef(ref ? ref.inputElement : null);
			}}
			mask={['+', '1', ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
			placeholderChar={'\u2000'}
			showMask
		/>
	);
}

function EditProfile() {
	const { enqueueSnackbar } = useSnackbar();
	const classes = useStyles();
	const dispatch = useDispatch();
	const businessData = useSelector(({ account }) => account.accountWidgets.businessData);
	console.log(businessData);
	// const businessData = useSelector(state => selectBusinessById(state, businessData.BusinessId));

	const [state] = useState({
		businessData: {
			Business_name: businessData.Business_name.English ? businessData.Business_name.English : '',
			Business_name_cn: businessData.Business_name.Chinese ? businessData.Business_name.Chinese : '',
			Email: businessData.Email ? businessData.Email : '',
			BusinessId: businessData.id ? businessData.id : '',
			City: businessData.Addr.City ? businessData.Addr.City : '',
			State: businessData.Addr.State ? businessData.Addr.State : '',
			Street: businessData.Addr.Street ? businessData.Addr.Street : '',
			Zipcode: businessData.Addr.Zipcode ? businessData.Addr.Zipcode : '',
			Phone: businessData.Phone ? businessData.Phone : ''
			// SubaccountId: businessData.SubaccountId ? businessData.SubaccountId : ''
		}
	});

	const { control, setValue, formState, handleSubmit, reset, trigger, setError } = useForm({
		mode: 'onChange',
		defaultValues: state.businessData,
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
		var phoneNum = model.Phone.replace('(', '');
		phoneNum = phoneNum.replace(')', '');
		phoneNum = phoneNum.replace('-', '');
		phoneNum = phoneNum.split(' ').join('');
		phoneNum = phoneNum.replace('+1', '');
		model.Phone = phoneNum;
		console.log(model);
		dispatch(updateBusiness({ businessData, model })).then(res => {
			enqueueSnackbar('Saved successfully!', { variant: 'success', autoHideDuration: 2000 });
			dispatch(getBusiness());
		});
	}

	return (
		<SnackbarProvider maxSnack={1}>
			<motion.div className="flex flex-wrap" variants={container} initial="hidden" animate="show">
				<motion.div variants={item} className="widget flex w-full sm:w-full md:w-full p-12">
					<form className="flex flex-col justify-center w-full" onSubmit={handleSubmit(onSubmit)}>
						<Controller
							name="BusinessId"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									className="mb-16"
									type="text"
									label="Business Id"
									// error={!!errors.BusinessId}
									// helperText={errors?.BusinessId?.message}
									// required
									disabled
								/>
							)}
						/>
						<Controller
							name="Business_name"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									className="mb-16"
									type="text"
									label="Name"
									error={!!errors.Business_name}
									helperText={errors?.Business_name?.message}
									required
								/>
							)}
						/>
						<Controller
							name="Business_name_cn"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									className="mb-16"
									type="text"
									label="Chinese Name"
									error={!!errors.Business_name_cn}
									helperText={errors?.Business_name_cn?.message}
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
						<div className="flex -mx-8">
							<Controller
								name="City"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										className="mb-16 mx-8"
										type="text"
										label="City"
										error={!!errors.City}
										helperText={errors?.City?.message}
										fullWidth
										required
									/>
								)}
							/>

							<Controller
								name="State"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										className="mb-16 mx-8"
										type="text"
										label="State"
										error={!!errors.State}
										helperText={errors?.State?.message}
										fullWidth
										required
									/>
								)}
							/>

							<Controller
								name="Street"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										className="mb-16 mx-8"
										type="text"
										label="Street"
										error={!!errors.Street}
										helperText={errors?.Street?.message}
										fullWidth
										required
									/>
								)}
							/>
							
							<Controller
								name="Zipcode"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										className="mb-16 mx-8"
										type="text"
										label="Zipcode"
										error={!!errors.Zipcode}
										helperText={errors?.Zipcode?.message}
										fullWidth
										required
									/>
								)}
							/>

							<Controller
								name="Phone"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										className="mb-16 mx-8"
										type="text"
										label="Phone"
										error={!!errors.Phone}
										helperText={errors?.Phone?.message}
										InputProps={{
											inputComponent: TextMaskCustom
											// endAdornment: (
											// 	<InputAdornment position="end">
											// 		<Icon className="text-20" color="action">
											// 			double_arrow
											// 		</Icon>
											// 	</InputAdornment>
											// )
										}}
										fullWidth
										required
									/>
								)}
							/>
						</div>
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
				{/* <motion.div variants={item} className="widget flex w-1/3 sm:w-1/3 md:w-1/3 p-12">
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
				</motion.div> */}
			</motion.div>
		</SnackbarProvider>
	);
}

export default EditProfile;
