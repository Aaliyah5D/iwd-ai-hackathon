import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { UserProfile } from '../types';
import { toast } from 'sonner';
import { ArrowLeft, Save, User, GraduationCap, Phone, Shield } from 'lucide-react';
import { SA_UNIVERSITIES, GUARDIAN_SKILLS } from '../lib/utils';

export function EditProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    displayName: '',
    university: '',
    studentNumber: '',
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    },
    skills: [] as string[]
  });

  useEffect(() => {
    if (!auth.currentUser) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser!.uid));
        if (userDoc.exists()) {
          const data = userDoc.data() as UserProfile;
          setProfile(data);
          setFormData({
            displayName: data.displayName || '',
            university: data.university || '',
            studentNumber: data.studentNumber || '',
            emergencyContact: {
              name: data.emergencyContact?.name || '',
              relationship: data.emergencyContact?.relationship || '',
              phone: data.emergencyContact?.phone || ''
            },
            skills: data.skills || []
          });
        }
      } catch (error) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleSave = async () => {
    if (!auth.currentUser || saving) return;
    setSaving(true);

    try {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      
      // Find university location if university changed
      let universityLocation = profile?.universityLocation;
      if (formData.university !== profile?.university) {
        const uni = SA_UNIVERSITIES.find(u => u.name === formData.university);
        if (uni) {
          universityLocation = { lat: uni.lat, lng: uni.lng };
        }
      }

      const updateData: any = {
        ...formData,
      };

      if (universityLocation) {
        updateData.universityLocation = universityLocation;
      }

      await updateDoc(userDocRef, updateData);

      toast.success('Profile updated successfully!');
      navigate('/settings');
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6 text-center font-bold text-muted">Loading profile...</div>;

  return (
    <div className="p-6 space-y-8 pb-24">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/settings')}
          className="p-2 bg-secondary rounded-full text-muted hover:text-text transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-text tracking-tight uppercase">Edit Profile</h1>
          <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Update your information</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <p className="text-[10px] font-black text-muted uppercase tracking-widest ml-2">Basic Info</p>
          <div className="pastel-card space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Display Name</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={e => setFormData({ ...formData, displayName: e.target.value })}
                  className="w-full bg-secondary border-2 border-transparent focus:border-primary rounded-2xl py-3 pl-12 pr-4 text-xs font-bold outline-none transition-all"
                  placeholder="Your Name"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">University</label>
              <div className="relative">
                <GraduationCap size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <select
                  value={formData.university}
                  onChange={e => setFormData({ ...formData, university: e.target.value })}
                  className="w-full bg-secondary border-2 border-transparent focus:border-primary rounded-2xl py-3 pl-12 pr-4 text-xs font-bold outline-none transition-all appearance-none"
                >
                  <option value="">Select University</option>
                  {SA_UNIVERSITIES.map(u => (
                    <option key={u.name} value={u.name}>{u.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Student Number</label>
              <div className="relative">
                <Shield size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  value={formData.studentNumber}
                  onChange={e => setFormData({ ...formData, studentNumber: e.target.value })}
                  className="w-full bg-secondary border-2 border-transparent focus:border-primary rounded-2xl py-3 pl-12 pr-4 text-xs font-bold outline-none transition-all"
                  placeholder="Student Number"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="space-y-4">
          <p className="text-[10px] font-black text-muted uppercase tracking-widest ml-2">Emergency Contact</p>
          <div className="pastel-card space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Contact Name</label>
              <input
                type="text"
                value={formData.emergencyContact.name}
                onChange={e => setFormData({ 
                  ...formData, 
                  emergencyContact: { ...formData.emergencyContact, name: e.target.value } 
                })}
                className="w-full bg-secondary border-2 border-transparent focus:border-primary rounded-2xl py-3 px-4 text-xs font-bold outline-none transition-all"
                placeholder="Name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Relationship</label>
                <input
                  type="text"
                  value={formData.emergencyContact.relationship}
                  onChange={e => setFormData({ 
                    ...formData, 
                    emergencyContact: { ...formData.emergencyContact, relationship: e.target.value } 
                  })}
                  className="w-full bg-secondary border-2 border-transparent focus:border-primary rounded-2xl py-3 px-4 text-xs font-bold outline-none transition-all"
                  placeholder="Parent, Sibling, etc."
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Phone</label>
                <div className="relative">
                  <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    type="text"
                    value={formData.emergencyContact.phone}
                    onChange={e => setFormData({ 
                      ...formData, 
                      emergencyContact: { ...formData.emergencyContact, phone: e.target.value } 
                    })}
                    className="w-full bg-secondary border-2 border-transparent focus:border-primary rounded-2xl py-3 pl-10 pr-4 text-xs font-bold outline-none transition-all"
                    placeholder="012 345 6789"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="space-y-4">
          <p className="text-[10px] font-black text-muted uppercase tracking-widest ml-2">Guardian Skills</p>
          <div className="pastel-card">
            <div className="flex flex-wrap gap-2">
              {GUARDIAN_SKILLS.map(skill => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => {
                    const newSkills = formData.skills.includes(skill)
                      ? formData.skills.filter(s => s !== skill)
                      : [...formData.skills, skill];
                    setFormData({ ...formData, skills: newSkills });
                  }}
                  className={`px-3 py-1.5 rounded-lg font-bold text-[10px] transition-all ${
                    formData.skills.includes(skill)
                      ? 'bg-primary text-text shadow-sm'
                      : 'bg-secondary text-muted hover:bg-secondary/80'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary w-full flex items-center justify-center gap-2 py-4"
        >
          {saving ? 'Saving...' : <><Save size={20} /> Save Changes</>}
        </button>
      </div>
    </div>
  );
}
