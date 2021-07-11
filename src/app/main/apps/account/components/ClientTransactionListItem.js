import { Typography } from '@material-ui/core';
import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import clsx from 'clsx';
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

const ListItem = ({ data, onPress, number }) => {
	const classes = useStyles();
	return (
		<div className="w-full my-12 flex align-center cursor-pointer" onClick={() => onPress(data)}>
			<div className="flex w-1/12 items-center justify-center">
				<Typography className="">{String(number + 1)}</Typography>
			</div>

			<div className="flex w-11/12 items-center relative py-7 border-1 border-blue-400">
				<div className="flex w-4/12 items-center pl-80">
					<Typography>{data.Id}</Typography>
				</div>
				<div className="flex w-3/12 items-center">
					<Typography>{data.Type}</Typography>
				</div>
				<div className="flex w-2/12 items-center">
					{data.Type === 'Refund' ? (
						<Typography className="text-red-800">-${data.Subtotal}</Typography>
					) : (
						<Typography className="text-green-800">+${data.Subtotal}</Typography>
					)}
				</div>
				<div className="flex w-2/12 items-center">
					<Typography>{data.Create_date}</Typography>
				</div>
				<div className="flex w-1/12 items-center justify-center">
					<Typography>Detail</Typography>
				</div>
			</div>
		</div>
	);
};

export default ListItem;
