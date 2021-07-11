import { createEntityAdapter, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import _ from 'lodash';
import firebaseService from 'app/services/firebaseService';
import { UserAPI } from 'app/services/api';
import moment from 'moment'

export const getCoupon = createAsyncThunk(
	'deals/coupon/getCoupon',
	async () =>
		new Promise((resolve, reject) => {
			firebaseService.firestore
				.collection('Admin')
				.doc('Coupons')
				.collection('Coupons')
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
	'deals/coupon/updateClient',
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
	'deals/coupon/updateBusiness',
	async (data, { dispatch, getState }) =>
		new Promise((resolve, reject) => {
			console.log(data.businessData.id);
			console.log(data.model);
			firebaseService.firestore
				.collection('Business')
				.doc(data.model.BusinessId)
				.update({
					Business_name: {
						English: data.model.Business_name,
						Chinese: data.model.Business_name_cn
					}
				})
				.then(() => {
					resolve({ success: true });
				})
				.catch(e => {
					reject();
				});
		})
);

export const deleteCoupon = createAsyncThunk(
	'deals/coupon/deleteCoupon',
	async (data, { dispatch, getState }) =>
		new Promise((resolve, reject) => {
			firebaseService.firestore
				.collection('Admin')
				.doc('Coupons')
				.collection('Coupons')
				.doc(data.id)
				.delete()
				.then(() => {
					firebaseService.firestore
						.collection('Ads_Banner')
						.doc('Banners')
						.get()
						.then(bannerSnap => {
							console.log(
								bannerSnap.data().Home_top_banners.filter(item => item.Argument.CouponId !== data.id)
							);

							console.log(
								bannerSnap.data().Home_mid1_banners.filter(item => item.Argument.CouponId !== data.id)
							);
							firebaseService.firestore
								.collection('Ads_Banner')
								.doc('Banners')
								.update({
									Home_mid1_banners: bannerSnap
										.data()
										.Home_mid1_banners.filter(item => item.Argument.CouponId !== data.id),
									Home_top_banners: bannerSnap
										.data()
										.Home_top_banners.filter(item => item.Argument.CouponId !== data.id)
								})
								.then(res => {
									dispatch(getCoupon());
									resolve(res);
								});
						});
				});
		})
);

function makeName(length) {
	var result = [];
	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
	}
	return result.join('');
}

export const addCoupon = createAsyncThunk(
	'deals/coupon/addCoupon',
	async (data, { dispatch, getState }) =>
		new Promise((resolve, reject) => {
			console.log(data);
			var couponId = makeName(20);
			var tempBusiness = [];
			var tempBusinessIds = data.BusinessId.map(item => item.replace(' ', '').replace(' ', ''));
			if (data.BusinessId.length > 0) {
				tempBusinessIds.map(item => {
					tempBusiness.push(firebaseService.firestore.collection('Business').doc(item));
				});
			} else {
				tempBusiness.push(firebaseService.firestore.collection('Admin').doc('Data'));
			}

			/**
			 * get business names from
			 * business id array
			 */
			Promise.all(
				tempBusiness.map(ref => {
					return ref.get().then(snapData => {
						console.log(snapData.data());
						return snapData.data().Business_name;
					});
				})
			).then(businessNames => {
				// var EnglishName = '';
				// var ChineseName = '';
				var Items = [];
				var BusinessName = []
				businessNames.map(item => {
					// EnglishName = EnglishName + item.English + ', ';
					// ChineseName = ChineseName + item.Chinese + ', ';
					BusinessName.push({English:item.English, Chinese:item.Chinese})
				});
				data.Items.map((item, index) => {
					Items.push({ Item: item, Item_cn: data.Items_cn[index] });
				});

				/**
				 * save coupon to admin db
				 */
				firebaseService.firestore
					.collection('Admin')
					.doc('Coupons')
					.collection('Coupons')
					.doc(couponId)
					.set({
						BusinessId: data.BusinessId.length > 0 ? tempBusinessIds : [data.adminData.uid],
						Business: tempBusiness,
						Business_name: BusinessName,
						id: couponId,
						Description: data.Description,
						Description_cn: data.Description_cn,
						Image: data.images,
						IsActive: true,
						Item: Items,
						Original_price: parseFloat(data.OriginalPrice),
						Price: parseFloat(data.Price),
						Rules: {
							Available_date: moment(new Date(data.start)).format('YYYY-MM-DD'),
							Available_hours: data.available_hours,
							Rule:data.Items,
							Unavailable_date:moment(new Date(data.end)).format('YYYY-MM-DD'),
						},
						Top_ads: data.Top_ads,
						Sold_cnts: 0,
						Tax: parseFloat(data.Tax),
						Title: data.Title,
						Title_cn: data.Title_cn,
						Validatity: {
							End_date: new Date(data.end),
							Start_date: new Date(data.start)
						}
					})
					.then(response => {
						/**
						 * add banner
						 * @res returns saved data
						 */
						firebaseService.firestore
							.collection('Ads_Banner')
							.doc('Banners')
							.get()
							.then(bannerSnap => {
								/**
								 * set top banner
								 */

								var bannerData = {};
								if (data.Top_ads) {
									bannerData = {
										Home_top_banners: [
											...bannerSnap.data().Home_top_banners,
											{
												Argument: {
													BusinessId: tempBusinessIds,
													CouponId: couponId
												},
												Background: '0xffc3c3c3',
												Image: data.images[data.images.length - 1],
												Router: '/single_coupon',
												Url: ''
											}
										]
									};
								} else {
									bannerData = {
										Home_mid1_banners: [
											...bannerSnap.data().Home_mid1_banners,
											{
												Argument: {
													BusinessId: tempBusinessIds,
													CouponId: couponId
												},
												Background: '0xffc3c3c3',
												Image: data.images[data.images.length - 1],
												Router: '/single_coupon',
												Url: ''
											}
										]
									};
								}
								console.log(bannerData);
								firebaseService.firestore
									.collection('Ads_Banner')
									.doc('Banners')
									.update({ ...bannerData })
									.then(res => {
										resolve(res);
										dispatch(getCoupon());
									});
							});
					});
			});
		})
);

export const updateCoupon = createAsyncThunk(
	'deals/coupon/updateCoupon',
	async (data, { dispatch, getState }) =>
		new Promise((resolve, reject) => {
			console.log(data);
			// var couponId = makeName(20);
			var tempBusiness = [];
			var tempBusinessIds = data.BusinessId.map(item => item.replace(' ', '').replace(' ', ''));
			if (data.BusinessId.length > 0) {
				tempBusinessIds.map(item => {
					tempBusiness.push(firebaseService.firestore.collection('Business').doc(item));
				});
			} else {
				tempBusiness.push(firebaseService.firestore.collection('Admin').doc('Data'));
			}

			/**
			 * get business names from
			 * business id array
			 */
			Promise.all(
				tempBusiness.map(ref => {
					return ref.get().then(snapData => {
						
						return snapData.data().Business_name;
					});
				})
			).then(businessNames => {
				var EnglishName = '';
				var ChineseName = '';
				var Items = [];
				var BusinessName = []
				businessNames.map(item => {
					// EnglishName = EnglishName + item.English + ', ';
					// ChineseName = ChineseName + item.Chinese + ', ';
					BusinessName.push({English:item.English, Chinese:item.Chinese})
				});
				data.Items.map((item, index) => {
					Items.push({ Item: item, Item_cn: data.Items_cn[index] });
				});

				/**
				 * save coupon to admin db
				 */
				
				 
				firebaseService.firestore
					.collection('Admin')
					.doc('Coupons')
					.collection('Coupons')
					.doc(data.id)
					.update({
						BusinessId: data.BusinessId.length > 0 ? tempBusinessIds : [data.adminData.uid],
						Business: tempBusiness,
						Business_name: BusinessName,
						id: data.id,
						Description: data.Description,
						Description_cn: data.Description_cn,
						Image: data.images,
						IsActive: true,
						Item: Items,
						Original_price: data.OriginalPrice,
						Price: data.Price,
						Rules: {
							Available_date: moment(new Date(data.start)).format('YYYY-MM-DD'),
							Available_hours: data.available_hours,
							Rule:data.Items,
							Unavailable_date:moment(new Date(data.end)).format('YYYY-MM-DD'),
						},
						Top_ads: data.Top_ads,
						Sold_cnts: 0,
						Tax: data.Tax,
						Title: data.Title,
						Title_cn: data.Title_cn,
						Validatity: {
							End_date: new Date(data.end),
							Start_date: new Date(data.start)
						}
					})
					.then(response => {
						/**
						 * add banner
						 * @res returns saved data
						 */
						firebaseService.firestore
							.collection('Ads_Banner')
							.doc('Banners')
							.get()
							.then(bannerSnap => {
								/**
								 * set top banner
								 */

								var bannerData = {};
								if (data.Top_ads) {
									var tempTopBanner = _.map(bannerSnap.data().Home_top_banners, item => {
										if (item.Argument.CouponId === data.id) {
											item.Argument.BusinessId =
												data.BusinessId.length > 0 ? tempBusinessIds : [data.adminData.uid];
											item.Image = data.images[data.images.length - 1];
										}
										return item;
									});
									bannerData = {
										Home_top_banners: tempTopBanner
									};
								} else {
									var tempBottomBanner = _.map(bannerSnap.data().Home_mid1_banners, function (item) {
										if (item.Argument.CouponId === data.id) {
											item.Argument.BusinessId =
												data.BusinessId.length > 0 ? tempBusinessIds : [data.adminData.uid];
											item.Image = data.images[data.images.length - 1];
										}
										return item;
									});
									bannerData = {
										Home_mid1_banners: tempBottomBanner
									};
								}
								console.log(bannerData);
								firebaseService.firestore
									.collection('Ads_Banner')
									.doc('Banners')
									.update({ ...bannerData })
									.then(res => {
										resolve(res);
									});
							});
					});
			});
		})
);

const couponAdapter = createEntityAdapter({});

export const {
	selectAll: selectCoupon,
	selectEntities: selectCouponEntities,
	selectById: selectCouponById
} = couponAdapter.getSelectors(state => state.deals.coupon);

const couponSlice = createSlice({
	name: 'deals/coupon',
	initialState: couponAdapter.getInitialState({
		selectedCoupon: {}
	}),
	reducers: {
		setCouponData: (state, action) => {
			state.selectedCoupon = action.payload;
		}
	},
	extraReducers: {
		[getCoupon.fulfilled]: couponAdapter.setAll,
		[updateClient.fulfilled]: couponAdapter.addOne
	}
});

export const { setCouponData } = couponSlice.actions;

export default couponSlice.reducer;
