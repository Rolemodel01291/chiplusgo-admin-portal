import { createEntityAdapter, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getAccountWidgets = createAsyncThunk('account/accountWidgets/getWidgets', async () => {
	const response = await axios.get('/api/project-dashboard-app/widgets');
	const data = await response.data;

	return data;
});

const widgetsAdapter = createEntityAdapter({});

export const { selectEntities: selectAccountWidgets, selectById: selectWidgetById } = widgetsAdapter.getSelectors(
	state => state.account.accountWidgets
);

const accountWidgetsSlice = createSlice({
	name: 'account/accountWidgets',
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
		[getAccountWidgets.fulfilled]: widgetsAdapter.setAll
	}
});

export const { setSubaccountData, setBusinessData, setAccountState } =
	accountWidgetsSlice.actions;

export default accountWidgetsSlice.reducer;
