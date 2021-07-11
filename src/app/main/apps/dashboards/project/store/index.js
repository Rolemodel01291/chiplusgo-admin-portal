import { combineReducers } from '@reduxjs/toolkit';
import projects from './projectsSlice';
import widgets from './widgetsSlice';
import business from './businessSlice';

const reducer = combineReducers({
	widgets,
	projects,
	business
});

export default reducer;
