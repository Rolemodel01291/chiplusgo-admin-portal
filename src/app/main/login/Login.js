import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import { darken } from '@material-ui/core/styles/colorManipulator';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import FirebaseLoginTab from './tabs/FirebaseLoginTab';

const useStyles = makeStyles(theme => ({
	root: {
		background: `#FFF`,
		color: theme.palette.primary.contrastText
	},
	leftSection: {},
	rightSection: {
		background: `linear-gradient(to right, ${theme.palette.primary.dark} 0%, ${darken(
			theme.palette.primary.dark,
			0.5
		)} 100%)`,
		color: theme.palette.primary.contrastText
	}
}));

function Login() {
	const classes = useStyles();


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
				<Card
					className={clsx(
						// classes.leftSection,
						'flex flex-col w-full items-center justify-center shadow-0'
					)}
					square
				>
					<CardContent className="flex flex-col items-center justify-center w-full  max-w-sm">
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

					</CardContent>
					<CardContent className="flex flex-col justify-center w-full max-w-320">
						<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.2 } }}>
							<div className="items-center">
							
								<div>
									<Typography className="text-20 font-bold logo-text mb-20" color="inherit">
										LOGIN
									</Typography>
								</div>
							</div>
						</motion.div>

						<FirebaseLoginTab />
					</CardContent>

					<div className="flex flex-col items-center justify-center pb-32">
						<div>
							<span className="font-normal mr-8">Forgot password?</span>
							<Link className="font-normal" to="/reset_password">
								Reset password
							</Link>
						</div>
						{/* <Link className="font-normal mt-8" to="/">
							Back to Dashboard
						</Link> */}
					</div>
				</Card>

				{/* <div className={clsx(classes.rightSection, 'hidden md:flex flex-1 items-center justify-center p-64')}>
					<div className="max-w-320">
						<motion.div
							initial={{ opacity: 0, y: 40 }}
							animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
						>
							<Typography variant="h3" color="inherit" className="font-semibold leading-tight">
								Welcome <br />
								to the <br /> FUSE React!
							</Typography>
						</motion.div>

						<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.3 } }}>
							<Typography variant="subtitle1" color="inherit" className="mt-32">
								Powerful and professional admin template for Web Applications, CRM, CMS, Admin Panels
								and more.
							</Typography>
						</motion.div>
					</div>
				</div> */}
			</motion.div>
		</div>
	);
}

export default Login;
