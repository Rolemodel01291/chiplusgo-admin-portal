import { grey, orange } from '@material-ui/core/colors';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import _ from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Controller, useFormContext } from 'react-hook-form';
import Compress from 'compress.js';
import firebaseService from 'app/services/firebaseService';

const useStyles = makeStyles(theme => ({
	productImageFeaturedStar: {
		position: 'absolute',
		top: 0,
		left: 0,
		color: orange[400],
		opacity: 0
	},
	productImageRemoveIcon: {
		position: 'absolute',
		top: 0,
		right: 0,
		color: grey[900],
		opacity: 1
	},
	productImageUpload: {
		transitionProperty: 'box-shadow',
		transitionDuration: theme.transitions.duration.short,
		transitionTimingFunction: theme.transitions.easing.easeInOut
	},
	productImageItem: {
		transitionProperty: 'box-shadow',
		transitionDuration: theme.transitions.duration.short,
		transitionTimingFunction: theme.transitions.easing.easeInOut,
		'&:hover': {
			'& $productImageFeaturedStar': {
				opacity: 0.8
			}
		},
		'&.featured': {
			pointerEvents: 'none',
			boxShadow: theme.shadows[3],
			'& $productImageFeaturedStar': {
				opacity: 1
			},
			'&:hover $productImageFeaturedStar': {
				opacity: 1
			}
		}
	}
}));

function UploadImage(props) {
	const classes = useStyles(props);
	const methods = useFormContext();
	const { control, watch } = methods;
	const [showTopAds, setShowTopAds] = useState(false);
	const container = {
		show: {
			transition: {
				staggerChildren: 0.1
			}
		}
	};

	const item = {
		hidden: { opacity: 0, y: 20 },
		show: { opacity: 1, y: 0 }
	};
	const images = watch('images',[]);

	const topAds = watch('Top_ads');

	const removeImage = (images, selectedImage) => {
		var tempImages = [...images]
		_.remove(tempImages, i => {
			return i === selectedImage;
		});
		props.setValue('images', tempImages);
	};

	useEffect(() => {
		setShowTopAds(topAds);
	}, [topAds]);

	function makeName(length) {
		var result = [];
		var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var charactersLength = characters.length;
		for (var i = 0; i < length; i++) {
			result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
		}
		return result.join('');
	}

	return (
		<motion.div className="flex flex-wrap w-full" variants={container} initial="hidden" animate="show">
			<motion.div variants={item} className="widget flex flex-col w-full sm:w-full md:w-full p-12">
				{showTopAds ? (
					<Typography className="h-1/12">Top Ads Image size: 500 * 300</Typography>
				) : (
					<Typography className="h-1/12">Bottom Ads Image size: 500 * 500</Typography>
				)}
				<div className="flex w-full min-h-512 border-1 rounded-2xl flex-wrap p-12 justify-between sm:justify-between">
					<Controller
						name="images"
						control={control}
						defaultValue={[]}
						render={({ field: { onChange, value } }) => (
							<label
								htmlFor="button-file"
								className={clsx(
									classes.productImageUpload,
									'flex flex-col items-center justify-center relative w-5/12 h-192 rounded-16 m-12  overflow-hidden cursor-pointer shadow hover:shadow-lg'
								)}
							>
								<input
									accept="image/*"
									className="hidden"
									id="button-file"
									type="file"
									onChange={async e => {
										function readFileAsync() {
											return new Promise((resolve, reject) => {
												const compress = new Compress();
												const files = [...e.target.files];
												console.log(files);
												compress
													.compress(
														files,
														showTopAds
															? {
																	size: 4,
																	quality: 1,
																	maxWidth: 500,
																	maxHeight: 300,
																	resize: true
															  }
															: {
																	size: 4,
																	quality: 1,
																	maxWidth: 500,
																	maxHeight: 500,
																	resize: true
															  }
													)
													.then(files => {
														const file = files[0];
														if (!file) {
															return;
														}
														resolve(`data:${file.ext};base64,${file.data}`);
													});
											});
										}

										const newImage = await readFileAsync();
										const fileName = makeName(15);
										firebaseService.storage
											.ref(`Coupons/${fileName}.png`)
											.putString(newImage, 'data_url')
											.then(async res => {
												const url = await firebaseService.storage
													.ref(`Coupons/${fileName}.png`)
													.getDownloadURL();
												onChange([url, ...value]);
											})
											.catch(e => {
												console.log(e);
											});

										
									}}
								/>

								<Icon fontSize="large" color="action">
									cloud_upload
								</Icon>
								{showTopAds ? <Typography>500*300</Typography> : <Typography>500*500</Typography>}
							</label>
						)}
					/>
					<Controller
						name="deletedImageId"
						control={control}
						defaultValue=""
						render={({ field: { onChange, value } }) =>
							images.map((media, index) => {
								return (
									<div
										role="button"
										tabIndex={0}
										className={clsx(
											classes.productImageItem,
											'flex items-center justify-center relative w-5/12 h-192 rounded-16 m-12 overflow-hidden cursor-pointer outline-none shadow hover:shadow-lg'
										)}
										key={index}
									>
										<Icon
											className={classes.productImageRemoveIcon}
											onClick={() => removeImage(images, media)}
										>
											delete
										</Icon>
										<img className="max-w-none w-auto h-full" src={media} alt="product" />
									</div>
								);
							})
						}
					/>
				</div>
			</motion.div>
		</motion.div>
	);
}

export default UploadImage;
