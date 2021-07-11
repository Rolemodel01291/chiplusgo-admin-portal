import { lazy } from 'react';

const CalendarAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/apps/account',
			component: lazy(() => import('./AccountApp'))
		}
	]
};

export default CalendarAppConfig;