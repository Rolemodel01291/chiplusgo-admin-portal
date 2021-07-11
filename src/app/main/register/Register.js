import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import { darken } from '@material-ui/core/styles/colorManipulator';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Auth0RegisterTab from './tabs/Auth0RegisterTab';
import FirebaseRegisterTab from './tabs/FirebaseRegisterTab';
import JWTRegisterTab from './tabs/JWTRegisterTab';

const useStyles = makeStyles(theme => ({
	root: {
		background: `#FFF`,
		color: theme.palette.primary.contrastText
	},
	leftSection: {},
	rightSection: {
		background: `#FFF`,
		color: theme.palette.primary.dark
	}
}));

function Register() {
	const classes = useStyles();
	const [selectedTab, setSelectedTab] = useState(0);

	function handleTabChange(event, value) {
		setSelectedTab(value);
	}

	return (
		<div
			className={clsx(
				classes.root,
				'flex flex-col flex-auto items-center justify-center flex-shrink-0 p-16 md:p-24'
			)}
		>
			<motion.div
				initial={{ opacity: 0, scale: 0.6 }}
				animate={{ opacity: 1, scale: 1 }}
				className="flex w-full max-w-400 md:max-w-3xl rounded-20 overflow-hidden"
			>
				<div className={clsx(classes.rightSection, 'hidden md:flex flex-1 items-center justify-center p-64')}>
					<div className="max-w-320">
						<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.2 } }}>
							<div className="items-center">
								<div>
									<Typography className="text-20  text-center logo-text" color="inherit">
										Welcome to the CHI+GO!
									</Typography>
								</div>
								<img className="logo-icon w-150-p" src="assets/images/logos/logo.png" alt="logo" />
							</div>
						</motion.div>
					</div>
				</div>
				<Card
					className={clsx(
						classes.leftSection,
						'flex flex-col w-full max-w-sm items-center justify-center shadow-0'
					)}
					square
				>
					<div className="flex flex-col ">
						<div>
							<span className="font-normal mr-8">Enter your email address</span>
						</div>
					</div>
					<CardContent className="flex flex-col items-center justify-center w-full max-w-320">
						<FirebaseRegisterTab />
					</CardContent>
					<div className="flex flex-col items-center justify-center pb-32">
						<div>
							<span className="font-normal mr-8">Go to</span>
							<Link className="font-normal" to="/login">
								LOGIN
							</Link>
						</div>
						{/* <Link className="font-normal mt-8" to="/">
							Back to Dashboard
						</Link> */}
					</div>
				</Card>
			</motion.div>
		</div>
	);
}

export default Register;
