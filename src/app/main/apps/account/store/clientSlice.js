import { createEntityAdapter, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import firebaseService from 'app/services/firebaseService';
import _ from 'lodash';
import moment from 'moment';

export const getClient = createAsyncThunk(
	'account/client/getClient',
	async id =>
		new Promise((resolve, reject) => {
			firebaseService.firestore
				.collection('Client')
				.get()
				.then(querySnapshot => {
					var tempData = [];
					querySnapshot.forEach(documentSnapshot => {
						tempData.push({ ...documentSnapshot.data(), id: documentSnapshot.id });
					});
					
					resolve(tempData);
				});
		})
);

export const updateBalance = createAsyncThunk(
	'account/business/updateBusiness',
	async (data, { dispatch, getState }) =>
		new Promise((resolve, reject) => {
			console.log(data.clientData.id);
			console.log(data.model);
			firebaseService.firestore
				.collection('Client')
				.doc(data.clientData.id)
				.update({
					CreditLine_balance:data.model.CreditLine_balance
				})
				.then(() => {
					resolve({ success: true });
				})
				.catch(e => {
					reject();
				});
		})
);

const clientAdapter = createEntityAdapter();

export const {
	selectAll: selectClient,
	selectEntities: selectClientEntities,
	selectById: selectClientById
} = clientAdapter.getSelectors(state => state.account.client);

const clientSlice = createSlice({
	name: 'account/client',
	initialState: clientAdapter.getInitialState({
		selectedClient:{},
		isClient:false,
		openDetail:false,
		loading:true
	}),
	reducers: {
		setClientData:(state, action)=>{
			state.selectedClient = action.payload
		},
		setClient:(state, action)=>{
			state.isClient = action.payload
		},
		setOpenDetail:(state, action)=>{
			state.openDetail = action.payload
		},
		setClientLoading:(state, action)=>{
			state.loading = action.payload
		}
	},
	extraReducers: {
		[getClient.fulfilled]: clientAdapter.setAll
	}
});

export const {setClientData, setClient, setOpenDetail, setClientLoading} = clientSlice.actions

export default clientSlice.reducer;
