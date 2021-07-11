import { createEntityAdapter, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getTransactionWidgets = createAsyncThunk('academyApp/transactionWidgets/getTransactionWidgets', async () => {
	const response = await axios.get('/api/project-dashboard-app/widgets');

	const data = await response.data;

	return data;
});

const widgetsAdapter = createEntityAdapter({});

export const { selectEntities: selectTransactionWidgets, selectById: selectWidgetById } = widgetsAdapter.getSelectors(
	state => state.academyApp.transactionWidgets
);

const transactionWidgetsSlice = createSlice({
	name: 'academyApp/transactionWidgets',
	initialState: widgetsAdapter.getInitialState({
		isSubaccount: false,
		isBusinessaccount: false,
		subaccountData: {},
		businessData: {}
	}),
	reducers: {
		setAccountState: (state, action) => {
			state.isSubaccount = action.payload.isSubaccount;
			state.isBusinessaccount = action.payload.isBusinessaccount;
		},
		
		setSubaccountData: (state, action) => {
			state.subaccountData = action.payload;
		},
		setBusinessData: (state, action) => {
			state.businessData = action.payload;
		}
	},
	extraReducers: {
		[getTransactionWidgets.fulfilled]: widgetsAdapter.setAll
	}
});

export const { setSubaccountData, setBusinessData, setAccountState } =
	transactionWidgetsSlice.actions;

export default transactionWidgetsSlice.reducer;
