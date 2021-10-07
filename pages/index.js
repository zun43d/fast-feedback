import { useAuth } from '../lib/auth';

export default function Home() {
	const auth = useAuth();

	return auth.user ? (
		<div>
			<p>Email: {auth.user.email}</p>
			<button onClick={() => auth.signOut()}>Sign Out</button>
		</div>
	) : (
		<button onClick={() => auth.signInWithGitHub()}>Sign In With GitHub</button>
	);
}
