import { combineReducers } from '@reduxjs/toolkit';
import business from './businessSlice';
import order from './orderSlice'
import transaction from './transactionSlice'
import clientOrder from './orderClientSlice'
import client from './clientSlice'
import accountWidgets from './accountWidgetsSlice';
import withdraw from './withdrawSlice';

const reducer = combineReducers({
	accountWidgets,
	business,
	order,
	client,
	clientOrder,
	transaction,
	withdraw
});

export default reducer;
