import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useFormContext, Controller } from 'react-hook-form';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import { SnackbarProvider } from 'notistack';
import { Autocomplete } from '@material-ui/lab';


function RightForm() {    
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
							name="note"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									className="mb-16"
									type="text"
									label="Note"
									multiline
									rows={5}
									error={!!errors.note}
									helperText={errors?.note?.message}
									variant="outlined"
									fullWidth
									
								/>
							)}
						/>
			
				</div>
				</motion.div>
			</motion.div>
		</SnackbarProvider>
	);
}

export default RightForm;
