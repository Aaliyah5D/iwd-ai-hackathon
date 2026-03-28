import React, { useState, useEffect } from 'react';
import { Shield, Pill, Accessibility, UserCheck, AlertCircle, Heart } from 'lucide-react';
import { HelpCard } from '../components/HelpCard';
import { RadarView } from '../components/RadarView';
import { GuardianTips } from '../components/GuardianTips';
import { toast } from 'sonner';
import { auth, db } from '../firebase';
import { collection, addDoc, onSnapshot, query, where, doc, updateDoc, getDoc } from 'firebase/firestore';
import { HelpRequest, HelpType, UserProfile } from '../types';
import { GoogleGenAI } from '@google/genai';

const HELP_TYPES = [
  {
    id: 'pads' as HelpType,
    title: 'Request Pads',
    description: 'Need menstrual products? Nearby students can help.',
    icon: Shield,
    color: 'bg-pink-100 text-pink-600',
  },
  {
    id: 'medical-aid' as HelpType,
    title: 'Medical Aid',
    description: 'Asthma pump, paracetamol, or basic first aid.',
    icon: Pill,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    id: 'disability-aid' as HelpType,
    title: 'Disability Aid',
    description: 'Stuck? Newly disabled? Construction in the way?',
    icon: Accessibility,
    color: 'bg-purple-100 text-purple-600',
  },
  {
    id: 'safety-escort' as HelpType,
    title: 'Safety Escort',
    description: 'Feeling unsafe? Request a walk to your destination.',
    icon: UserCheck,
    color: 'bg-green-100 text-green-600',
  },
];

