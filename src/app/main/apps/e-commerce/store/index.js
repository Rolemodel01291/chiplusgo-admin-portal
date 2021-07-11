import { combineReducers } from '@reduxjs/toolkit';
import order from './orderSlice';
import orders from './ordersSlice';
import product from './productSlice';
import products from './productsSlice';
//import ordersWidgets from './ordersWidgetsSlice'

const reducer = combineReducers({
	products,
	product,
	orders,
	order,
//	ordersWidgets
});

export default reducer;
