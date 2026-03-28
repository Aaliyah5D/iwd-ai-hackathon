import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Shield, Mail, Lock, UserCircle } from 'lucide-react';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signInAnonymously } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        toast.error('Invalid email or password. Please try again or sign up if you don\'t have an account.');
      } else if (error.code === 'auth/operation-not-allowed') {
        toast.error('Email/Password login is not enabled in the Firebase Console. Please enable it in the Authentication tab.');
      } else if (error.code === 'auth/too-many-requests') {
        toast.error('Too many failed attempts. Please try again later.');
      } else {
        toast.error(error.message || 'Failed to log in');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user profile exists, if not create a basic one
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          uid: user.uid,
          firstName: user.displayName?.split(' ')[0] || 'Student',
          surname: user.displayName?.split(' ').slice(1).join(' ') || '',
          email: user.email || '',
          displayName: user.displayName || 'Guardian',
          university: 'Unknown',
          studentNumber: '',
          gender: 'Other',
          idNumber: '',
          emergencyContact: {
            name: '',
            relationship: '',
            phone: '',
          },
          skills: [],
          avatar: 'shield',
          isGuardian: true,
          helpsCompleted: 0,
          achievements: [],
          createdAt: Date.now(),
        });
        toast.success('Welcome to SYNK! Please update your profile in settings.');
      } else {
        toast.success('Welcome back!');
      }
      
      navigate('/');
    } catch (error: any) {
      console.error('Google Sign-In error:', error);
      if (error.code === 'auth/operation-not-allowed') {
        toast.error('Google Sign-In is not enabled in the Firebase Console. Please enable it in the Authentication tab.');
      } else {
        toast.error(error.message || 'Failed to sign in with Google');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAnonymousSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInAnonymously(auth);
      const user = result.user;

      // Check if user profile exists, if not create a basic one
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          uid: user.uid,
          firstName: 'Anonymous',
          surname: 'User',
          email: '',
          displayName: 'Anonymous Guardian',
          university: 'Unknown',
          studentNumber: '',
          gender: 'Other',
          idNumber: '',
          emergencyContact: {
            name: '',
            relationship: '',
            phone: '',
          },
          skills: [],
          avatar: 'user',
          isGuardian: false, // Anonymous users are not guardians by default
          helpsCompleted: 0,
          achievements: [],
          createdAt: Date.now(),
        });
        toast.success('Signed in anonymously!');
      } else {
        toast.success('Welcome back!');
      }
      navigate('/');
    } catch (error: any) {
      console.error('Anonymous Sign-In error:', error);
      if (error.code === 'auth/operation-not-allowed') {
        toast.error('Anonymous Sign-In is not enabled in the Firebase Console. Please enable it in the Authentication tab.');
      } else {
        toast.error(error.message || 'Failed to sign in anonymously');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="bg-primary p-12 text-center rounded-b-[48px] shadow-[0_8px_0_0_#E66A85]">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg overflow-hidden">
          <img 
            src="/logo.png" 
            alt="SYNK Logo" 
            className="w-16 h-16 object-contain"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const fallback = document.createElement('div');
              fallback.className = 'text-primary font-black text-4xl';
              fallback.textContent = 'S';
              e.currentTarget.parentElement?.appendChild(fallback);
            }}
          />
        </div>
        <h1 className="text-5xl font-black text-text tracking-tight mb-2">
          SYNK
        </h1>
        <p className="text-muted font-bold">Campus safety, powered by you.</p>
      </div>

      <div className="flex-1 p-8 max-w-md mx-auto w-full">
        <h2 className="text-3xl font-black text-text mb-2">Welcome back!</h2>
        <p className="text-muted font-bold mb-8">Sign in to your student account.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-muted uppercase tracking-widest ml-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={20} />
              <input
                type="email"
                required
                className="w-full pl-12 pr-4 py-4 bg-white border-[2.5px] border-border rounded-[24px] outline-none focus:border-primary transition-all font-bold"
                placeholder="student@university.ac.za"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-muted uppercase tracking-widest ml-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={20} />
              <input
                type="password"
                required
                className="w-full pl-12 pr-4 py-4 bg-white border-[2.5px] border-border rounded-[24px] outline-none focus:border-primary transition-all font-bold"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full text-lg disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Log In →'}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-[2.5px] border-border"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase font-black">
            <span className="bg-background px-4 text-muted tracking-widest">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="bg-white border-[2.5px] border-border text-text font-black py-4 rounded-[24px] shadow-[0_4px_0_0_#FFD1DC] flex items-center justify-center gap-3 active:translate-y-1 active:shadow-none transition-all disabled:opacity-50"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            Google
          </button>
          
          <button
            onClick={handleAnonymousSignIn}
            disabled={loading}
            className="bg-white border-[2.5px] border-border text-text font-black py-4 rounded-[24px] shadow-[0_4px_0_0_#FFD1DC] flex items-center justify-center gap-3 active:translate-y-1 active:shadow-none transition-all disabled:opacity-50"
          >
            <UserCircle size={20} className="text-muted" />
            Guest
          </button>
        </div>

        <p className="text-center mt-8 text-muted font-bold">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
