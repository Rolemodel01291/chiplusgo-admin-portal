import { createEntityAdapter, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getDashboardWidgets = createAsyncThunk('analyticsDashboardApp/dashboardWidgets/getWidgets', async () => {
	const response = await axios.get('/api/project-dashboard-app/widgets');
	const data = await response.data;

	return data;
});

const widgetsAdapter = createEntityAdapter({});

export const { selectEntities: selectDashboardWidgets, selectById: selectWidgetById } = widgetsAdapter.getSelectors(
	state => state.analyticsDashboardApp.dashboardWidgets
);

const widgetsSlice = createSlice({
	name: 'analyticsDashboardApp/dashboardWidgets',
	initialState: widgetsAdapter.getInitialState(),
	reducers: {},
	extraReducers: {
		[getDashboardWidgets.fulfilled]: widgetsAdapter.setAll
	}
});

export default widgetsSlice.reducer;
