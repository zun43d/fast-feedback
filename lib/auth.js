import { useState, useContext, createContext, useEffect } from 'react';
import Router from 'next/router';

import firebase from './firebase';
import { createUser } from './db';

const authContext = createContext();

export function AuthProvider({ children }) {
	const auth = useProvideAuth();
	return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
	return useContext(authContext);
};

function useProvideAuth() {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	const handleUser = async (rawUser) => {
		if (rawUser) {
			const user = await formatUser(rawUser);
			const { token, ...userWithoutToken } = user;

			createUser(user.uid, userWithoutToken);
			setUser(user);
			setLoading(false);
			return user;
		} else {
			setLoading(false);
			setUser(false);
			return false;
		}
	};

	const signInWithGoogle = (redirect) => {
		setLoading(true);
		return firebase
			.auth()
			.signInWithPopup(new firebase.auth().GoogleAuthProvider())
			.then((res) => {
				handleUser(res.user);

				if (redirect) {
					Router.push(redirect);
				}
			});
	};

	const signInWithGitHub = () => {
		setLoading(true);
		return firebase
			.auth()
			.signInWithPopup(new firebase.auth.GithubAuthProvider())
			.then((res) => handleUser(res.user));
	};

	const signOut = () => {
		return firebase
			.auth()
			.signOut()
			.then(() => handleUser(false));
	};

	useEffect(() => {
		const unsubscribe = firebase.auth().onAuthStateChanged(handleUser);

		return () => unsubscribe();
	}, []);

	return {
		user,
		loading,
		signInWithGitHub,
		signOut,
	};
}

const formatUser = async (user) => {
	const token = await user.getIdToken();
	return {
		uid: user.uid,
		email: user.email,
		name: user.displayName,
		token,
		provider: user.providerData[0].providerId,
		photoUrl: user.photoURL,
	};
};
