import { createEntityAdapter, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import firebaseService from 'app/services/firebaseService';
import _ from 'lodash';
import moment from 'moment';

export const getWithdraw = createAsyncThunk(
	'account/withdraw/getWithdraw',
	async id =>
		new Promise((resolve, reject) => {
			firebaseService.firestore
				.collection('Withdraw')
				.doc(id)
				.collection('Withdraw')
				.get()
				.then(querySnapshot => {
					const clientArrayPromise = querySnapshot.docs.map(documentSnapshot => {
						return firebaseService.firestore
							.collection('Business')
							.doc(documentSnapshot.data().BusinessId)
							.get()
							.then(businessSnap => {
								// if (clientSnap.exists) {
								var date = '';
								if (Object.keys(documentSnapshot.data()).includes('Created_time')) {
									var date1 = new Date(documentSnapshot.data().Created_time.toDate());
									date = moment(date1).format('MMMM Do YYYY, h:mm:ss a');
								}

								return {
									...documentSnapshot.data(),
									Create_date: date,
									businessData: businessSnap.data()
								};
								// }
							});
					});
					Promise.all(clientArrayPromise).then(data => {
						console.log(data);
						resolve(data);
					});
				});
		})
);

export const deleteWithdraw = createAsyncThunk(
	'account/withdraw/deleteWithdraw',
	async (data, { dispatch, getState }) =>
		new Promise((resolve, reject) => {
			firebaseService.firestore
				.collection('Withdraw')
				.doc(data.id)
				.collection('Withdraw')
				.doc(data.Activity_Number)
				.delete()
				.then(res => {
					resolve(res);
				});
		})
);

const withdrawAdapter = createEntityAdapter({
	selectId: item => item.id
});

export const {
	selectAll: selectWithdraw,
	selectEntities: selectWithdrawEntities,
	selectById: selectWithdrawById
} = withdrawAdapter.getSelectors(state => state.account.withdraw);

const withdrawSlice = createSlice({
	name: 'account/withdraw',
	initialState: withdrawAdapter.getInitialState({
		selectedWithdraw: {}
	}),
	reducers: {
		setWithdrawData: (store, action) => {
			store.selectedWithdraw = action.payload;
		}
	},
	extraReducers: {
		[getWithdraw.fulfilled]: withdrawAdapter.setAll
	}
});

export const { setWithdrawData } = withdrawSlice.actions;

export default withdrawSlice.reducer;
