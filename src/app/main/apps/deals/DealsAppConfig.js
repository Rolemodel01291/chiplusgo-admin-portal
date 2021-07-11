import { lazy } from 'react';
import { Redirect } from 'react-router-dom';

const CalendarAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/apps/deals/list',
			component: lazy(() => import('./DealList'))
		},
		{
			path: '/apps/deals/:id',
			component: lazy(() => import('./DealsApp'))
			
		},
		{
			path: '/apps/deals',
			component: () => <Redirect to="/apps/deals/list" />
		}
	]
};

export default CalendarAppConfig;