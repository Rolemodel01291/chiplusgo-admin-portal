import { createEntityAdapter, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import firebaseService from 'app/services/firebaseService';

export const getBusiness = createAsyncThunk(
	'projectDashboardApp/business/getBusiness',
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

// export const updateBusiness = (id, rate) => {
//     firebaseService.firestore
//         .collection('Business')
//         .doc(id)
//         .update({
//             CashPointRate: rate
//         })		
// }  

export const updateBusiness = createAsyncThunk(
	'projectDashboardApp/business/updateBusiness',
	async (data, { dispatch, getState }) =>
		new Promise((resolve, reject) => {
			console.log(data.selectedBusinessId);
            firebaseService.firestore
				.collection('Business')
				.doc(data.selectedBusinessId)
				.update({
					CashPointRate: parseFloat(data.data_model.point2Cash).toFixed(2)
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
} = businessAdapter.getSelectors(state => state.projectDashboardApp.business);

const businessSlice = createSlice({

	name: 'projectDashboardApp/business',
	initialState: businessAdapter.getInitialState({
		selectedBusinessId: '',
        point2Cash: 0
	}),
	reducers: {	
        setSelectedBusinessId: (state, action) => {
			state.selectedBusinessId = action.payload;  
        },
        setPoint2Cash: (state, action) => {
            console.log("-------------------------", action.payload);
            state.point2Cash = action.payload;
        }

	},
	extraReducers: {
		[getBusiness.fulfilled]: businessAdapter.setAll
	}
});



export const { setSelectedBusinessId, setPoint2Cash } = businessSlice.actions;

export default businessSlice.reducer;
