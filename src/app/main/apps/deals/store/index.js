import { combineReducers } from '@reduxjs/toolkit';
import coupon from './couponSlice'

const reducer = combineReducers({
	coupon
});

export default reducer;
