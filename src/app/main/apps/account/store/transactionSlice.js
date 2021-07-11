import { createEntityAdapter, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import firebaseService from 'app/services/firebaseService';
import _ from 'lodash';
import moment from 'moment';
import { resolve } from 'promise';

export const getTransaction = createAsyncThunk(
	'account/transaction/getTransaction',
	async id =>
		new Promise((resolve, reject) => {
			firebaseService.firestore
				.collection('TranscationHistory')
				.doc(id)
				.collection('TransactionHistory')
				.orderBy('Create_date', 'desc')
				.get()
				.then(querySnapshot => {
					var tempData = [];
					querySnapshot.forEach(documentSnapshot => {
						var date = '';
						if (Object.keys(documentSnapshot.data()).includes('Create_date')) {
							var date1 = new Date(documentSnapshot.data().Create_date.toDate());
							date = moment(date1).format('MMMM Do YYYY, h:mm:ss a');
						}

						tempData.push({
							...documentSnapshot.data(),
							Create_date: date
						});
					});
					resolve(tempData);
				});
		})
);

export const addTransaction = createAsyncThunk(
	'account/transaction/addTransaction',
	async (data, { dispatch, getState }) =>
		new Promise((resolve, reject) => {
			firebaseService.firestore
			.collection('TranscationHistory')
			.doc(data.id)
			.collection('TransactionHistory')
			.add({
				BusinessId: data.item.BusinessId,
				CiientId: data.item.id,
				RealAmount: data.item.RealAmount,
				Subtotal: data.item.Subtotal,
				Activity_Number: data.Activity_Number,
				Type: data.item.Type,
				Title: 'Withdraw',
				Business_name: data.item.businessData.Business_name.English,
				Notes: data.note,
				Create_date:  moment().format('MMMM Do YYYY, h:mm:ss a'),
			})
			.then((res) => {
				console.log('Transaction added!');
				resolve(res);	
			});
			
		})
	
);

const transactionAdapter = createEntityAdapter({
	selectId: item => item.Id
});

export const {
	selectAll: selectTransaction,
	selectEntities: selectTransactionEntities,
	selectById: selectTransactionById
} = transactionAdapter.getSelectors(state => state.account.transaction);

const transactionSlice = createSlice({
	name: 'account/transaction',
	initialState: transactionAdapter.getInitialState({
		selectedTransaction: {}
	}),
	reducers: {
		setTransactionData: (store, action) => {
			store.selectedTransaction = action.payload;
		}
	},
	extraReducers: {
		[getTransaction.fulfilled]: transactionAdapter.setAll
	}
});

export const { setTransactionData } = transactionSlice.actions;

export default transactionSlice.reducer;
