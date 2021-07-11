import {post} from './base.js';

export const UserAPI = {
  createAccount: data =>
    post(`/createSubAccount`, {data})
      .then(({data}) => data)
      .catch(({error}) => error),
  deleteAccount: data =>
    post(`/deleteSubAccount`, {data})
      .then(({data}) => data)
      .catch(error => console.log(error)),
};
