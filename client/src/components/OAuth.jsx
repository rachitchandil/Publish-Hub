import { useEffect } from 'react';
import { Button } from 'flowbite-react';
import { AiFillGoogleCircle } from 'react-icons/ai';
import { GoogleAuthProvider, getAuth, signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {
    const auth = getAuth(app);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Function to handle Google sign-in via Popup first, fallback to Redirect if needed
    const handleGoogleClick = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });

        try {
            // Attempt Google sign-in using popup
            const resultsfromGoogle = await signInWithPopup(auth, provider);

            // Post user data to backend
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: resultsfromGoogle.user.displayName,
                    email: resultsfromGoogle.user.email,
                    googlePhotoUrl: resultsfromGoogle.user.photoURL,
                }),
            });

            const data = await res.json();
            if (res.ok) {
                dispatch(signInSuccess(data));
                navigate('/');
            }
        } catch (error) {
            console.error("Error during Google sign-in:", error.message);
            if (error.code === 'auth/popup-closed-by-user') {
                // Handle when the popup is closed before completion
                console.log("Popup was closed before sign-in could complete.");
                alert("Popup was closed before sign-in could complete. Please try again.");
            } else {
                // If other errors or popup fails, fallback to redirect
                console.log("Falling back to redirect for Google sign-in.");
                await signInWithRedirect(auth, provider);
            }
        }
    };

    // Handle the Google sign-in result after redirect
    useEffect(() => {
        const checkGoogleSignIn = async () => {
            try {
                const result = await getRedirectResult(auth);
                if (result) {
                    // Post user data to backend after successful redirect sign-in
                    const res = await fetch('/api/auth/google', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            name: result.user.displayName,
                            email: result.user.email,
                            googlePhotoUrl: result.user.photoURL,
                        }),
                    });

                    const data = await res.json();
                    if (res.ok) {
                        dispatch(signInSuccess(data));
                        navigate('/');
                    }
                }
            } catch (error) {
                console.error("Error after redirect:", error.message);
            }
        };

        // Run the check when component mounts
        checkGoogleSignIn();
    }, [auth, dispatch, navigate]); // Ensure effect runs only once

    return (
        <Button type='button' gradientDuoTone='pinkToOrange' outline onClick={handleGoogleClick}>
            <AiFillGoogleCircle className='w-6 h-6 mr-2' />
            Continue with Google
        </Button>
    );
}
