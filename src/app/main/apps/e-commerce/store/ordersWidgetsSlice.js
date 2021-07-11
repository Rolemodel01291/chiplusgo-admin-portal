import { createEntityAdapter, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getOrdersWidgets = createAsyncThunk('eCommerceApp/ordersWidgets/getOrdersWidgets', async () => {
	const response = await axios.get('/api/project-dashboard-app/widgets');
	const data = await response.data;

	return data;
});

const widgetsAdapter = createEntityAdapter({});

export const { selectAll: selectOrdersWidgets, selectEntities: selectOrdersWidgetsEntities, selectById: selectWidgetById } = widgetsAdapter.getSelectors(
	state => state.eCommerceApp.ordersWidgets
);

const ordersWidgetsSlice = createSlice({
	name: 'eCommerceApp/ordersWidgets',
	initialState: widgetsAdapter.getInitialState(),
	reducers: {},
	extraReducers: {
		[getOrdersWidgets.fulfilled]: widgetsAdapter.setAll
	}
});

export default ordersWidgetsSlice.reducer;
