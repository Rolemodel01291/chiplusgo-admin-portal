import { lazy } from 'react';

const FileManagerAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/apps/fileManagerApp',
			component: lazy(() => import('./FileManagerApp'))
		}
	]
};

export default FileManagerAppConfig;
