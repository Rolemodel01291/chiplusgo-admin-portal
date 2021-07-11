import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import Popover from '@material-ui/core/Popover';
import { DateTimePicker } from '@material-ui/pickers';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _, { result } from 'lodash';
import { Link } from 'react-router-dom';
import { changeLanguage } from 'app/store/i18nSlice';
import { selectTransaction, getTransaction } from '../store/transactionSlice';
import moment from 'moment';
import { selectClient } from '../store/clientSlice';
import { selectBusiness } from '../store/businessSlice';

const useStyles = makeStyles(theme => ({
	scroll: {
		width: '100%',
		maxWidth: '100%',
		backgroundColor: theme.palette.background.paper,
		
	},
	root: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		'& > *': {
			margin: theme.spacing(1)
		}
	},
	active: {
		backgroundColor: theme.palette.secondary.light
	}
}));

function LanguageSwitcher(props) {
	const classes = useStyles();
	const dispatch = useDispatch();
	const client = useSelector(selectClient);
	const business = useSelector(selectBusiness);
	const transactions = useSelector(selectTransaction);
	const [menu, setMenu] = useState(null);

	const item = {
		hidden: { opacity: 0, y: 20 },
		show: { opacity: 1, y: 0 }
	};

	const minDate = transactions.reduce(
		(min, p) => (p.Date < min ? p.Date : min),
		transactions[0].Date
	);
	const maxDate = transactions.reduce(
		(max, p) => (p.Date > max ? p.Date : max),
		transactions[0].Date
	);

	const [state, setState] = useState({
		min: minDate,
		max: maxDate,
		time: '1000',
		type: 'typeAll',
		activeIndex: '1000',
        activeIndexFilter: 'typeAll'
	});

	const langMenuClick = event => {
		console.log(event.currentTarget);
		setMenu(event.currentTarget);
	};

	const langMenuClose = () => {
		setMenu(null);
	};

	function handleClick(ev) {
		setState({ ...state, activeIndex: ev.currentTarget.value, time: ev.currentTarget.value });
	}

	function handleClickFilter(ev) {
        setState({ ...state, activeIndexFilter: ev.currentTarget.value, type: ev.currentTarget.value });
		
	}

	function getAccounts(client, business) {
		const temp = [];
		const fn = _.spread(_.union);
		if (client.length > 0 && business.length > 0) {
			temp.push(client);
			temp.push(business);
		}
		const arr = fn(temp);
		return arr;
	}

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const reset = () => {
		const result = getAccounts(client, business);
		const type = state.type;
		const time = 1000;
		const startDate = moment('1976-04-19T12:59-0500')._d;
		const endDate = moment()._d;
        setState({...state, activeIndex: "1000", activeIndexFilter: "typeAll"});
		dispatch(getTransaction({ result, type, time, startDate, endDate }));
	};

	const apply = () => {
		const result = getAccounts(client, business);
		const type = state.type;
		const time = state.time;
		const startDate = state.min;
		const endDate = state.max;
		dispatch(getTransaction({ result, type, time, startDate, endDate }));
	};

	return (
		<>
			<motion.div variants={item} className="widget flex w-full sm:w-full md:w-full p-12">
				<div className={classes.scroll}>
					<div className="flex p-12 items-baseline justify-end">
						<Typography color="primary" onClick={langMenuClick}>
							Filter/Sort
						</Typography>
					</div>
				</div>
			</motion.div>

			<Popover
				open={Boolean(menu)}
				anchorEl={menu}
				onClose={langMenuClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center'
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'center'
				}}
				classes={{
					paper: 'py-16'
				}}
			>
				<div className="flex w-full p-12 flex-col">
					<div className="flex p-12 justify-between">
						<div className="flex justify-start items-baseline">
							<Button className="text-base primary" onClick={reset}>
								Reset
							</Button>
						</div>
						<div className="flex justify-end items-baseline">
							<Button className="text-base primay" onClick={apply}>
								Apply
							</Button>
						</div>
					</div>
					<div className="flex flex-col p-12">
						<div className="flex justify-start items-baseline py-6">
							<Typography className="text-base ">Time</Typography>
						</div>
						<div className="flex items-baseline">
							<ButtonGroup size="large" color="primary" aria-label="large outlined primary button group">
								<Button
									className={state.activeIndex == '1000' ? classes.active : ''}
									onClick={handleClick}
									value="1000"
								>
									All
								</Button>
								<Button
									className={state.activeIndex == '1' ? classes.active : ''}
									onClick={handleClick}
									value="1"
								>
									Daily
								</Button>
								<Button
									className={state.activeIndex == '7' ? classes.active : ''}
									onClick={handleClick}
									value="7"
								>
									Weekly
								</Button>
								<Button
									className={state.activeIndex == '30' ? classes.active : ''}
									onClick={handleClick}
									value="30"
								>
									Monthly
								</Button>
							</ButtonGroup>
						</div>
					</div>

					<div className="flex flex-col p-12">
						<div className="flex justify-start items-baseline py-6">
							<Typography className="text-base ">Type</Typography>
						</div>
						<div className="flex items-baseline">
							<ButtonGroup size="large" color="primary" aria-label="large outlined primary button group">
								<Button className={state.activeIndexFilter == 'typeAll' ? classes.active : ''} onClick={handleClickFilter} value="typeAll">
									All
								</Button>
								<Button className={state.activeIndexFilter == 'Purchase' ? classes.active : ''} onClick={handleClickFilter} value="Purchase">
									Purchase
								</Button>
								<Button className={state.activeIndexFilter == 'Refund' ? classes.active : ''} onClick={handleClickFilter} value="Refund">
									Refund
								</Button>
								<Button className={state.activeIndexFilter == 'Pay' ? classes.active : ''} onClick={handleClickFilter} value="Pay">
									Pay
								</Button>
							</ButtonGroup>
						</div>
					</div>

					<div className="flex flex-col p-12">
						<div className="flex justify-start items-baseline py-6">
							<Typography className="text-base ">Start Time-End Time</Typography>
						</div>
						<div className="flex items-baseline">
							<DateTimePicker
								renderInput={props => <TextField {...props} />}
								label="Start Time"
								value={state.min}
								maxDate={moment()._d}
								onChange={newValue => {
									setState({ ...state, min: newValue });
								}}
							/>
							<DateTimePicker
								renderInput={props => <TextField {...props} />}
								label="End Time"
								value={state.max}
								maxDate={moment()._d}
								onChange={newValue => {
									setState({ ...state, max: newValue });
								}}
							/>
						</div>
					</div>
				</div>
			</Popover>
		</>
	);
}

export default LanguageSwitcher;
