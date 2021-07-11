import { createEntityAdapter, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import firebaseService from 'app/services/firebaseService';
import _, { result } from 'lodash';
import moment from 'moment';

export const getTransaction = createAsyncThunk(
	'academyApp/transaction/getTransaction',
	async data =>
		new Promise((resolve, reject) => {
			var tempResolveDataArray = [];
			
			const userDataArrayPromise = data.result.map(account => {
				var str = firebaseService.firestore
					.collection('TranscationHistory')
					.doc(account.id)
					.collection('TransactionHistory');
					if(data.type != "typeAll") {	
						console.log("-----------------", data.type);
						str.where('Type', '==', data.type);
					}
					return str.where('Create_date', '>=', moment(data.endDate).subtract(data.time, 'days')._d)
					.where('Create_date', '>=', data.startDate)
					.where('Create_date', '<=', data.endDate)
					.get()
					.then(querySnapshot => {
						var tempData = [];
						querySnapshot.forEach(documentSnapshot => {
							var date = moment().format('MMMM Do YYYY, h:mm:ss a');
							if (Object.keys(documentSnapshot.data()).includes('Create_date')) {
								var date1 = new Date(documentSnapshot.data().Create_date.toDate());
								date = moment(date1).format('MMMM Do YYYY, h:mm:ss a');
							}

							

							tempData = {
								...documentSnapshot.data(),
								Create_date: date,
								Date: date1,
								clientData: account,
								id: documentSnapshot.data().OrderId
							}

							tempResolveDataArray.push(tempData);
						});

						return [];
					});
			});
			

			Promise.all(userDataArrayPromise).then(data => {
				console.log("----------", tempResolveDataArray )
				resolve(tempResolveDataArray);
			});
		})
);

const transactionAdapter = createEntityAdapter({
	selectId: item => item.Id
})

export const {
	selectAll: selectTransaction,
	selectEntities: selectTransactionEntities,
	selectById: selectTransactionById
} = transactionAdapter.getSelectors(state => state.academyApp.transaction);

const transactionSlice = createSlice({
	name: 'academyApp/transaction',
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
