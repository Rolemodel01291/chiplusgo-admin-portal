import FusePageSimple from '@fuse/core/FusePageSimple';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import withReducer from 'app/store/withReducer';
import _ from '@lodash';
import Button from '@material-ui/core/Button';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import formatISO from 'date-fns/formatISO';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, FormProvider } from 'react-hook-form';
import reducer from './store';
import DealEngForm from './DealEngForm';
import DealChiForm from './DealChiForm';
import UploadImage from './UploadImage';
import { SnackbarProvider, useSnackbar } from 'notistack';
import { useParams, useHistory } from 'react-router-dom';
import { addCoupon, updateCoupon } from './store/couponSlice';

const useStyles = makeStyles(theme => ({
	content: {
		'& canvas': {
			maxHeight: '100%',
			backgroundColor: '#FFF'
		}
	},
	btnSpace: {
		width: '100%',
		display: 'flex',
		'& > *': {
			margin: theme.spacing(1)
		}
	}
}));

const schema = yup.object().shape({
	BusinessId: yup.array().required('Please enter Business ID.'),
	Title: yup.string().required('Please enter Title.'),
	Title_cn: yup.string().required('Please enter Chinese Title.'),
	Items: yup.array().min(1, 'Please enter item.'),
	Items_cn: yup.array().min(1, 'Please enter Chinese item.'),
	Description: yup.string().required('Please add Description.'),
	Description_cn: yup.string().required('Please add Chinese Description.'),
	OriginalPrice: yup.number(),
	Price: yup.number().required('Please enter price.').test({
		name: 'max',
		exclusive: true,
		message: '${path} must be less than OriginalPrice',
		test: function (value) {
			if (this.parent.OriginalPrice != ''){
				
				// You can access the price field with `this.parent`.
				return value <= parseFloat(this.parent.OriginalPrice)
			}
		},
	}),
	Tax: yup.string().required('Please enter tax.'),
	available_hours: yup.string().matches(/([01][0-9]|2[0-3]):[0-5][0-9]-([01][0-9]|2[0-3]):[0-5][0-9]/g, {
		message: 'Please enter available hours.',
		excludeEmptyString: true
	}),
	images: yup.array().min(1, 'Please pick image.')
});

