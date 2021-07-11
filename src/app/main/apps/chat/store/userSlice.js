import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import firebaseService from 'app/services/firebaseService/firebaseService';
import axios from 'axios';

export const getUserData = createAsyncThunk(
	'chatApp/user/getUserData',
	async () =>
		new Promise(async resolve => {
			firebaseService.db
				.ref('/AdminMessagesList')
				.once('value')
				.then(snapshot => {
					resolve(snapshot.val())
				});
		})
);

export const updateUserData = createAsyncThunk('chatApp/user/updateUserData', async newData => {
	const response = await axios.post('/api/chat/user/data', newData);
	const data = await response.data;

	return data;
});

const userSlice = createSlice({
	name: 'chatApp/user',
	initialState: null,
	reducers: {
		updateUserChatList: (state, action) => {
			state.chatList = action.payload;
		}
	},
	extraReducers: {
		[getUserData.fulfilled]: (state, action) => action.payload,
		[updateUserData.fulfilled]: (state, action) => action.payload
	}
});

export const { updateUserChatList } = userSlice.actions;

export default userSlice.reducer;