export function HomePage() {
  const [activePing, setActivePing] = useState<HelpRequest | null>(null);
  const [currentSync, setCurrentSync] = useState<HelpRequest | null>(null);
  const [userRequest, setUserRequest] = useState<HelpRequest | null>(null);
  const [showTips, setShowTips] = useState<string | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [requestModal, setRequestModal] = useState<{ show: boolean; type: HelpType | null }>({ show: false, type: null });
  const [additionalInfo, setAdditionalInfo] = useState('');

  useEffect(() => {
    if (!auth.currentUser) return;

    // 1. Fetch user profile
    const userDocRef = doc(db, 'users', auth.currentUser.uid);
    getDoc(userDocRef).then(snap => {
      if (snap.exists()) {
        setUserProfile(snap.data() as UserProfile);
      }
    });

    // 2. Listen for pending help requests
    const pendingQuery = query(
      collection(db, 'helpRequests'),
      where('status', '==', 'pending')
    );

    const unsubscribePending = onSnapshot(pendingQuery, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const request = { id: change.doc.id, ...change.doc.data() } as HelpRequest;
          if (request.requesterId === auth.currentUser?.uid) return;
          setActivePing(request);
        }
      });
    });

    // 3. Listen for your active sync (accepted by you)
    const activeQuery = query(
      collection(db, 'helpRequests'),
      where('acceptedBy', '==', auth.currentUser.uid),
      where('status', '==', 'accepted')
    );

    const unsubscribeActive = onSnapshot(activeQuery, (snapshot) => {
      if (!snapshot.empty) {
        setCurrentSync({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as HelpRequest);
      } else {
        setCurrentSync(null);
      }
    });

    // 4. Listen for your own request
    const myRequestQuery = query(
      collection(db, 'helpRequests'),
      where('requesterId', '==', auth.currentUser.uid),
      where('status', 'in', ['pending', 'accepted', 'completed'])
    );

    const unsubscribeMyRequest = onSnapshot(myRequestQuery, (snapshot) => {
      if (!snapshot.empty) {
        // Sort by createdAt desc to get the latest
        const latest = snapshot.docs
          .map(d => ({ id: d.id, ...d.data() } as HelpRequest))
          .sort((a, b) => b.createdAt - a.createdAt)[0];
        
        // Only show if not cancelled and not too old (e.g. within last hour)
        if (Date.now() - latest.createdAt < 3600000) {
          setUserRequest(latest);
        } else {
          setUserRequest(null);
        }
      } else {
        setUserRequest(null);
      }
    });

    return () => {
      unsubscribePending();
      unsubscribeActive();
      unsubscribeMyRequest();
    };
  }, []);

  const handleRequestHelp = async () => {
    if (!auth.currentUser || !requestModal.type) return;

    const request: Omit<HelpRequest, 'id'> = {
      requesterId: isAnonymous ? null : auth.currentUser.uid,
      type: requestModal.type,
      isAnonymous,
      additionalInfo: additionalInfo.trim() || undefined,
      location: {
        lat: -26.2041, // Mock location (Johannesburg)
        lng: 28.0473,
      },
      status: 'pending',
      acceptedBy: null,
      createdAt: Date.now(),
    };

    try {
      await addDoc(collection(db, 'helpRequests'), request);
      toast.success(`Request for ${requestModal.type} sent! Pinging nearby guardians...`, {
        description: isAnonymous ? 'Your request is anonymous.' : 'Your identity is visible to guardians.',
      });
      setRequestModal({ show: false, type: null });
      setAdditionalInfo('');
    } catch (error: any) {
      console.error('Request help error:', error);
      toast.error('Failed to send help request');
    }
  };

  const handleCompleteSync = async () => {
    if (!currentSync || !auth.currentUser) return;

    try {
      const requestRef = doc(db, 'helpRequests', currentSync.id);
      await updateDoc(requestRef, {
        status: 'completed',
      });

      // Increment user's helpsCompleted
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const currentCount = userDoc.data().helpsCompleted || 0;
        await updateDoc(userDocRef, {
          helpsCompleted: currentCount + 1
        });
      }

      toast.success('Sync completed! You are a hero.');
      setCurrentSync(null);
      setShowTips(null);
    } catch (error: any) {
      console.error('Complete sync error:', error);
      toast.error('Failed to complete sync');
    }
  };

  const handleSayThankYou = async () => {
    if (!userRequest || !auth.currentUser) return;

    try {
      const requestRef = doc(db, 'helpRequests', userRequest.id);
      await updateDoc(requestRef, {
        thankYouSent: true,
      });
      toast.success('Thank you sent! 💖');
    } catch (error: any) {
      console.error('Thank you error:', error);
      toast.error('Failed to send thank you');
    }
  };
  const handleAcceptPing = async () => {
    if (!activePing || !auth.currentUser) return;

    try {
      // Only update Firestore if it's not a mock ping
      if (activePing.id !== 'mock-id') {
        const requestRef = doc(db, 'helpRequests', activePing.id);
        await updateDoc(requestRef, {
          status: 'accepted',
          acceptedBy: auth.currentUser.uid,
        });
      }

      setActivePing(null);
      toast.success('You have accepted the request! AI tips are available.');
      
      // Generate AI tips using Gemini
      generateAITips(activePing.type);
    } catch (error: any) {
      console.error('Accept ping error:', error);
      toast.error('Failed to accept request');
    }
  };

  const generateAITips = async (type: string) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are a campus safety assistant. A student guardian has just accepted a help request for "${type}". 
        Provide 3-5 concise, compassionate, and practical tips for the guardian on how to assist the student. 
        Focus on safety, dignity, and empathy. Use markdown formatting.`,
      });
      setShowTips(response.text || 'Stay calm and ask how you can help.');
    } catch (error) {
      console.error('AI error:', error);
      setShowTips(`### How to help compassionately:
