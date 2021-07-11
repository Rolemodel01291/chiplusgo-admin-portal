import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import firebaseService from 'app/services/firebaseService';
import { useDispatch, useSelector } from 'react-redux';
import { hideMessage, showMessage } from 'app/store/fuse/messageSlice';
import * as yup from 'yup';
import TextField from '@material-ui/core/TextField';
import _ from '@lodash';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
	email: yup.string().email('You must enter a valid email').required('You must enter a email')
});

const defaultValues = {
	email: ''
};

function FirebaseLoginTab(props) {
	const dispatch = useDispatch();
	const login = useSelector(({ auth }) => auth.login);

	const { control, setValue, formState, handleSubmit, reset, trigger, setError } = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: yupResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	const [showPassword, setShowPassword] = useState(false);
	const [successMessage, setSuccessMessage] = useState('');

	const formRef = useRef(null);

	useEffect(() => {
		login.errors.forEach(error => {
			setError(error.type, {
				type: 'manual',
				message: error.message
			});
		});
	}, [login.errors, setError]);

	function onSubmit(model) {
		firebaseService.auth
			.sendPasswordResetEmail(model.email)
			.then(function (user) {
				setSuccessMessage('We have sent the reset password link to your email. Please check your email...');
				// dispatch(showMessage({ message: "Please check your email..." }))
			})
			.catch(function (e) {});
	}

	return (
		<div className="w-full">
			<form className="flex flex-col justify-center w-full" onSubmit={handleSubmit(onSubmit)}>
				<Controller
					name="email"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mb-16"
							type="text"
							label="Email"
							error={!!errors.email}
							helperText={errors?.email?.message}
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										<Icon className="text-20" color="action">
											email
										</Icon>
									</InputAdornment>
								)
							}}
							variant="outlined"
							required
						/>
					)}
				/>
				<div>{successMessage}</div>

				{/* <Controller
					name="password"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mb-16"
							type="password"
							label="Password"
							error={!!errors.password}
							helperText={errors?.password?.message}
							InputProps={{
								className: 'pr-2',
								type: showPassword ? 'text' : 'password',
								endAdornment: (
									<InputAdornment position="end">
										<IconButton onClick={() => setShowPassword(!showPassword)}>
											<Icon className="text-20" color="action">
												{showPassword ? 'visibility' : 'visibility_off'}
											</Icon>
										</IconButton>
									</InputAdornment>
								)
							}}
							variant="outlined"
							required
						/>
					)}
				/> */}

				<Button
					type="submit"
					variant="contained"
					color="primary"
					className="w-full mx-auto mt-16"
					aria-label="LOG IN"
					disabled={_.isEmpty(dirtyFields) || !isValid}
					value="firebase"
				>
					Send
				</Button>
			</form>
		</div>
	);
}

export default FirebaseLoginTab;
