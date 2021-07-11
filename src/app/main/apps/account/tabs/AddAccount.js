import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { motion } from 'framer-motion';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import MaskedInput from 'react-text-mask';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import MuiPhoneNumber from 'material-ui-phone-number';
import Icon from '@material-ui/core/Icon';
import InputAdornment from '@material-ui/core/InputAdornment';
import Avatar from '@material-ui/core/Avatar';
import { useFilePicker } from 'use-file-picker';
import { SnackbarProvider, useSnackbar } from 'notistack';
import clsx from 'clsx';
import firebaseService from 'app/services/firebaseService/firebaseService';
import { addBusiness, getBusiness } from '../store/businessSlice';
import { phoneAPI } from 'app/services/api';
import { CodeOutlined } from '@material-ui/icons';
import axios from 'axios';

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
	},
	checkPhone: {
		hover: {
			cursor: 'default'
		}
	}
}));

// const phoneRegExp = /^([0|\+[0-9]{1,5})?([0-9]{10})$/

const schema = yup.object().shape({
	Email: yup.string().email('You must enter a valid email').required('You must enter a email'),
	Password: yup
		.string()
		.required('Please enter your password.')
		.min(8, 'Password is too short - should be 8 chars minimum.'),
	PasswordConfirm: yup.string().oneOf([yup.ref('Password'), null], 'Passwords must match'),
	Business_name: yup.string().required('Please enter English name.'),
	Business_name_cn: yup.string().required('Please enter Chinese name.'),
	Address_one: yup.string().required('Please enter Address.'),
	City: yup.string().required('Please enter City.'),
	State: yup.string().required('Please enter State.'),
	Zipcode: yup.string().required('Please enter Zipcode.'),
	Phone: yup.string().required('Please enter your phone')
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

function AddBusiness() {
	const { enqueueSnackbar } = useSnackbar();
	const classes = useStyles();
	const dispatch = useDispatch();
	const businessData = useSelector(({ account }) => account.accountWidgets.businessData);

	const [state, setState] = useState({
		businessData: {
			Business_name: '',
			Business_name_cn: '',
			Email: '',
			Password: '',
			PasswordConfirm: '',
			Address_one: '',
			Address_two: '',
			City: '',
			State: '',
			Zipcode: '',
			Phone: ''
		},
		logo: ''
	});

	const [openFileSelector, { filesContent, loading }] = useFilePicker({
		readAs: 'DataURL',
		accept: 'image/*',
		multiple: true,
		limitFilesConfig: { max: 1 },
		// minFileSize: 0.1, // in megabytes
		maxFileSize: 50
		// imageSizeRestrictions: {
		// 	maxHeight: 900, // in pixels
		// 	maxWidth: 1600,
		// 	minHeight: 600,
		// 	minWidth: 768
		// }
	});

	useEffect(() => {
		console.log(filesContent);
		if (filesContent.length > 0) {
			const reference = firebaseService.storage.ref(`logo/${filesContent[0].name}`);

			reference
				.putString(filesContent[0].content, 'data_url')
				.then(async res => {
					const url = await firebaseService.storage.ref(`logo/${filesContent[0].name}`).getDownloadURL();
					setState({ ...state });
					setState({ ...state, logo: url });
				})
				.catch(e => {
					console.log(e);
				});
		}
	}, [filesContent]);

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

	async function onSubmit(model) {
		var phoneNum = model.Phone.replace('(', '');
		phoneNum = phoneNum.replace(')', '');
		phoneNum = phoneNum.replace('-', '');
		phoneNum = phoneNum.split(' ').join('');
		// checkPhone(phoneNum).then(res=>{
		// 	if(res.error){
		// 		enqueueSnackbar(res.message, {
		// 		variant: 'error',
		// 		autoHideDuration: 3000
		// 		});
		// 	} else {
		// 		enqueueSnackbar('Phone check success!', { variant: 'success', autoHideDuration: 2000 });
				dispatch(addBusiness({ ...model, Business_logo: state.logo, Phone: phoneNum })).then(res => {
					console.log({...res});
					if (!res.error) {
						enqueueSnackbar('Added successfully!', { variant: 'success', autoHideDuration: 2000 });
						dispatch(getBusiness());
					} else {
						enqueueSnackbar('Register Failed! The email address is already in use by another account.', {
							variant: 'error',
							autoHideDuration: 3000
						});
					}
				});
			// }
		// })
		
	}

	const checkPhone = (phoneNum) =>
		new Promise((resolve, reject) => {
			if (phoneNum.length > 0) {
				phoneAPI
					.checkPhone({
						Phone: phoneNum
					})
					.then(res => {
						resolve(res);
					});
			}
		});

	return (
		<SnackbarProvider maxSnack={1}>
			<motion.div className="flex flex-wrap" variants={container} initial="hidden" animate="show">
				<motion.div variants={item} className="widget flex w-1/12 sm:w-1/12 md:w-1/12 p-12 justify-center">
					<div className="flex relative">
						<Avatar
							className={clsx(classes.avatar, 'avatar w-96 h-96 p-8 box-content')}
							alt="user photo"
							src={state.logo ? state.logo : '/assets/images/avatars/profile.jpg'}
						/>
						<div
							onClick={() => openFileSelector()}
							className="w-24 absolute h-24 rounded-full bg-green-800 flex items-center justify-center cursor-pointer top-80 left-80"
						>
							<Icon size={16}>edit</Icon>
						</div>
					</div>
				</motion.div>
				<motion.div variants={item} className="widget flex w-11/12 sm:w-11/12 md:w-11/12 p-12">
					<form className="flex flex-col justify-center w-full" onSubmit={handleSubmit(onSubmit)}>
						<div className="flex -mx-8">
							<Controller
								name="Business_name"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										type="text"
										label="English Name"
										className="mx-8"
										error={!!errors.Business_name}
										helperText={errors?.Business_name?.message}
										fullWidth
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
										type="text"
										label="Chinese Name"
										className="mx-8"
										error={!!errors.Business_name_cn}
										helperText={errors?.Business_name_cn?.message}
										fullWidth
										required
									/>
								)}
							/>
						</div>

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
									required
								/>
							)}
						/>

						<Controller
							name="Password"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									className="mb-16"
									type="Password"
									label="Password"
									error={!!errors.Password}
									helperText={errors?.Password?.message}
									InputProps={{
										endAdornment: (
											<InputAdornment position="end">
												<Icon color="action" className={clsx(classes.checkPhone, 'text-20')}>
													vpn_key
												</Icon>
											</InputAdornment>
										)
									}}
									required
								/>
							)}
						/>

						<Controller
							name="PasswordConfirm"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									className="mb-16"
									type="password"
									label="Confirm Password"
									error={!!errors.PasswordConfirm}
									helperText={errors?.PasswordConfirm?.message}
									InputProps={{
										endAdornment: (
											<InputAdornment position="end">
												<Icon className="text-20" color="action">
													vpn_key
												</Icon>
											</InputAdornment>
										)
									}}
									required
								/>
							)}
						/>
						<Controller
							name="Address_one"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									className="mb-16"
									type="text"
									label="Address Line 1"
									error={!!errors.Address_one}
									helperText={errors?.Address_one?.message}
									required
								/>
							)}
						/>
						<Controller
							name="Address_two"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									className="mb-16"
									type="text"
									label="Address Line 2"
									// error={!!errors.Address_two}
									// helperText={errors?.Address_two?.message}
									// required
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
								name="Zipcode"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										className="mb-16 mx-8"
										type="number"
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
											inputComponent: TextMaskCustom,
											// endAdornment: (
											// 	<InputAdornment position="end">
											// 		<Icon className="text-20" color="action" onClick={checkPhone}>
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
							Save
						</Button>
					</form>
				</motion.div>
			</motion.div>
		</SnackbarProvider>
	);
}

export default AddBusiness;
