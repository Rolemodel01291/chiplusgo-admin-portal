import { Typography } from '@material-ui/core';
import React from 'react';

const ListHeader = () => {

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
				<div className="flex w-4/12 items-center pl-80">
					<Typography>Customer</Typography>
				</div>
				<div className="flex w-5/12 items-center">
					<Typography>Order ID</Typography>
				</div>
				{/* <div className="flex w-5/12 items-center">
					<Typography>Deal Name</Typography>
				</div> */}
				<div className="flex w-1/12 items-center">
					<Typography>Price</Typography>
				</div>
				<div className="flex w-1/12 items-center justify-center">
					
				</div>
			</div>
		</div>
	);
};

export default ListHeader;
