import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { setSelectedContactId } from './contactsSlice';
import { closeMobileChatsSidebar } from './sidebarsSlice';
import { updateUserChatList } from './userSlice';
import firebaseService from 'app/services/firebaseService/firebaseService';
import formatISO from 'date-fns/formatISO';
import FuseUtils from '@fuse/utils';
import { phoneAPI } from '../../../../services/api';

export const getChat = createAsyncThunk(
	'chatApp/chat/getChat',
	async ({ contactId, isMobile, contact }, { dispatch, getState }) =>
		new Promise(resolve => {
			const { id: userId } = getState().chatApp.user;

			firebaseService.db
				.ref('/AdminMessagesList/')
				.once('value')
				.then(async snapshot => {
					const user = snapshot.val();
					const userChat = user.chatList.find(_chat => _chat.contactId === contactId);
					const chatId = userChat ? userChat.chatId : await createNewChat(contactId, userId, user);
					firebaseService.firestore
						.collection('Messages')
						.where('id', '==', chatId)
						.get()
						.then(querysnapshot => {
							dispatch(setSelectedContactId({ contactId, phone: contact.phone }));
							dispatch(updateUserChatList(user.chatList));
							if (isMobile) {
								dispatch(closeMobileChatsSidebar());
							}
							querysnapshot.forEach(snap => {
								const chat = snap.data();
								resolve(chat);
							});
						});
				});
		})
);

async function createNewChat(contactId, userId, user) {
	const chatId = FuseUtils.generateGUID();

	await firebaseService.db.ref('/AdminMessagesList').set({
		...user,
		chatList: [
			{
				chatId,
				contactId,
				lastMessageTime: ''
			},
			...user.chatList
		]
	});

	await firebaseService.firestore.collection('Messages').doc(chatId).set({
		id: chatId,
		dialog: []
	});
	return chatId;
}

export const sendMessage = createAsyncThunk(
	'chatApp/chat/sendMessage',
	async ({ messageText, chatId, contactId, user, phone }, { dispatch, getState }) =>
		new Promise((resolve, reject) => {
			phoneAPI
				.sendSMS({
					Phone: phone,
					Body: messageText,
					From: '+13462331831'
				})
				.then(res => {
					if (res.error) {
						console.log(res);
						reject(res);
					} else {
						const message = {
							who: user.id,
							message: messageText,
							time: formatISO(new Date())
						};

						firebaseService.firestore
							.collection('Messages')
							.doc(chatId)
							.get()
							.then(docSnap => {
								var chat = docSnap.data();

								firebaseService.firestore
									.collection('Messages')
									.doc(chatId)
									.update({
										dialog: [...chat.dialog, message]
									})
									.then(() => {
										var tempUserChatlist = [...user.chatList].map(item => {
											if (item.contactId === contactId) {
												return { ...item, lastMessageTime: message.time };
											}
											return item;
										});
										firebaseService.db
											.ref('/AdminMessagesList')
											.set({ ...user, chatList: tempUserChatlist })
											.then(() => {
												dispatch(updateUserChatList(tempUserChatlist));
												resolve(message);
											});
									});
							});
					}
				}).catch((e)=>{
					reject();
				})
		})
);

const chatSlice = createSlice({
	name: 'chatApp/chat',
	initialState: null,
	reducers: {
		removeChat: (state, action) => action.payload
	},
	extraReducers: {
		[getChat.fulfilled]: (state, action) => action.payload,
		[sendMessage.fulfilled]: (state, action) => {
			state.dialog = [...state.dialog, action.payload];
		}
	}
});

export default chatSlice.reducer;
