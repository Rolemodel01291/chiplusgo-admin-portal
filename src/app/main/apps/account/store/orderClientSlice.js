import { createEntityAdapter, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import firebaseService from 'app/services/firebaseService';
import _ from 'lodash';
import moment from 'moment';

export const getClientOrder = createAsyncThunk(
	'account/clientOrder/getClientOrder',
	async id =>
		new Promise((resolve, reject) => {
			firebaseService.firestore
				.collection('Orders')
				.doc('Orders')
				.collection(id)
				.orderBy('Created_time', 'desc')
				.get()
				.then(querySnapshot => {
					const clientArrayPromise = querySnapshot.docs.map(documentSnapshot => {
						console.log(documentSnapshot.data())
						return firebaseService.firestore
							.collection('Client')
							.doc(documentSnapshot.data().ClientId)
							.get()
							.then(clientSnap => {
								// if (clientSnap.exists) {
									var date = '';
									if (Object.keys(documentSnapshot.data()).includes('Created_time')) {
										var date1 = new Date(documentSnapshot.data().Created_time.toDate());
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
	selectId: item => item.CouponTicketId
});

export const {
	selectAll: selectClientOrder,
	selectEntities: selectClientOrderEntities,
	selectById: selectClientOrderById
} = orderAdapter.getSelectors(state => state.account.clientOrder);

const clientOrderSlice = createSlice({
	name: 'account/clientOrder',
	initialState: orderAdapter.getInitialState(),
	reducers: {
	
	},
	extraReducers: {
		[getClientOrder.fulfilled]: orderAdapter.setAll
	}
});


export default clientOrderSlice.reducer;
