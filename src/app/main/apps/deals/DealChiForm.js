import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useFormContext, Controller } from 'react-hook-form';
import TextField from '@material-ui/core/TextField';
import MaskedInput from 'react-text-mask';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import { SnackbarProvider } from 'notistack';
import { Autocomplete } from '@material-ui/lab';
import {useParams} from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { DateTimePicker } from '@material-ui/pickers';

function TextMaskCustom(props) {
	const { inputRef, ...other } = props;

	return (
		<MaskedInput
			{...other}
			ref={ref => {
				inputRef(ref ? ref.inputElement : null);
			}}
			mask={[/\d/, /\d/,':',/\d/, /\d/, '-', /\d/, /\d/,':',/\d/, /\d/]}
			placeholderChar={'\u2000'}
			showMask
		/>
	);
}

function DealChiForm() {
	const methods = useFormContext();
	const routeParams = useParams()
	const { control, formState, watch } = methods;
	const { errors } = formState;

	const container = {
		show: {
			transition: {
				staggerChildren: 0.1
			}
		}
	};

	const start = watch('start');
	const end = watch('end');

	const item = {
		hidden: { opacity: 0, y: 20 },
		show: { opacity: 1, y: 0 }
	};

	return (
		<SnackbarProvider maxSnack={1}>
			<motion.div className="flex flex-wrap w-full" variants={container} initial="hidden" animate="show">
				<motion.div variants={item} className="widget flex w-full sm:w-full md:w-full p-12">
					<div className="flex flex-col justify-center w-full">
						<Controller
							name="Title_cn"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									className="mb-16"
									type="text"
									label="Chinese Title"
									error={!!errors.Title_cn}
									helperText={errors?.Title_cn?.message}
									fullWidth
									required
								/>
							)}
						/>

						<Controller
							name="Description_cn"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									className="mb-16"
									type="text"
									label="Chinese Description"
									multiline
									rows={5}
									error={!!errors.Description_cn}
									helperText={errors?.Description_cn?.message}
									variant="outlined"
									fullWidth
									required
								/>
							)}
						/>
						{/* <div className="flex items-center"> */}

						<Controller
							name="Items_cn"
							control={control}
							defaultValue={[]}
							render={({ field: { onChange, value } }) => (
								<Autocomplete
									className="mt-8 mb-16"
									multiple
									freeSolo
									options={[]}
									value={value}
									onChange={(event, newValue) => {
										onChange(newValue);
									}}
									renderInput={params => (
										<TextField
											{...params}
											type="text"
											label="Chinese Items"
											error={!!errors.Items_cn}
											InputLabelProps={{
												shrink: true
											}}
											helperText={errors?.Items_cn?.message}
											fullWidth
											required
										/>
									)}
								/>
							)}
						/>
						{/* <Button
								variant="contained"
								color="primary"
								className="w-1/3 h-1/3 mx-auto ml-12"
								aria-label="save/change"
								// disabled={_.isEmpty(dirtyFields) || !isValid}
								value="firebase"
							>
								Add
							</Button> */}
						{/* </div> */}

						<Controller
							name="Top_ads"
							control={control}
							render={({ field: { onChange, value } }) => (
								<FormControlLabel
									className="mt-8 mb-16"
									label="Top ads"
									control={
										<Switch
											onChange={ev => {
												onChange(ev.target.checked);
											}}
											checked={value}
											name="Top_ads"
											disabled={routeParams.id==='edit'?true:false}
										/>
									}
								/>
							)}
						/>
						<Controller
							name="start"
							control={control}
							defaultValue=""
							render={({ field: { onChange, value } }) => (
								<DateTimePicker
									label="Start Date"
									// inputVariant="outlined"
									value={value}
									className="mt-8 mb-16 w-full"
									onChange={onChange}
									error={!!errors.start}
									helperText={errors?.start?.message}
									maxDate={end}
								/>
							)}
						/>
						<Controller
							name="end"
							control={control}
							defaultValue=""
							render={({ field: { onChange, value } }) => (
								<DateTimePicker
									label="End Date"
									// inputVariant="outlined"
									value={value}
									onChange={onChange}
									error={!!errors.end}
									helperText={errors?.end?.message}
									className="mt-8 mb-16 w-full"
									minDate={start}
								/>
							)}
						/>
						<Controller
							name="available_hours"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									className="mb-16"
									type="text"
									// value={values.textmask}
									label="Available Hours"
									error={!!errors.available_hours}
									helperText={errors?.available_hours?.message}
									InputProps={{
										inputComponent: TextMaskCustom
									}}
									fullWidth
									required
								/>
							)}
						/>
					</div>
				</motion.div>
			</motion.div>
		</SnackbarProvider>
	);
}

export default DealChiForm;
