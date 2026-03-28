import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Shield, Mail, Lock, User, GraduationCap, CheckCircle2, AlertCircle, Heart, Star, Zap, Bell, Anchor, Phone } from 'lucide-react';
import { validateSAID, SA_UNIVERSITIES, GUARDIAN_SKILLS, AVATARS } from '../lib/utils';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export function SignupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    surname: '',
    email: '',
    idNumber: '',
    studentNumber: '',
    university: '',
    displayName: '',
    emergencyContact: {
      name: '',
      relationship: '',
      phone: '',
    },
    password: '',
    confirmPassword: '',
    skills: [] as string[],
    avatar: AVATARS[0],
  });

  const [idValidation, setIdValidation] = useState({ isValid: false, gender: 'Other' });

  const handleIdChange = (val: string) => {
    setFormData({ ...formData, idNumber: val });
    if (val.length === 13) {
      const result = validateSAID(val);
      setIdValidation(result);
    } else {
      setIdValidation({ isValid: false, gender: 'Other' });
    }
  };

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      
      const universityData = SA_UNIVERSITIES.find(u => u.name === formData.university);
      
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        firstName: formData.firstName,
        surname: formData.surname,
        email: formData.email,
        displayName: formData.displayName,
        university: formData.university,
        universityLocation: universityData ? { lat: universityData.lat, lng: universityData.lng } : null,
        studentNumber: formData.studentNumber,
        gender: idValidation.gender,
        idNumber: formData.idNumber,
        emergencyContact: formData.emergencyContact,
        skills: formData.skills,
        avatar: formData.avatar,
        isGuardian: true,
        helpsCompleted: 0,
        achievements: [],
        createdAt: Date.now(),
      });

      toast.success('Account created successfully!');
      navigate('/');
    } catch (error: any) {
      console.error('Signup error:', error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error('This email is already registered. Try logging in instead!');
      } else if (error.code === 'auth/operation-not-allowed') {
        toast.error('Email/Password signup is not enabled in the Firebase Console. Please enable it in the Authentication tab.');
      } else {
        toast.error(error.message || 'Failed to create account');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background pb-12">
      <div className="bg-primary p-12 text-center rounded-b-[48px] shadow-[0_8px_0_0_#E66A85]">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg overflow-hidden">
          <img 
            src="/logo.png" 
            alt="SYNK Logo" 
            className="w-12 h-12 object-contain"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const fallback = document.createElement('div');
              fallback.className = 'text-primary font-black text-3xl';
              fallback.textContent = 'S';
              e.currentTarget.parentElement?.appendChild(fallback);
            }}
          />
        </div>
        <h1 className="text-5xl font-black text-text tracking-tight mb-2">
          SYNK
        </h1>
        <p className="text-muted font-bold">Create your guardian account.</p>
      </div>

      <div className="flex-1 p-8 max-w-md mx-auto w-full">
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-300 ${
                step === s ? 'w-12 bg-primary' : step > s ? 'w-4 bg-primary/40' : 'w-4 bg-border'
              }`}
            />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-3xl font-black text-text">Tell us about yourself</h2>
            <p className="text-muted font-bold">Step 1 of 3 — Personal details</p>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-muted uppercase tracking-widest ml-2">First Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-4 bg-white border-[2.5px] border-border rounded-[24px] outline-none focus:border-primary transition-all font-bold"
                  placeholder="Amara"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-muted uppercase tracking-widest ml-2">Surname</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-4 bg-white border-[2.5px] border-border rounded-[24px] outline-none focus:border-primary transition-all font-bold"
                  placeholder="Dlamini"
                  value={formData.surname}
                  onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-muted uppercase tracking-widest ml-2">University Email</label>
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
              <label className="text-xs font-black text-muted uppercase tracking-widest ml-2">SA ID Number</label>
              <input
                type="text"
                maxLength={13}
                required
                className="w-full px-4 py-4 bg-white border-[2.5px] border-border rounded-[24px] outline-none focus:border-primary transition-all font-bold"
                placeholder="13-digit ID number"
                value={formData.idNumber}
                onChange={(e) => handleIdChange(e.target.value)}
              />
              {formData.idNumber.length === 13 && (
                <div className={`flex items-center gap-2 text-xs font-bold p-3 rounded-xl ${idValidation.isValid ? 'bg-mint text-mint-dark' : 'bg-coral text-red-500'}`}>
                  {idValidation.isValid ? (
                    <><CheckCircle2 size={16} /> Valid ID — Gender: {idValidation.gender}</>
                  ) : (
                    <><AlertCircle size={16} /> Invalid SA ID number</>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-muted uppercase tracking-widest ml-2">University</label>
              <div className="relative">
                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={20} />
                <select
                  required
                  className="w-full pl-12 pr-4 py-4 bg-white border-[2.5px] border-border rounded-[24px] outline-none focus:border-primary transition-all font-bold appearance-none"
                  value={formData.university}
                  onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                >
                  <option value="">Select your university…</option>
                  {SA_UNIVERSITIES.map(uni => <option key={uni.name} value={uni.name}>{uni.name}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-muted uppercase tracking-widest ml-2">Student Number</label>
              <input
                type="text"
                required
                className="w-full px-4 py-4 bg-white border-[2.5px] border-border rounded-[24px] outline-none focus:border-primary transition-all font-bold"
                placeholder="University student number"
                value={formData.studentNumber}
                onChange={(e) => setFormData({ ...formData, studentNumber: e.target.value })}
              />
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!formData.firstName || !formData.surname || !formData.email || !idValidation.isValid || !formData.university || !formData.studentNumber}
              className="btn-primary w-full text-lg disabled:opacity-50"
            >
              Continue →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-3xl font-black text-text">Emergency Contact</h2>
            <p className="text-muted font-bold">Step 2 of 4 — Someone to call in crisis.</p>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-muted uppercase tracking-widest ml-2">Contact Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-4 bg-white border-[2.5px] border-border rounded-[24px] outline-none focus:border-primary transition-all font-bold"
                  value={formData.emergencyContact.name}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: { ...formData.emergencyContact, name: e.target.value } })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-muted uppercase tracking-widest ml-2">Relationship</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-4 bg-white border-[2.5px] border-border rounded-[24px] outline-none focus:border-primary transition-all font-bold"
                  placeholder="e.g. Mother, Brother, Friend"
                  value={formData.emergencyContact.relationship}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: { ...formData.emergencyContact, relationship: e.target.value } })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-muted uppercase tracking-widest ml-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={20} />
                  <input
                    type="tel"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-white border-[2.5px] border-border rounded-[24px] outline-none focus:border-primary transition-all font-bold"
                    value={formData.emergencyContact.phone}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: { ...formData.emergencyContact, phone: e.target.value } })}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setStep(1)} className="btn-secondary flex-1">Back</button>
              <button 
                onClick={() => setStep(3)} 
                disabled={!formData.emergencyContact.name || !formData.emergencyContact.relationship || !formData.emergencyContact.phone}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-3xl font-black text-text">Your guardian skills</h2>
            <p className="text-muted font-bold">Step 3 of 4 — Select all that apply.</p>

            <div className="grid grid-cols-2 gap-3">
              {GUARDIAN_SKILLS.map(skill => (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`p-4 text-left rounded-[24px] border-[2.5px] transition-all font-bold text-sm ${
                    formData.skills.includes(skill)
                      ? 'bg-primary/10 border-primary text-text'
                      : 'bg-white border-border text-muted hover:border-primary/40'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>

            <div className="bg-secondary/40 p-4 rounded-[24px] border-[2.5px] border-primary/20">
              <p className="text-xs font-bold text-muted text-center">
                💡 No skills yet? That's okay — you can still request and receive help.
              </p>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setStep(2)} className="btn-secondary flex-1">Back</button>
              <button onClick={() => setStep(4)} className="btn-primary flex-1">Continue</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-3xl font-black text-text">Pick your identity</h2>
            <p className="text-muted font-bold">Step 4 of 4 — Choose a display name and avatar.</p>

            <div className="space-y-2">
              <label className="text-xs font-black text-muted uppercase tracking-widest ml-2">Display Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={20} />
                <input
                  type="text"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-white border-[2.5px] border-border rounded-[24px] outline-none focus:border-primary transition-all font-bold"
                  placeholder="e.g. butterfly_amara"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-muted uppercase tracking-widest ml-2">Choose your avatar</label>
              <div className="grid grid-cols-4 gap-3">
                {AVATARS.map(av => {
                  const Icon = {
                    shield: Shield,
                    heart: Heart,
                    star: Star,
                    zap: Zap,
                    user: User,
                    'graduation-cap': GraduationCap,
                    bell: Bell,
                    anchor: Anchor
                  }[av] || User;

                  return (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setFormData({ ...formData, avatar: av })}
                      className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                        formData.avatar === av ? 'bg-primary border-[3px] border-white shadow-lg scale-110 text-white' : 'bg-white border-[2.5px] border-border text-muted'
                      }`}
                    >
                      <Icon size={28} />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-muted uppercase tracking-widest ml-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={20} />
                <input
                  type="password"
                  required
                  minLength={8}
                  className="w-full pl-12 pr-4 py-4 bg-white border-[2.5px] border-border rounded-[24px] outline-none focus:border-primary transition-all font-bold"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-muted uppercase tracking-widest ml-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={20} />
                <input
                  type="password"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-white border-[2.5px] border-border rounded-[24px] outline-none focus:border-primary transition-all font-bold"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button type="button" onClick={() => setStep(3)} className="btn-secondary flex-1">Back</button>
              <button type="submit" disabled={loading} className="btn-primary flex-1">
                {loading ? 'Creating...' : 'Sign Up 🎉'}
              </button>
            </div>
          </form>
        )}

        <p className="text-center mt-8 text-muted font-bold">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
