import React, { useState } from 'react';
import { userService } from '../services/databaseService';
import CompanyLogo from './CompanyLogo';
import lungsLogo from '../lungs.png';

interface LoginPageProps {
  onLoginSuccess: (user: any) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [asthmaType, setAsthmaType] = useState('');
  const [severity, setSeverity] = useState('');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    try {
      const user = await userService.loginUser(phone, password);
      localStorage.setItem('currentUser', JSON.stringify(user));
      onLoginSuccess(user);
    } catch (err) {
      setError('Invalid phone number or password.');
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!name || !email || !phone || !password || !dateOfBirth || !gender || !asthmaType || !severity) {
      setError('Please fill in all fields.');
      setIsLoading(false);
      return;
    }

    try {
      const newUser = await userService.signupUser({
        name,
        email,
        phone,
        password,
        dateOfBirth,
        gender,
        asthmaType,
        severity,
      });
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      onLoginSuccess(newUser);
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to create account.';
      console.error('Signup error:', errorMsg);
      setError(errorMsg);
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (isSignUp) await handleSignUp();
    else await handleSignIn();
  };

  const toggleFormMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setName('');
    setEmail('');
    setPhone('');
    setPassword('');
    setDateOfBirth('');
    setGender('');
    setAsthmaType('');
    setSeverity('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-cyan-50 to-sky-50 flex items-center">
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
        <div className="hidden md:flex flex-col justify-center p-12 rounded-3xl bg-gradient-to-b from-teal-600 to-cyan-500 text-white">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-white/20 rounded-full">
              <CompanyLogo src={lungsLogo} className="h-20 w-20" alt="Asthma Health logo" />
            </div>
            <div>
              <h2 className="text-4xl font-extrabold">Asthma Health</h2>
              <p className="mt-2 text-lg font-medium text-white/90">Smart asthma monitoring & guidance</p>
            </div>
          </div>

          <div className="mt-8 text-white/90 space-y-4">
            <p className="text-lg">Personalized insights • Peak flow tracking • Rescue guidance</p>
            
          </div>

          <div className="mt-8">
            <img src={lungsLogo} alt="lungs" className="mt-180 h-180 w-180 opacity-98" />
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-lg">
              <div className="text-center mb-6">
                <CompanyLogo src={lungsLogo} className="h-12 w-12 mx-auto" alt="Asthma Health logo" />
                <h1 className="text-2xl font-bold text-slate-800 mt-4">Sign in to Asthma Health</h1>
                <p className="text-sm text-slate-500 mt-1">Access your asthma dashboard and reports</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignUp && (
                  <>
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                      <input id="name" name="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded-md p-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400" placeholder="Alex Doe" />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                      <input id="email" name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded-md p-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400" placeholder="you@example.com" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="dob" className="block text-sm font-medium text-slate-700 mb-2">Date of Birth</label>
                        <input id="dob" name="dob" type="date" required value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded-md p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400" />
                      </div>
                      <div>
                        <label htmlFor="gender" className="block text-sm font-medium text-slate-700 mb-2">Gender</label>
                        <select id="gender" value={gender} onChange={(e) => setGender(e.target.value)} required className="w-full bg-slate-50 border border-slate-300 rounded-md p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400">
                          <option value="">Select</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="asthmaType" className="block text-sm font-medium text-slate-700 mb-2">Asthma Type</label>
                        <select id="asthmaType" value={asthmaType} onChange={(e) => setAsthmaType(e.target.value)} required className="w-full bg-slate-50 border border-slate-300 rounded-md p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400">
                          <option value="">Select</option>
                          <option value="Allergic Asthma">Allergic Asthma</option>
                          <option value="Exercise-Induced">Exercise-Induced</option>
                          <option value="Occupational Asthma">Occupational Asthma</option>
                          <option value="Seasonal Asthma">Seasonal Asthma</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="severity" className="block text-sm font-medium text-slate-700 mb-2">Severity</label>
                        <select id="severity" value={severity} onChange={(e) => setSeverity(e.target.value)} required className="w-full bg-slate-50 border border-slate-300 rounded-md p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400">
                          <option value="">Select</option>
                          <option value="Mild">Mild</option>
                          <option value="Moderate">Moderate</option>
                          <option value="Severe">Severe</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                  <input id="phone" name="phone" type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded-md p-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400" placeholder="1234567890" />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">Passcode</label>
                  <input id="password" name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded-md p-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400" placeholder="••••••••" />
                </div>

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <div>
                  <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 focus:ring-teal-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors">{isLoading ? (isSignUp ? 'Creating...' : 'Signing in...') : (isSignUp ? 'Create Account' : 'Sign In')}</button>
                </div>

                <div className="text-center">
                  <button type="button" onClick={toggleFormMode} className="text-sm font-medium text-teal-600 hover:text-teal-500">{isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Create one"}</button>
                </div>
              </form>

              {!isSignUp && (
                <div className="text-center mt-4 text-xs text-slate-500">
                  <p>Demo Credentials:</p>
                  <p>Phone: <span className="font-mono">5551234567</span> | Password: <span className="font-mono">SecurePass123!</span></p>
                  <p className="mt-2">Or use any credentials from the database</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
