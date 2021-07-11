import { createEntityAdapter, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import firebaseService from 'app/services/firebaseService';
import _ from 'lodash';

export const getClient = createAsyncThunk(
	'academyApp/client/getClient',
	async () =>
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

const clientAdapter = createEntityAdapter({});

export const {
	selectAll: selectClient,
	selectEntities: selectClientEntities,
	selectById: selectClientById
} = clientAdapter.getSelectors(state => state.academyApp.client);

const clientSlice = createSlice({
	name: 'academyApp/client',
	initialState: clientAdapter.getInitialState({
		selectedClient:{},
		isClient:false
	}),
	reducers: {
		setClientData:(state, action)=>{
			state.selectedClient = action.payload
		},
		setClient:(state, action)=>{
			state.isClient = action.payload
		}
	},
	extraReducers: {
		[getClient.fulfilled]: clientAdapter.setAll
	}
});

export default clientSlice.reducer;