function CalendarApp(props) {
	const dispatch = useDispatch();
	const history = useHistory();
	const routeParams = useParams();
	const adminData = useSelector(({ auth }) => auth.user);
	const selectedCoupon = useSelector(({ deals }) => deals.coupon.selectedCoupon);

	const classes = useStyles(props);
	const { enqueueSnackbar } = useSnackbar();

	const [state, setState] = useState({
		defaultValues: {
			start: formatISO(new Date()),
			end: formatISO(new Date()),
			available_hours: '00:00 - 23:59',
			Top_ads: false,
			Title: '',
			Title_cn: '',
			BusinessId: [],
			OriginalPrice: '',
			Description: '',
			Description_cn: '',
			Items: [],
			Items_cn: []
		}
	});

	const methods = useForm({
		mode: 'onChange',
		defaultValues: state.defaultValues,
		resolver: yupResolver(schema)
	});

	const { formState, setValue, getValues } = methods;

	useEffect(() => {
		if (!_.isEmpty(selectedCoupon) && routeParams.id === 'edit') {
			console.log(selectedCoupon);
			console.log(selectedCoupon.Validatity.Start_date.toDate())
			var EngItems = selectedCoupon.Item.map(item => item.Item);
			var ChiItems = selectedCoupon.Item.map(item => item.Item_cn);
			console.log(EngItems);
			setValue('BusinessId', selectedCoupon.BusinessId[0] === adminData.uid ? [] : selectedCoupon.BusinessId);
			setValue('Title', selectedCoupon.Title);
			setValue('Title_cn', selectedCoupon.Title_cn);
			setValue('Items', EngItems);
			setValue('Items_cn', ChiItems);
			setValue('OriginalPrice', selectedCoupon.Original_price);
			setValue('Price', selectedCoupon.Price);
			setValue('Description_cn', selectedCoupon.Description_cn);
			setValue('Description', selectedCoupon.Description);
			setValue('Top_ads', selectedCoupon.Top_ads);
			setValue('Tax', selectedCoupon.Tax);
			setValue('available_hours', selectedCoupon.Rules.Available_hours);
			setValue('start', selectedCoupon.Validatity.Start_date.toDate());
			setValue('end', selectedCoupon.Validatity.End_date.toDate());
			setValue('images', selectedCoupon.Image);
		}
		
	}, [selectedCoupon]);

	

	const { dirtyFields, isValid } = formState;
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

	function handleSaveProduct() {
		dispatch(addCoupon({ ...getValues(), adminData })).then(res => {
			enqueueSnackbar('Added Deal successfully!', { variant: 'success', autoHideDuration: 2000 });
			history.goBack();
		});
	}

	function handleUpdateProduct() {
		dispatch(updateCoupon({ ...getValues(), adminData, id: selectedCoupon.id })).then(res => {
			enqueueSnackbar('Updated Deal successfully!', { variant: 'success', autoHideDuration: 2000 });
			history.goBack();
		});
	}

	return (
		<SnackbarProvider maxSnack={1}>
			<FormProvider {...methods}>
				<FusePageSimple
					classes={{
						header: 'min-h-0 h-0 lg:ltr:rounded-br-20 lg:rtl:rounded-bl-20 lg:ltr:mr-12 lg:rtl:ml-12',
						rightSidebar: 'w-288 border-0 py-12',
						content: classes.content
					}}
					content={
						<div className="p-12 lg:ltr:pr-0 lg:rtl:pl-0 w-full">
							<div>
								<Typography color="primary" className="p-24 text-lg font-bold">
									Add New Deal
								</Typography>
							</div>
							<motion.div
								className="flex flex-wrap w-full px-12"
								variants={container}
								initial="hidden"
								animate="show"
							>
								<motion.div variants={item} className="widget flex w-full sm:w-full md:w-1/3 p-12">
									<DealEngForm />
								</motion.div>
								<motion.div variants={item} className="widget flex w-full sm:w-full md:w-1/3 p-12">
									<DealChiForm />
								</motion.div>
								<motion.div variants={item} className="widget flex w-full sm:w-full md:w-1/3 p-12">
									<UploadImage setValue={setValue} />
								</motion.div>
								<motion.div variants={item} className="widget flex w-full sm:w-full md:w-full p-12">
									{routeParams.id === 'edit' ? (
										<div className="flex w-full">
											<Button
												variant="contained"
												color="primary"
												className="w-1/3 mx-16 mt-16"
												aria-label="save/change"
												disabled={_.isEmpty(dirtyFields) || !isValid}
												value="firebase"
												onClick={handleUpdateProduct}
											>
												Update
											</Button>
											<Button
												variant="contained"
												color="primary"
												className="w-1/3 mx-16 mt-16"
												aria-label="save/change"
												value="firebase"
												onClick={() => history.goBack()}
											>
												Cancel
											</Button>
										</div>
									) : (
										<div className="flex w-full">
											<Button
												variant="contained"
												color="primary"
												className="w-1/3 mx-16 mt-16"
												aria-label="save/change"
												disabled={_.isEmpty(dirtyFields) || !isValid}
												value="firebase"
												onClick={handleSaveProduct}
											>
												Save
											</Button>
											<Button
												variant="contained"
												color="primary"
												className="w-1/3 mx-16 mt-16"
												aria-label="save/change"
												value="firebase"
												onClick={() => history.goBack()}
											>
												Cancel
											</Button>
										</div>
									)}
								</motion.div>
							</motion.div>
						</div>
					}
				/>
			</FormProvider>
		</SnackbarProvider>
	);
}

export default withReducer('deals', reducer)(CalendarApp);
