import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useFormContext, Controller } from 'react-hook-form';
import { Typography } from '@material-ui/core';
import clsx from 'clsx';
import Avatar from '@material-ui/core/Avatar';
import { SnackbarProvider } from 'notistack';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
	avatar: {
		background: theme.palette.background.default,
		transition: theme.transitions.create('all', {
			duration: theme.transitions.duration.shortest
			// easing: theme.transitions.easing.easeInOut
		}),
		bottom: 0,
		'& > img': {
			borderRadius: '50%'
		}
	}
}));

function LeftForm({ data }) {
	const classes = useStyles();
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

	console.log('========,', data);
	return (
		<SnackbarProvider maxSnack={1}>
			<motion.div className="flex flex-wrap w-full" variants={container} initial="hidden" animate="show">
				<motion.div variants={item} className="widget flex flex-wrap w-full sm:w-full md:w-full p-12">
					<div className="flex flex-col justify-center w-full">
						<div className="flex items-center absolute">
							<Avatar
								className={clsx(
									classes.avatar,
									'avatar w-40 h-40 box-content border-1 border-blue-400'
								)}
								alt="user photo"
								src={
									data.businessData.Business_logo
										? data.businessData.Business_logo
										: '/assets/images/avatars/profile.jpg'
								}
							/>
						</div>
						<div className="flex w-3/12 items-center pl-80">
							<Typography>{data.businessData.Business_name.English}</Typography>
						</div>
					</div>
					<div className="flex justify-center w-full">
						<div className="flex w-full items-center">
							<Typography className ="text-72">${data.Subtotal}</Typography>
						</div>
					</div>
				</motion.div>
			</motion.div>
		</SnackbarProvider>
	);
}

export default LeftForm;
