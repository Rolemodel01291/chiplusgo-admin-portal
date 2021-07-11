import { createEntityAdapter, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import firebaseService from 'app/services/firebaseService';
import _ from 'lodash';
import moment from 'moment';

export const getOrder = createAsyncThunk(
	'account/order/getOrder',
	async id =>
		new Promise((resolve, reject) => {
			firebaseService.firestore
				.collection('Orders')
				.doc('Orders')
				.collection(id)
				.orderBy('Create_date', 'desc')
				.get()
				.then(querySnapshot => {
					const clientArrayPromise = querySnapshot.docs.map(documentSnapshot => {
						return firebaseService.firestore
							.collection('Client')
							.doc(documentSnapshot.data().ClientId)
							.get()
							.then(clientSnap => {
								// if (clientSnap.exists) {
									var date = '';
									if (Object.keys(documentSnapshot.data()).includes('Create_date')) {
										var date1 = new Date(documentSnapshot.data().Create_date.toDate());
										date = moment(date1).format('MMMM Do YYYY, h:mm:ss a');
									}

									return {
										
										...documentSnapshot.data(),
										Create_date: date,
										clientData: clientSnap.data()
									};
								// }
							});
					});
					Promise.all(clientArrayPromise).then(data => {
						console.log(data)
						resolve(data)
					});
				});
		})
);

const orderAdapter = createEntityAdapter({
	selectId: item => item.OrderId
});

export const {
	selectAll: selectOrder,
	selectEntities: selectOrderEntities,
	selectById: selectOrderById
} = orderAdapter.getSelectors(state => state.account.order);

const orderSlice = createSlice({
	name: 'account/order',
	initialState: orderAdapter.getInitialState({
		selectedOrder:{}
	}),
	reducers: {
		setOrder:(state, action)=>{
			state.selectedOrder = action.payload
		}
	},
	extraReducers: {
		[getOrder.fulfilled]: orderAdapter.setAll
	}
});

export const {setOrder} = orderSlice.actions

export default orderSlice.reducer;
