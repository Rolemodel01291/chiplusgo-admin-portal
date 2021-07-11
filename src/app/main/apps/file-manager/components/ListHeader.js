import { Typography } from '@material-ui/core';
import React from 'react';

const ListHeader = () => {

	return (
		<div className="w-full my-12 flex  align-center">
			<div className="flex w-64 items-center justify-center ml-12">
				<Typography className="">No</Typography>
			</div>
			{/* <div className="flex items-center absolute left-76 bottom-0 top-0">
				<Avatar
					className={clsx(classes.avatar, 'avatar w-40 h-40 box-content')}
					alt="user photo"
					src={data.clientData.Avatar}
				/>
			</div> */}
			
				<div className="flex items-center pl-80">
					<Typography>Name</Typography>
				</div>
				<div className="flex items-center justify-center">
					<Typography>Genre</Typography>
				</div>
				<div className="flex items-center justify-center">
					<Typography>Blockchain</Typography>
				</div>
				<div className="flex items-center justify-center">
					<Typography>Device</Typography>
				</div>
				<div className="flex items-center justify-center">
					<Typography>Status</Typography>
				</div>
				<div className="flex items-center justify-center">
					<Typography>NFT</Typography>
				</div>
				<div className="flex items-center justify-center">
					<Typography>F2P</Typography>
				</div>
				<div className="flex items-center justify-center">
					<Typography>P2E</Typography>
				</div>
				<div className="flex items-center justify-center">
					<Typography>P2E Score</Typography>
				</div>
				<div className="flex items-center justify-center">
					<Typography>Social 24h</Typography>
				</div>
				<div className="flex w-128 items-center justify-center">
					<Typography>Social 7d</Typography>
				</div>
			
		</div>
	);
};

export default ListHeader;
