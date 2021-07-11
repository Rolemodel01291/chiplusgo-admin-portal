import { combineReducers } from '@reduxjs/toolkit';
import widgets from './widgetsSlice';
import dashboardWidgets from './dashboardWidgetsSlice';

const reducer = combineReducers({
	widgets,
	dashboardWidgets
});

export default reducer;
