import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Mail, AlertCircle } from 'lucide-react';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const verifyEmail = async (email: string) => {
    try {
      const response = await axios.post('https://lmsbackend-3l0h.onrender.com/api/auth/reset/verify-email', {
        email
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Email verification failed');
    }
  };

  // const sendResetPasswordLink = async (email: string) => {
  //   try {
  //     const response = await axios.post('https://lmsbackend-3l0h.onrender.com/api/auth/reset/forgot-password', {
  //       email
  //     });
  //     return response.data;
  //   } catch (error: any) {
  //     throw new Error(error.response?.data?.message || 'Failed to send reset link');
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Email is required');
      return;
    }

    setIsSubmitting(true);

    try {
      // First verify email
      await verifyEmail(email);
      setIsEmailVerified(true);

      // If email is verified, send reset link
    
      toast.success('Password reset link has been sent to your email');
      setEmail('');
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message || 'Failed to process request');
      setIsEmailVerified(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Forgot Password</h1>
      <p className="text-sm text-gray-600 mb-6">
        Enter your email address below, and we'll send you a link to reset your password.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter your email"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
