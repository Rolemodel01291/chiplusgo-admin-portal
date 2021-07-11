import { createEntityAdapter, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import _ from 'lodash';
import firebaseService from 'app/services/firebaseService';
import { UserAPI } from 'app/services/api';

export const getBusiness = createAsyncThunk(
	'account/business/getBusiness',
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
	'account/business/updateClient',
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
	'account/business/updateBusiness',
	async (data, { dispatch, getState }) =>
		new Promise((resolve, reject) => {
			console.log(data.businessData.id);
			console.log(data.model.Phone);
			firebaseService.firestore
				.collection('Business')
				.doc(data.model.BusinessId)
				.update({
					Business_name: {
						English: data.model.Business_name,
						Chinese: data.model.Business_name_cn
					},
					Addr: {
						City: data.model.City,
						State: data.model.State,
						Street: data.model.Street,
						Zipcode: data.model.Zipcode
					},
					Phone: data.model.Phone
				})
				.then(() => {
					resolve({ success: true });
				})
				.catch(e => {
					reject();
				});
		})
);

export const addBusiness = createAsyncThunk(
	'account/business/addBusiness',
	async (data, { dispatch, getState }) =>
		new Promise((resolve, reject) => {
			console.log('--------------', data);
			UserAPI.createAccount({
				email: data.Email,
				password: data.Password,
				nickName: 'business',
				phoneNumber: data.Phone,
				photoURL: 'https://business.com'
			})
				.then(res => {
					console.log('=================', res);
					if (res.error) {
						reject();
					} else {
						firebaseService.firestore
							.collection('Business')
							.doc(res.uid)
							.set({
								Business_name: {
									English: data.Business_name,
									Chinese: data.Business_name_cn
								},
								Email: data.Email,
								Addr: {
									City: data.City,
									State: data.State,
									Zipcode: data.Zipcode,
									Street: data.Address_one
								},
								AccountType: 'MAIN',
								Business: firebaseService.firestore.collection('Business').doc(res.uid),
								Business_account_balance: 0,
								Business_article: '',
								Business_article_cn: '',
								Business_logo: data.Business_logo,
								CashPointRate: 10,
								Phone: data.Phone.replace('+1', ''),
								Categories: ['Restaurant', 'Chinese food', 'Sichuan food'],
								image: [
									'https://firebasestorage.googleapis.com/v0/b/chiplusgo-95ec4.appspot.com/o/Business%2FK7fJ81Zp24XphoMBlhp2Qx71NG12%2Fbusiness%201.jpg?alt=media&token=d50b6a9d-b154-4f1a-8cda-fc0eb789d789',
									'https://firebasestorage.googleapis.com/v0/b/chiplusgo-95ec4.appspot.com/o/Business%2FK7fJ81Zp24XphoMBlhp2Qx71NG12%2Fbusiness%202.jpg?alt=media&token=a520de34-fbd7-4921-a13b-5f4ad0570d61',
									'https://firebasestorage.googleapis.com/v0/b/chiplusgo-95ec4.appspot.com/o/Business%2FK7fJ81Zp24XphoMBlhp2Qx71NG12%2Fbusiness%203.jpg?alt=media&token=010123d3-0dd4-426d-a745-1b3c025a0b49',
									'https://firebasestorage.googleapis.com/v0/b/chiplusgo-95ec4.appspot.com/o/Business%2FK7fJ81Zp24XphoMBlhp2Qx71NG12%2Fbusiness%204.jpg?alt=media&token=3c47705e-8eb2-4833-8a34-31311942942f'
								],
								Labels: { Group_buy: true, Parking: true, Wifi: true },
								Open_hours: {
									Hours: {
										Monday: ['11:00-24:00'],
										Tuesday: ['11:00-24:00'],
										Thursday: ['11:00-24:00'],
										Wednesday: ['11:00-24:00'],
										Friday: ['11:00-24:00'],
										Saturday: ['11:00-24:00']
									},
									IsOpenNow: true
								},
								Type: ['Restaurant'],
								Wifi: { Password: '', Ssid: '' },
								Price: 4.5,
								Offer_summary: [
									{ Summary: 'Sichuan Food', Summary_cn: '川菜', Type: 'Food' },
									{ Summary: 'Beverage', Summary_cn: '饮料', Type: 'beverage' }
								],
								PN_Ratio: 1.1,
								_geoloc: { lat: 41.84871763341618, lng: -87.6314348233777 },
								Review_counts: 0,
								Story: {
									Content:
										'Sze Chuan Cuisine Restaurant offers authentic and delicious tasting Chinese cuisine in Chicago, IL. Sze Chuan Cuisine’s convenient location and affordable prices make our restaurant a natural choice for dine-in or take-out meals in the Chicago community. Our restaurant is known for its variety in taste and high quality fresh ingredients. Come and experience our friendly atmosphere and excellent service. ',
									Url: 'https://www.szechuanfoods.com/aboutus'
								},
								Press: [{ Content: '', Publisher: '', Title: '', Url: '' }]
							})
							.then(() => {
								firebaseService.firestore
									.collection('Business')
									.doc(res.uid)
									.update({
										Business: firebaseService.firestore.collection('Business').doc(res.uid)
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
					}
				})
				.catch(error => {
					reject(error);
				});
		})
);

const businessAdapter = createEntityAdapter({});

export const {
	selectAll: selectBusiness,
	selectEntities: selectBusinessEntities,
	selectById: selectBusinessById
} = businessAdapter.getSelectors(state => state.account.business);

const businessSlice = createSlice({
	name: 'account/business',
	initialState: businessAdapter.getInitialState({
		loading: true
	}),
	reducers: {
		setBusinessLoading: (state, action) => {
			state.loading = action.payload;
		}
	},
	extraReducers: {
		[getBusiness.fulfilled]: businessAdapter.setAll,
		[updateClient.fulfilled]: businessAdapter.addOne
	}
});

export const { setBusinessLoading } = businessSlice.actions;

export default businessSlice.reducer;
