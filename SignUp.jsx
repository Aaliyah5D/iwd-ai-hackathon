import React, { useState } from 'react';
import { auth, db } from './firebaseConfig'; // Your firebase config file
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    username: '',
    idNumber: '',
  });

  const [skills, setSkills] = useState({
    sasl: false,
    firstAid: false,
    disabilitySupport: false,
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 1. South African ID Validation Logic
  const validateSAID = (id) => {
    if (!/^\d{13}$/.test(id)) return { valid: false, msg: "ID must be 13 digits." };

    // Luhn Algorithm Check
    let nCheck = 0, bEven = false;
    for (let n = id.length - 1; n >= 0; n--) {
      let nDigit = parseInt(id.charAt(n), 10);
      if (bEven && (nDigit *= 2) > 9) nDigit -= 9;
      nCheck += nDigit;
      bEven = !bEven;
    }
    if ((nCheck % 10) !== 0) return { valid: false, msg: "Invalid SA ID (Checksum failed)." };

    // Gender Logic (7th to 10th digits)
    const genderDigits = parseInt(id.substring(6, 10));
    if (genderDigits >= 5000) {
      return { valid: false, msg: "Access restricted: This platform is for Female users only." };
    }

    return { valid: true };
  };

  // 2. University Email Validation Logic
  const validateUniversityEmail = (email) => {
    const domain = email.split('@')[1]?.toLowerCase();
    const allowedPatterns = [
      '.ac.za', // Standard for public SA universities
      'varsitycollege.co.za',
      'vega.co.za',
      'rosebankcollege.co.za',
      'milpark.ac.za'
    ];
    return allowedPatterns.some(pattern => domain?.endsWith(pattern));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setSkills(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Run Validations
    const idStatus = validateSAID(formData.idNumber);
    if (!idStatus.valid) {
      setError(idStatus.msg);
      setLoading(false);
      return;
    }

    if (!validateUniversityEmail(formData.email)) {
      setError("Please use a valid South African University email address.");
      setLoading(false);
      return;
    }

    try {
      // Create Auth User
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        "TemporaryPassword123!" // Usually you'd have a password field
      );
      
      const user = userCredential.user;

      // Save to Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: formData.name,
        surname: formData.surname,
        username: formData.username,
        idNumber: formData.idNumber,
        email: formData.email,
        skills: skills,
        createdAt: new Date()
      });

      alert("Welcome to SYNK!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSignup} style={styles.form}>
        <h1 style={styles.title}>SYNK</h1>
        <p style={styles.subtitle}>Identity & Security Gateway</p>

        {error && <p style={styles.error}>{error}</p>}

        <input style={styles.input} name="name" placeholder="Name" onChange={handleChange} required />
        <input style={styles.input} name="surname" placeholder="Surname" onChange={handleChange} required />
        <input style={styles.input} name="username" placeholder="Username" onChange={handleChange} required />
        <input style={styles.input} name="email" type="email" placeholder="University Email (@...ac.za)" onChange={handleChange} required />
        <input style={styles.input} name="idNumber" placeholder="13-Digit SA ID Number" onChange={handleChange} required />

        <div style={styles.skillsSection}>
          <h3 style={styles.skillsTitle}>Glow-up Skills</h3>
          <label><input type="checkbox" name="sasl" onChange={handleChange} /> SASL (Sign Language)</label>
          <label><input type="checkbox" name="firstAid" onChange={handleChange} /> First Aid</label>
          <label><input type="checkbox" name="disabilitySupport" onChange={handleChange} /> Disability Support</label>
        </div>

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Verifying...' : 'Secure Signup'}
        </button>
      </form>
    </div>
  );
};

// Basic Styling
const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f4f7f6', fontFamily: 'sans-serif' },
  form: { backgroundColor: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' },
  title: { textAlign: 'center', fontSize: '2rem', color: '#ff4081', margin: '0' },
  subtitle: { textAlign: 'center', color: '#666', marginBottom: '20px' },
  input: { width: '100%', padding: '12px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' },
  skillsSection: { margin: '20px 0', display: 'flex', flexDirection: 'column', gap: '8px' },
  skillsTitle: { fontSize: '1rem', color: '#333', marginBottom: '5px' },
  button: { width: '100%', padding: '14px', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  error: { color: 'red', fontSize: '0.85rem', marginBottom: '10px', textAlign: 'center' }
};

export default Signup;
