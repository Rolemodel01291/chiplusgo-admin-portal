import { useState } from 'react';
import Slider from '@material-ui/core/Slider';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/core/Menu';
import firebaseService from 'app/services/firebaseService';
import clsx from 'clsx';
import { logoutUser } from 'app/auth/store/userSlice';
import { useDispatch } from 'react-redux';

function SignOut(props) {
	const [anchorEl, setAnchorEl] = useState(null);
	const [fontSize, setFontSize] = useState(1);
	const dispatch = useDispatch();
	function changeHtmlFontSize() {
		const html = document.getElementsByTagName('html')[0];
		html.style.fontSize = `${fontSize * 62.5}%`;
	}

	const handleClick = event => {
		dispatch(logoutUser())
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<div>
            <Typography variant="caption">Signout</Typography>
			<IconButton
				className={clsx('w-40 h-40', props.className)}
				aria-controls="font-size-menu"
				aria-haspopup="true"
				onClick={handleClick}
			>
				
				<Icon>login</Icon>
			</IconButton>
		</div>
	);
}

export default SignOut;
