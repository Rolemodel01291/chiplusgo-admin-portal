import { combineReducers } from '@reduxjs/toolkit';
import files from './filesSlice';
import order from './orderSlice';
import orderWidgets from './orderWidgetsSlice';
import business from './businessSlice';
import client from './clientSlice';

const reducer = combineReducers({
	files,
	orderWidgets,
	order,
	business,
	client
});

export default reducer;
