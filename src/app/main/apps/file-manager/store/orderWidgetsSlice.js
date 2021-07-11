import { createEntityAdapter, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getOrderWidgets = createAsyncThunk('fileManagerApp/orderWidgets/getOrderWidgets', async () => {
	const response = await axios.get('/api/project-dashboard-app/widgets');

	const data = await response.data;

	return data;
});

const widgetsAdapter = createEntityAdapter({});

export const { selectEntities: selectOrderWidgets, selectById: selectWidgetById } = widgetsAdapter.getSelectors(
	state => state.fileManagerApp.orderWidgets
);

const orderWidgetsSlice = createSlice({
	name: 'fileManagerApp/orderWidgets',
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
		[getOrderWidgets.fulfilled]: widgetsAdapter.setAll
	}
});

export const { setSubaccountData, setBusinessData, setAccountState } =
	orderWidgetsSlice.actions;

export default orderWidgetsSlice.reducer;
