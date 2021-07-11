import { Typography } from '@material-ui/core';
import React from 'react';

const WithdrawListHeader = () => {

	return (
		<div className="w-full my-12 flex relative align-center">
			<div className="flex w-1/12 items-center justify-center">
				<Typography className="">No</Typography>
			</div>
			{/* <div className="flex items-center absolute left-76 bottom-0 top-0">
				<Avatar
					className={clsx(classes.avatar, 'avatar w-40 h-40 box-content')}
					alt="user photo"
					src={data.clientData.Avatar}
				/>
			</div> */}
			<div className="flex w-11/12 items-center relative py-7 absolute left-86">
				<div className="flex w-6/12 items-center pl-80">
					<Typography>Withdraw ID</Typography>
				</div>
				<div className="flex w-3/12 items-center">
					<Typography>Subtotal</Typography>
				</div>
				<div className="flex w-2/12 items-center">
					<Typography>Date</Typography>
				</div>
			</div>
		</div>
	);
};

export default WithdrawListHeader;
