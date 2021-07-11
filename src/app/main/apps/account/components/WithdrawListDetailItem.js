import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import _ from '@lodash';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { SnackbarProvider } from 'notistack';
import { useForm, FormProvider, Controller, useFormContext } from 'react-hook-form';
import LeftForm from './LeftForm';
import RightForm from './RightForm';
import MiddleForm from './MiddleForm';

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



const WithdrawListDetailItem = ({ data, onPress, number }) => {
	const classes = useStyles();
	;

	

	// useEffect(() => {
	// 	if (!_.isEmpty(data)) {
	// 		setValue('Activity_Number', data.id);
	// 		setValue('Activity_Type', data.Type);
	// 	}
	// }, [data]);

	

	

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
		<>
			<div
				className="w-full my-12 flex align-center cursor-pointer" onClick ={()=>onPress(data)}
			>
				<div className="flex w-1/12 items-center justify-center">
					<Typography className="">{String(number + 1)}</Typography>
				</div>

				<div className="flex w-11/12 items-center relative py-7 border-1 border-blue-400">
					<div className="flex w-6/12 items-center pl-80">
						<Typography>{data.id}</Typography>
					</div>
					<div className="flex w-3/12 items-center">
						<Typography>{data.Subtotal}</Typography>
					</div>
					<div className="flex w-2/12 items-center">
						<Typography>{data.Create_date}</Typography>
					</div>
				</div>
			</div>
		</>
	);
};

export default WithdrawListDetailItem;


