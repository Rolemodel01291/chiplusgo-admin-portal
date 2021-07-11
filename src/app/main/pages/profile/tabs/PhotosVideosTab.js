import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import ListSubheader from '@material-ui/core/ListSubheader';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

function PhotosVideosTab() {
	const [data, setData] = useState(null);

	useEffect(() => {
		axios.get('/api/profile/photos-videos').then(res => {
			setData(res.data);
		});
	}, []);

	if (!data) {
		return null;
	}

	const container = {
		show: {
			transition: {
				staggerChildren: 0.05
			}
		}
	};

	const item = {
		hidden: { opacity: 0, y: 40 },
		show: { opacity: 1, y: 0 }
	};

	return (
		<motion.div variants={container} initial="hidden" animate="show">
			<div className="md:flex max-w-2xl">
				<div className="flex flex-col flex-1 md:ltr:pr-32 md:rtl:pl-32">
					{data.map(period => (
						<div key={period.id} className="mb-48">
							<ListSubheader
								component={motion.div}
								variants={item}
								className="flex items-center px-0 mb-24"
							>
								<Typography variant="h6" className="font-medium">
									{period.name}
								</Typography>
								<Typography className="mx-12 font-normal" variant="subtitle1" color="textSecondary">
									{period.info}
								</Typography>
							</ListSubheader>

							<GridList className="overflow-hidden" spacing={16} cols={0}>
								{period.media.map(media => (
									<GridListTile
										component={motion.div}
										variants={item}
										classes={{
											root: 'w-full sm:w-1/2 md:w-1/4',
											tile: 'rounded-16 shadow'
										}}
										key={media.preview}
									>
										<img src={media.preview} alt={media.title} />
										<GridListTileBar
											title={media.title}
											actionIcon={
												<IconButton>
													<Icon className="text-white opacity-75">info</Icon>
												</IconButton>
											}
										/>
									</GridListTile>
								))}
							</GridList>
						</div>
					))}
				</div>
			</div>
		</motion.div>
	);
}

export default PhotosVideosTab;
