'use client';

import { useState } from 'react';
import SignupForm from '@/components/SignupForm';
import LoginForm from '@/components/LoginForm';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{background: 'radial-gradient(ellipse at 70% 20%, #7b2ff2 0%, #1e003a 60%, #0a0613 100%)'}}>
      {/* Space/planet background effect */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute right-[-15vw] top-[-10vw] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-[#a18aff] to-[#7b2ff2] opacity-40 blur-3xl" />
        <div className="absolute left-[-10vw] bottom-[-10vw] w-[40vw] h-[40vw] rounded-full bg-gradient-to-br from-[#7b2ff2] to-[#0a0613] opacity-30 blur-2xl" />
      </div>
      <div className="relative z-10 w-full max-w-md mx-auto">
        <div className="backdrop-blur-lg bg-white/10 border border-white/10 rounded-2xl shadow-2xl p-8">
          {mode === 'login' ? <LoginForm /> : <SignupForm />}
          <div className="mt-6 text-center">
            {mode === 'login' ? (
              <>
                <span className="text-gray-300">New to the app? </span>
                <button className="text-purple-400 hover:underline font-semibold" onClick={() => setMode('signup')}>Join Now</button>
              </>
            ) : (
              <>
                <span className="text-gray-300">Already have an account? </span>
                <button className="text-purple-400 hover:underline font-semibold" onClick={() => setMode('login')}>Sign In</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
