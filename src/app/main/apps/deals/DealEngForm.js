import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useFormContext, Controller } from 'react-hook-form';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import { SnackbarProvider } from 'notistack';
import { Autocomplete } from '@material-ui/lab';


function DealEngForm() {    
    const methods = useFormContext();
	const { control, formState } = methods;
	const { errors } = formState;

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


	return (
		<SnackbarProvider maxSnack={1}>
			<motion.div className="flex flex-wrap w-full" variants={container} initial="hidden" animate="show">
				<motion.div variants={item} className="widget flex w-full sm:w-full md:w-full p-12">
					<div className="flex flex-col justify-center w-full">
						<Controller
							name="BusinessId"
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
											label="Business ID"
                                            error={!!errors.BusinessId}
                                            InputLabelProps={{
                                                shrink: true
                                            }}
											helperText={errors?.BusinessId?.message}
											fullWidth
											required
										/>
									)}
								/>
							)}
						/>

						<Controller
							name="Title"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									className="mb-16"
									type="text"
									label="Title"
									error={!!errors.Title}
									helperText={errors?.Title?.message}
									fullWidth
									required
								/>
							)}
						/>

						<Controller
							name="Description"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									className="mb-16"
									type="text"
									label="Description"
									multiline
									rows={5}
									error={!!errors.Description}
									helperText={errors?.Description?.message}
									variant="outlined"
									fullWidth
									required
								/>
							)}
						/>
						{/* <div className="flex items-center"> */}
                            
                        <Controller
							name="Items"
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
											label="Items"
                                            error={!!errors.Items}
                                            InputLabelProps={{
                                                shrink: true
                                            }}
											helperText={errors?.Items?.message}
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
							name="OriginalPrice"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									className="mb-16"
									type="number"
									label="Original Price"
									error={!!errors.OriginalPrice}
									helperText={errors?.OriginalPrice?.message}
									InputProps={{
										startAdornment: <InputAdornment position="start">$</InputAdornment>
									}}
									fullWidth
									required
								/>
							)}
						/>
						<Controller
							name="Price"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									className="mb-16"
									type="number"
									label="Price"
									error={!!errors.Price}
									helperText={errors?.Price?.message}
									InputProps={{
										startAdornment: <InputAdornment position="start">$</InputAdornment>
									}}
									fullWidth
									required
								/>
							)}
						/>
						<Controller
							name="Tax"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									className="mb-16"
									type="number"
									label="Tax"
									error={!!errors.Tax}
									helperText={errors?.Tax?.message}
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

export default DealEngForm;