- **Stay Calm:** Your calm presence helps the student feel safe.
- **Ask Permission:** Before touching or assisting, ask "How can I best help you right now?"
- **Maintain Dignity:** Do not make them feel ashamed for needing help.
- **Be Patient:** Listen carefully to their needs without interrupting.`);
    }
  };

  const simulateIncomingPing = () => {
    setActivePing({
      id: 'mock-id',
      requesterId: 'mock-requester',
      type: 'medical-aid' as HelpType,
      isAnonymous: true,
      additionalInfo: 'I have a severe headache and feeling dizzy near the library.',
      location: { lat: -26.2041, lng: 28.0473 },
      status: 'pending',
      acceptedBy: null,
      createdAt: Date.now(),
    });
  };

  return (
    <div className="p-5 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-text tracking-tight">Sync</h1>
          <p className="text-[10px] font-black text-muted uppercase tracking-widest">Campus Safety</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-muted uppercase tracking-widest">Anonymous</span>
          <button
            onClick={() => setIsAnonymous(!isAnonymous)}
            className={`w-10 h-5 rounded-full transition-all relative ${isAnonymous ? 'bg-primary' : 'bg-secondary'}`}
          >
            <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${isAnonymous ? 'left-6' : 'left-1'}`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {HELP_TYPES.map((type) => (
          <HelpCard
            key={type.id}
            title={type.title}
            description={type.description}
            icon={type.icon}
            color={type.color}
            onClick={() => setRequestModal({ show: true, type: type.id })}
          />
        ))}
      </div>

      {requestModal.show && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-[32px] p-6 space-y-6 shadow-2xl animate-in slide-in-from-bottom-8 duration-300">
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-text tracking-tight">Additional Info</h3>
              <p className="text-xs font-bold text-muted uppercase tracking-widest">Help us help you better.</p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-2">Notes (Optional)</label>
              <textarea
                className="w-full px-4 py-4 bg-secondary/30 border-[2.5px] border-border rounded-[24px] outline-none focus:border-primary transition-all font-bold text-sm min-h-[120px] resize-none"
                placeholder="e.g. I'm near the library entrance, wearing a red hoodie..."
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setRequestModal({ show: false, type: null });
                  setAdditionalInfo('');
                }}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestHelp}
                className="btn-primary flex-1"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="pastel-card bg-red-50 border-red-100 flex items-center gap-3 p-4">
        <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white shrink-0">
          <AlertCircle size={20} />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-sm text-text">Emergency Contact</h3>
          <p className="text-[10px] text-muted font-bold">
            {userProfile?.emergencyContact?.name || 'Campus Security'}
          </p>
        </div>
        <a 
          href={`tel:${userProfile?.emergencyContact?.phone || '10111'}`}
          className="bg-red-500 text-white px-3 py-1.5 rounded-lg font-black text-[10px] shadow-sm hover:bg-red-600 transition-all active:scale-95"
        >
          CALL
        </a>
      </div>

      {/* Simulation Button for Demo */}
      <div className="pt-2 opacity-50 hover:opacity-100 transition-opacity flex flex-col items-center gap-2">
        <button
          onClick={simulateIncomingPing}
          className="text-[10px] font-black text-muted uppercase tracking-widest hover:text-primary transition-colors"
        >
          Simulate Incoming Ping
        </button>
      </div>

      {userRequest && (
        <div className="pastel-card bg-lavender border-lavender-dark/20 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-lavender-dark">
                <Heart size={20} />
              </div>
              <div>
                <h3 className="font-black text-sm uppercase tracking-tight">Your Request</h3>
                <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">
                  {userRequest.status === 'pending' ? 'Waiting for Guardian...' : 
                   userRequest.status === 'accepted' ? 'Guardian is En Route!' : 
                   'Help has Arrived!'}
                </p>
              </div>
            </div>
            {userRequest.status === 'completed' && !userRequest.thankYouSent && (
              <button
                onClick={handleSayThankYou}
                className="bg-white text-lavender-dark px-3 py-1.5 rounded-lg font-black text-[10px] shadow-sm active:scale-95 transition-all"
              >
                SAY THANK YOU
              </button>
            )}
            {userRequest.thankYouSent && (
              <span className="text-[10px] font-black text-lavender-dark uppercase tracking-widest">
                Thanked! 💖
              </span>
            )}
          </div>
          {userRequest.status === 'accepted' && (
            <div className="bg-white/50 p-3 rounded-xl border border-lavender-dark/10">
              <p className="text-[10px] font-bold text-lavender-dark text-center">
                A guardian has accepted your request. Stay where you are.
              </p>
            </div>
          )}
        </div>
      )}

      {currentSync && (
        <div className="pastel-card bg-primary border-primary text-text p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary">
                <Shield size={20} />
              </div>
              <div>
                <h3 className="font-black text-sm uppercase tracking-tight">Active Sync</h3>
                <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Helping with {currentSync.type}</p>
              </div>
            </div>
            <button
              onClick={() => setShowTips('Active Tips')}
              className="text-[10px] font-black underline uppercase tracking-widest"
            >
              Tips
            </button>
          </div>
          <button
            onClick={handleCompleteSync}
            className="w-full bg-white text-primary font-black py-3 rounded-xl shadow-[0_4px_0_0_#FFD1DC] active:translate-y-1 active:shadow-none transition-all text-xs uppercase tracking-widest"
          >
            Complete Sync
          </button>
        </div>
      )}

      {activePing && (
        <RadarView
          type={activePing.type}
          additionalInfo={activePing.additionalInfo}
          onAccept={handleAcceptPing}
          onDecline={() => setActivePing(null)}
        />
      )}

      {showTips && (
        <GuardianTips
          initialContext={showTips}
          onClose={() => setShowTips(null)}
        />
      )}
    </div>
  );
}
