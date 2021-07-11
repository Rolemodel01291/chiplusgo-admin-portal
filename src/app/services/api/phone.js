import { post } from './base.js';

export const phoneAPI = {
	checkPhone: data =>
		post(`/checkPhone`, { ...data })
			.then(({ data }) => data)
			.catch(error => console.log(error)),
	sendSMS: data => post(`/textmessageV2`, { ...data }).then(({ data }) => data)
};
