import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { memo } from 'react';

function Widget4(props) {
	return (
		<Paper className="w-full rounded-20 shadow flex flex-col justify-between">
			<div className="flex items-center justify-between px-4 pt-8">
				<Typography className="text-16 px-16 font-medium text-blue">
					{props.widget.title}
				</Typography>
				
			</div>
			<div className="text-center p-20">
				<Typography className="text-72 font-semibold leading-none text-blue tracking-tighter">
					{props.widget.data.count}
				</Typography>
			</div>
			
		</Paper>
	);
}

export default memo(Widget4);
