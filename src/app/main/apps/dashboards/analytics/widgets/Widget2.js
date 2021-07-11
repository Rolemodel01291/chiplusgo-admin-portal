import Card from '@material-ui/core/Card';
import Icon from '@material-ui/core/Icon';
import { useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import _ from '@lodash';
import ReactApexChart from 'react-apexcharts';

function Widget2(props) {
	const theme = useTheme();
	const data = _.merge({}, props.data);

	_.setWith(data, 'options.colors', [theme.palette.primary.main]);

	return (
		<Card className="w-full rounded-20 shadow">
			<div className="p-20 pb-0">
				<Typography className="h3 font-medium">Conversion</Typography>

				<div className="flex flex-row flex-wrap items-center mt-12">
					<Typography className="text-48 font-semibold leading-none tracking-tighter">
						{data.conversion.value}
					</Typography>

					<div className="flex flex-col mx-8">
						{data.conversion.ofTarget > 0 && <Icon className="text-green text-20">trending_up</Icon>}
						{data.conversion.ofTarget < 0 && <Icon className="text-red text-20">trending_down</Icon>}
						<div className="flex items-center">
							<Typography className="font-semibold" color="textSecondary">
								{data.conversion.ofTarget}%
							</Typography>
							<Typography className="whitespace-nowrap mx-4" color="textSecondary">
								of target
							</Typography>
						</div>
					</div>
				</div>
			</div>
			<div className="h-96 w-100-p">
				<ReactApexChart
					options={data.options}
					series={data.series}
					type={data.options.chart.type}
					height={data.options.chart.height}
				/>
			</div>
		</Card>
	);
}

export default Widget2;
