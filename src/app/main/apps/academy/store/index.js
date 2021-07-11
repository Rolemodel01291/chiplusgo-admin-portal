import { combineReducers } from '@reduxjs/toolkit';
import course from './courseSlice';
import courses from './coursesSlice';
import categories from './categoriesSlice';
import transaction from './transactionSlice';
import transactionWidgets from './transactionWidgetsSlice';
import business from './businessSlice';
import client from './clientSlice';

const reducer = combineReducers({
	categories,
	courses,
	course,
	transaction,
	transactionWidgets,
	business,
	client
});

export default reducer;
