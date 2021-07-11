import { createEntityAdapter, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import firebaseService from 'app/services/firebaseService';
import _ from 'lodash';

export const getClient = createAsyncThunk(
	'fileManagerApp/client/getClient',
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
} = clientAdapter.getSelectors(state => state.fileManagerApp.client);

const clientSlice = createSlice({
	name: 'fileManagerApp/client',
	initialState: clientAdapter.getInitialState(),
	reducers: {},
	extraReducers: {
		[getClient.fulfilled]: clientAdapter.setAll,
	}
});

export default clientSlice.reducer;


