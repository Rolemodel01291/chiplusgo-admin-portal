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

			<div className="flex w-11/12 items-center relative py-7 border-t-1 border-r-1 border-b-1 border-blue-400">
				<div className="flex items-center absolute -left-12">
					<Avatar
						className={clsx(classes.avatar, 'avatar w-40 h-40 box-content border-1 border-blue-400')}
						alt="user photo"
						src={
							data.clientData?Object.keys(data.clientData).includes('Avatar')
								? data.clientData.Avatar
									? data.clientData.Avatar
									: '/assets/images/profile/fall-glow-small.jpg'
								: '/assets/images/profile/fall-glow-small.jpg'
								:'/assets/images/profile/fall-glow-small.jpg'
						}
					/>
				</div>
				<div className="flex w-3/12 items-center pl-80">
					<Typography>{data.ClientName?data.ClientName:data.clientData.Name}</Typography>
				</div>
				<div className="flex w-4/12 items-center">
					<Typography>{data.OrderId?data.OrderId:data.Id}</Typography>
				</div>
				<div className="flex w-3/12 items-center">
					<Typography>{data.Title?data.Title:data.Order_type}</Typography>
				</div>
				<div className="flex w-1/12 items-center">
					<Typography>${data.Price?data.Price:data.Original_price}</Typography>
				</div>
				<div className="flex w-1/12 items-center justify-center">
					<Typography>Detail</Typography>
				</div>
			</div>
		</div>
	);
};

export default ListItem;
