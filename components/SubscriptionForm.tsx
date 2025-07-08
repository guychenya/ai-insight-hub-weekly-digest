import React, { useState, useEffect } from 'react';
import { IconCheckCircle } from './IconComponents';
import { User } from '../types';

interface SubscriptionFormProps {
  user: User | null;
}

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({ user }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'subscribed' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(user?.receivesDigestEmails ?? false);

  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      setIsSubscribed(user.receivesDigestEmails ?? false);
    } else {
      setEmail('');
      setIsSubscribed(false);
    }
    setStatus('idle');
  }, [user]);

  const handleToggleSubscription = async () => {
    setStatus('loading');
    setMessage('');
    try {
      const response = await fetch('/.netlify/functions/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, subscribed: !isSubscribed }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'An unexpected error occurred.');
      
      setIsSubscribed(!isSubscribed);
      setStatus('subscribed');
      setTimeout(() => setStatus('idle'), 3000);

    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Failed to update subscription.');
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) return handleToggleSubscription();

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }
    
    setStatus('loading');
    setMessage('');
    try {
      const response = await fetch('/.netlify/functions/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
         throw new Error("Received an invalid response from the server. Please check the function logs.");
      }
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'An unexpected error occurred.');
      
      setStatus('subscribed');

    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Failed to subscribe. Please try again.');
    }
  };

  if (status === 'subscribed' && !user) {
    return (
      <div className="text-center p-6 bg-green-900/50 border border-green-500 rounded-lg animate-fade-in">
        <IconCheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-white">Thank you for subscribing!</h3>
        <p className="text-green-300 mt-2">You're now on the list to receive the AI Insight Hub Weekly Digest.</p>
      </div>
    );
  }

  return (
    <div className="text-center p-8 bg-gray-800 border border-gray-700 rounded-xl shadow-inner">
      <h3 className="text-2xl font-bold text-white">Stay in the Loop</h3>
      <p className="text-gray-400 mt-2 mb-2">
        {user ? `You are logged in as ${user.email || user.githubUsername}.` : 'Subscribe to receive the top trending AI projects in your inbox every week.'}
      </p>
      <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3 mb-6">
        <p className="text-yellow-300 text-xs">
          📧 <strong>Demo Notice:</strong> This is a demonstration subscription form. 
          While functional, this showcases the subscription flow using Vibe-Coding methodologies.
        </p>
      </div>
      
      {user ? (
         <div className="flex flex-col items-center gap-3">
            <button
              onClick={handleToggleSubscription}
              disabled={status === 'loading'}
              className={`px-8 py-4 font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                isSubscribed
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {status === 'loading' ? 'Updating...' : (isSubscribed ? 'Unsubscribe from Digest' : 'Subscribe to Digest')}
            </button>
            {status === 'subscribed' && <p className="text-green-400 text-sm mt-2">Subscription updated successfully!</p>}
         </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            className="flex-grow px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            aria-label="Email for subscription"
            disabled={status === 'loading'}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 transition-colors disabled:bg-blue-800 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
      )}

      {status === 'error' && <p className="text-red-400 mt-3 text-sm">{message}</p>}
    </div>
  );
};

export default SubscriptionForm;
