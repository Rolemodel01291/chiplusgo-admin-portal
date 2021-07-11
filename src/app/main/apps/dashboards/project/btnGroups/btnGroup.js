import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import WorkIcon from '@material-ui/icons/Work';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { getBusiness, selectBusiness, setSelectedBusinessId, setPoint2Cash } from '../store/businessSlice';

const useStyles = makeStyles(theme => ({
	root: {
		width: '100%',
		maxWidth: 360
	},
	dividerFullWidth: {
		margin: `5px 0 0 ${theme.spacing(2)}px`
	},
	dividerInset: {
		margin: `5px 0 0 ${theme.spacing(9)}px`
	},
	btnSpace: {
		width: '100%',
		display: 'flex',
		'& > *': {
			margin: theme.spacing(2)
		}
	}
}));

const BtnGroup = () => {
	const dispatch = useDispatch();
	const classes = useStyles();
	const btnClasses = useStyles();

	const handleClick = ev => {
		const temp = 1 / parseFloat(ev.currentTarget.value);
		dispatch(setPoint2Cash(temp));
	};

	return (
		<div className="flex flex-wrap">
			<div className={btnClasses.btnSpace}>
				<Button size="large" variant="contained" onClick={handleClick} value="0.5">
					0.5
				</Button>
				<Button size="large" variant="contained" onClick={handleClick} value="1">
					1
				</Button>
				<Button size="large" variant="contained" onClick={handleClick} value="1.5">
					1.5
				</Button>
				<Button size="large" variant="contained" onClick={handleClick} value="2">
					2
				</Button>
				<Button size="large" variant="contained" onClick={handleClick} value="2.5">
					2.5
				</Button>
				<Button size="large" variant="contained" onClick={handleClick} value="3">
					3
				</Button>
				<Button size="large" variant="contained" onClick={handleClick} value="3.5">
					3.5
				</Button>
				<Button size="large" variant="contained" onClick={handleClick} value="4">
					4
				</Button>
				{/* <Button size="large" variant="contained" onClick={handleClcik}>Other</Button> */}
				
			</div>
		</div>
	);
};
export default BtnGroup;
