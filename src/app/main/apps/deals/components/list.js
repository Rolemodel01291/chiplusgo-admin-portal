import { Typography } from '@material-ui/core';
import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import clsx from 'clsx';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useDispatch } from 'react-redux';
import { deleteCoupon, setCouponData } from '../store/couponSlice';
import history from '@history'

const useStyles = makeStyles(theme => ({
	avatar: {
		background: theme.palette.background.default,
		transition: theme.transitions.create('all', {
			duration: theme.transitions.duration.shortest
		}),
		bottom: 0,
		'& > img': {
			borderRadius: '50%'
		}
	}
}));

const ListItem = ({ data, onPress, number }) => {
	const classes = useStyles();
	const [open, setOpen] = React.useState(false);
	const dispatch = useDispatch();
	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleDelete = data => {
		setOpen(false);
		console.log(data);
		dispatch(deleteCoupon(data));
	};

	const goEdit = (data) => {
		dispatch(setCouponData(data))
		history.push({
			pathname:'/apps/deals/edit'
		})
	}
	return (
		<div className="w-full my-16 flex align-center cursor-pointer" onClick={() => onPress(data)}>
			<div className="flex w-16 items-center justify-center"></div>

			<div className="flex w-full items-center relative py-7 border-t-1 border-r-1 border-b-1 border-blue-400 pl-12">
				<div className="flex items-center absolute -left-12">
					<Avatar
						className={clsx(classes.avatar, 'avatar w-40 h-40 box-content border-1 border-blue-400')}
						alt="user photo"
						src={data.Image.length>0 ? data.Image[0] : '/assets/images/avatars/profile.jpg'}
					/>
				</div>
				<div className="flex w-3/12 items-center pl-80">
					<Typography>{`${data.Title}(${data.Title_cn})`}</Typography>
				</div>
				<div className="flex w-2/12 items-center"></div>
				<div className="flex w-5/12 items-center"></div>
				<div className="flex w-1/12 items-center"></div>
				<div className="flex w-1/12 items-center justify-around">
					<IconButton
						className={clsx('w-16 h-16')}
						aria-controls="font-size-menu"
						aria-haspopup="true"
						onClick={()=>goEdit(data)}
					>
						<Icon>edit</Icon>
					</IconButton>
					<IconButton
						className={clsx('w-16 h-16')}
						aria-controls="font-size-menu"
						aria-haspopup="true"
						onClick={handleClickOpen}
					>
						<Icon>delete</Icon>
					</IconButton>
				</div>
			</div>
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">{'Remove Deal'}</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						Do you want to remove this deal? This action can not be undone.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary">
						Cancel
					</Button>
					<Button onClick={() => handleDelete(data)} color="primary" autoFocus>
						Ok
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default ListItem;
