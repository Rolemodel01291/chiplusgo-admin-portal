import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { selectWidgets } from '../store/widgetsSlice';
import Widget1 from '../widgets/Widget1';
import Widget2 from '../widgets/Widget2';
import Widget3 from '../widgets/Widget3';
import Widget4 from '../widgets/Widget4';
import Widget5 from '../widgets/Widget5';
import Widget6 from '../widgets/Widget6';
import Widget7 from '../widgets/Widget7';
import { selectBusinessById } from '../store/businessSlice';

function HomeTab() {
	const selectedBusinessId = useSelector(
		({ projectDashboardApp }) => projectDashboardApp.business.selectedBusinessId
	);

	const selectedBusiness = useSelector(store => selectBusinessById(store, selectedBusinessId));
	const point2Cash = useSelector(({ projectDashboardApp }) => projectDashboardApp.business.point2Cash);
	const [cash, setCash] = useState(0);

	useEffect(() => {
		if (selectedBusiness) {
			setCash(selectedBusiness.CashPointRate);
		}
	}, [selectedBusinessId]);

	useEffect(() => {
		if (selectedBusiness && point2Cash > 0) {
			setCash(point2Cash);
		}
	}, [point2Cash]);

	const widgets = useSelector(selectWidgets);

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

	return (
		<motion.div className="flex flex-wrap" variants={container} initial="hidden" animate="show">
			
			<motion.div variants={item} className="widget flex w-full sm:w-1/3 md:w-1/3 p-12">
				<Widget2
					widget={{
						...widgets.widget2,
						data: {
							...widgets.widget3.data,
							count: parseFloat(cash).toFixed(2),
							name: 'Point to Cash'
						},
						title: 'Today'
					}}
				/>
			</motion.div>
			<motion.div variants={item} className="widget flex w-full sm:w-1/3 md:w-1/3 p-12">
				<Widget2
					widget={{
						...widgets.widget2,
						data: {
							...widgets.widget3.data,
							count:parseFloat(cash).toFixed(2),
							name: 'Point to Cash'
						},
						title: 'Yesterday'
					}}
				/>
			</motion.div>
			<motion.div variants={item} className="widget flex w-full sm:w-1/3 md:w-1/3 p-12">
				<Widget2
					widget={{
						...widgets.widget2,
						data: {
							...widgets.widget3.data,
							count: parseFloat(cash).toFixed(2),
							name: 'Point to Cash'
						},
						title: 'The day before yesterday'
					}}
				/>
			</motion.div>
		</motion.div>
	);
}

export default HomeTab;
