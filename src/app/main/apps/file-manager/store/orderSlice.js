import { createEntityAdapter, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import firebaseService from 'app/services/firebaseService';
import _ from 'lodash';
import moment from 'moment';

export const getOrder = createAsyncThunk(
	'fileManagerApp/order/getOrder',
	async (data) =>
		new Promise((resolve, reject) => {
			
			var tempResolveDataArray = []
			const userDataArrayPromise = data.result.map(account => {			
				return firebaseService.firestore
					.collection('Orders')
					.doc('Orders')
					.collection(account.id)
					.where('Create_date', '>=', moment(data.endDate).subtract(data.time, 'days')._d)
					.where('Create_date', '>=', data.startDate)
					.where('Create_date', '<=', data.endDate)
					.get()
					.then(querySnapshot => {
						var tempResolveData = {};
						
						querySnapshot.forEach(snapData => {
							var date = '';
							if (Object.keys(snapData.data()).includes('Create_date')) {
								var date1 = new Date(snapData.data().Create_date.toDate());
								date = moment(date1).format('MMMM Do YYYY, h:mm:ss a');
							}
							tempResolveData = { ...snapData.data(), clientData: account, Date: date1, Create_date: date, id:snapData.id };
							tempResolveDataArray.push(tempResolveData);

						});
						return []
					});
					
			});

			Promise.all(userDataArrayPromise).then(data => {				
				// const returnData = data.filter(item => !_.isEmpty(item)&&item);
				resolve(tempResolveDataArray);
			});
			
		})
);


const orderAdapter = createEntityAdapter();

export const {
	selectAll: selectOrder,
	selectEntities: selectOrderEntities,
	selectById: selectOrderById
} = orderAdapter.getSelectors(state => state.fileManagerApp.order);

const orderSlice = createSlice({
	name: 'fileManagerApp/order',
	initialState: orderAdapter.getInitialState({
		selectedOrder: {},
	}),
	reducers: {
		setOrder: (state, action) => {
			state.selectedOrder = action.payload;
		}	
	},
	extraReducers: {
		[getOrder.fulfilled]: orderAdapter.setAll
	}
});

export const { setOrder } = orderSlice.actions;

export default orderSlice.reducer;
