import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';
import 'firebase/storage'
import config from './firebaseServiceConfig';


class FirebaseService {
	init(success) {
		if (Object.entries(config).length === 0 && config.constructor === Object) {
			if (process.env.NODE_ENV === 'development') {
				console.warn(
					'Missing Firebase Configuration at src/app/services/firebaseService/firebaseServiceConfig.js'
				);
			}
			success(false);
			return;
		}

		if (firebase.apps.length) {
			return;
		}
		firebase.initializeApp(config);
		this.db = firebase.database();
		this.auth = firebase.auth();
		this.firestore = firebase.firestore();
		this.storage = firebase.storage()
		success(true);
	}

	getUserData = userId => {
		if (!firebase.apps.length) {
			return false;
		}
		return new Promise((resolve, reject) => {
			this.db
				.ref(`users/${userId}`)
				.once('value')
				.then(snapshot => {
					const user = snapshot.val();
					resolve(user);
				});
		});
	};

	updateUserData = user => {
		if (!firebase.apps.length) {
			return false;
		}
		return this.db.ref(`users/${user.uid}`).set(user);
	};

	onAuthStateChanged = callback => {
		if (!this.auth) {
			return;
		}
		
		this.auth.onAuthStateChanged(callback);
	};

	signOut = () => {
		if (!this.auth) {
			return;
		}
		
		this.auth.signOut();
	};

	resetPassword = (email) => {
		this.auth.sendPasswordResetEmail(email)
		.then(function (user) {
			console.log(user)
		})
		.catch(function (e) {
			console.log(e);
		});
	};
}

const instance = new FirebaseService();

export default instance;
