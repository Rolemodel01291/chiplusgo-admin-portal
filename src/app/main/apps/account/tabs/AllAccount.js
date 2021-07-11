import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import IconButton from '@material-ui/core/IconButton';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';
import clsx from 'clsx';
import Icon from '@material-ui/core/Icon';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import { selectBusiness } from '../store/businessSlice';
import Avatar from '@material-ui/core/Avatar';
import { setSubaccountData, setAccountState, setBusinessData } from '../store/accountWidgetsSlice';
import Orders from '../../e-commerce/orders/Orders';

const useStyles = makeStyles(theme => ({
	root: {
		width: '100%',
		maxWidth: '100%',
		backgroundColor: theme.palette.background.paper
	},
	scroll: {
		width: '100%',
		maxWidth: '100%',
		backgroundColor: theme.palette.background.paper,
		overflow: 'auto'
	},
	list: {
		border: '1px',
		borderColor: 'red'
	},
	nested: {
		paddingLeft: theme.spacing(4)
	},
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
	}
}));

function AllAccount() {
	const classes = useStyles();
	const [open, setOpen] = useState(-1);
	const business = useSelector(selectBusiness);
	const dispatch = useDispatch();
	const [state, setState] = useState({
		business: []
	});
	var temp = [];
	useEffect(() => {
		if (business.length > 0) {
			setState({ ...state, business: business.filter(e => e.AccountType === 'MAIN') });
		}
	}, [business]);
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

	const handleClick = index => {
		setOpen(index);
	};

	const onClickSub = data => {
		dispatch(setSubaccountData(data));
		dispatch(setAccountState({ isBusinessaccount: false, isSubaccount: true }));
	};

	const onClickBusiness = data => {
		dispatch(setBusinessData(data));
		dispatch(setAccountState({ isBusinessaccount: true, isSubaccount: false }));
	};

	const handleChange = ev => {
		const main_businees = business.filter(e => e.AccountType === 'MAIN');
		const temp = main_businees.filter(name => name.Business_name.English.toLowerCase().includes(ev.target.value));
		setState({...state, business: temp});
	}

	return (
		<motion.div className="flex flex-wrap " variants={container} initial="hidden" animate="show">
			<motion.div variants={item} className="widget flex w-full sm:w-full md:w-full p-12 flex-col">
				<Paper className="flex items-center h-44 w-full px-16 rounded-16 shadow my-16">
					<Input
						placeholder="Search..."
						disableUnderline
						fullWidth
						inputProps={{
							'aria-label': 'Search'
						}}
						onChange={handleChange}
					/>
					<Icon color="action">search</Icon>
				</Paper>
				<div className={classes.scroll}>
				
					<List component="nav" aria-labelledby="nested-list-subheader" className={classes.root}>
						{state.business.map((item, index) => {
							return (
								<div key={index}>
									<ListItem className={classes.list} button>
										<ListItemIcon onClick={() => onClickBusiness(item)}>
											<Avatar
												className={clsx(classes.avatar, 'avatar w-40 h-40 p-8 box-content')}
												alt="user photo"
												src={item.Business_logo}
											/>
										</ListItemIcon>

										<ListItemText
											primary={item.Business_name.English}
											onClick={() => onClickBusiness(item)}
										/>
										<IconButton
											className={clsx('w-40 h-40')}
											aria-controls="font-size-menu"
											aria-haspopup="true"
											onClick={() => handleClick(index)}
										>
											{open === index ? <ExpandLess /> : <ExpandMore />}
										</IconButton>
									</ListItem>
									{Object.keys(item).includes('Sub_account') &&
										item.Sub_account.map((subItem, subIndex) => {
											return (
												<Collapse
													key={subIndex}
													in={open === index}
													timeout="auto"
													unmountOnExit
												>
													<List component="div" disablePadding>
														<ListItem
															button
															className={classes.nested}
															onClick={() => onClickSub(subItem)}
														>
															<ListItemIcon>
																<StarBorder />
															</ListItemIcon>
															<ListItemText primary={subItem.Nick_name} />
														</ListItem>
													</List>
												</Collapse>
											);
										})}
								</div>
							);
						})}
					</List>
				</div>
			</motion.div>
		</motion.div>
	);
}

export default AllAccount;
