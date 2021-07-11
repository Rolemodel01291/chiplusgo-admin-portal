import { createEntityAdapter, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import firebaseService from 'app/services/firebaseService';
import _ from 'lodash';

export const getBusiness = createAsyncThunk(
	'fileManagerApp/business/getBusiness',
	async () =>
		new Promise((resolve, reject) => {
			firebaseService.firestore
				.collection('Business')
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

export const updateClient = createAsyncThunk(
	'fileManagerApp/business/updateClient',
	async (data, { dispatch, getState }) =>
		new Promise((resolve, reject) => {
			var subAccount = [...data.businessData.Sub_account];

			const newSubAccount = subAccount.map(item => {
				if (item.Email === data.model.Email) {
					return { ...item, Nick_name: data.model.Nick_name };
				}
				return { ...item };
			});

			firebaseService.firestore
				.collection('Business')
				.doc(data.model.BusinessId)
				.update({
					Sub_account: [...newSubAccount]
				})
				.then(() => {
					firebaseService.firestore
						.collection('Business')
						.doc(data.model.SubaccountId)
						.update({
							Nick_name: data.model.Nick_name
						})
						.then(() => {
							resolve({ success: true });
						})
						.catch(e => {
							reject();
						});
				})
				.catch(e => {
					reject();
				});
		})
);

export const updateBusiness = createAsyncThunk(
	'fileManagerApp/business/updateBusiness',
	async (data, { dispatch, getState }) =>
		new Promise((resolve, reject) => {
			console.log(data.businessData.id);
			console.log(data.model);
			firebaseService.firestore
				.collection('Business')
				.doc(data.model.BusinessId)
				.update({
					Business_name: {
						English: data.model.Business_name,
						Chinese: data.model.Business_name_cn
					}
				})
				.then(() => {
					resolve({ success: true });
				})
				.catch(e => {
					reject();
				});
		})
);

const businessAdapter = createEntityAdapter({});

export const {
	selectAll: selectBusiness,
	selectEntities: selectBusinessEntities,
	selectById: selectBusinessById
} = businessAdapter.getSelectors(state => state.fileManagerApp.business);

const businessSlice = createSlice({
	name: 'fileManagerApp/business',
	initialState: businessAdapter.getInitialState(),
	reducers: {},
	extraReducers: {
		[getBusiness.fulfilled]: businessAdapter.setAll,
		[updateClient.fulfilled]: businessAdapter.addOne
	}
});

export default businessSlice.reducer;
