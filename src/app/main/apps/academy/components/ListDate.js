import React from 'react';
import Typography from '@material-ui/core/Typography';

const ListDate = ({ date }) => {
	return <Typography className="text-base p-12">{date&&date.split(',')[0]}</Typography>;
};

export default ListDate;
