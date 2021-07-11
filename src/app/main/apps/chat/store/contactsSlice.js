import { createEntityAdapter, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import firebaseService from 'app/services/firebaseService/firebaseService';
import axios from 'axios';

export const getContacts = createAsyncThunk(
	'chatApp/contacts/getContacts',
	async params =>
		new Promise(async resolve => {
			firebaseService.firestore
				.collection('Client')
				.get()
				.then(documentSanpshot => {
					var tempUser = [];
					documentSanpshot.forEach(data => {
						tempUser.push({
							id: data.id,
							avatar: data.data().Avatar ? data.data().Avatar : '/assets/images/avatars/profile.jpg',
							mood: '',
							name: data.data().Name ? data.data().Name : 'Default',
							status: 'online',
							phone: data.data().Phone,
							unread: ''
						});
					});
					resolve(tempUser);
				});
		})
);

const contactsAdapter = createEntityAdapter({});

export const { selectAll: selectContacts, selectById: selectContactById } = contactsAdapter.getSelectors(
	state => state.chatApp.contacts
);

const contactsSlice = createSlice({
	name: 'chatApp/contacts',
	initialState: contactsAdapter.getInitialState({
		selectedContactId: null,
		selectedPhone: null
	}),
	reducers: {
		setSelectedContactId: (state, action) => {
			state.selectedContactId = action.payload.contactId;
			state.selectedPhone = action.payload.phone;
		},
		removeSelectedContactId: (state, action) => {
			state.selectedContactId = null;
		}
	},
	extraReducers: {
		[getContacts.fulfilled]: contactsAdapter.setAll
	}
});

export const { setSelectedContactId, removeSelectedContactId } = contactsSlice.actions;

export default contactsSlice.reducer;
