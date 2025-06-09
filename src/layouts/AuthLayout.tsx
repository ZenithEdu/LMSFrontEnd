import React from 'react';
import { Outlet } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left side branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 flex-col justify-center items-center p-12 relative">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/2041540/pexels-photo-2041540.jpeg')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10 max-w-md text-center">
          <GraduationCap className="h-20 w-20 text-white mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-white mb-6">Zen-LMS</h1>
          <p className="text-white text-xl opacity-90 mb-8">
            Empowering educational institutions with smart technology to manage learning resources effectively.
          </p>
          <div className="space-y-4 text-left bg-white/10 p-6 rounded-lg backdrop-blur-sm">
            <h2 className="text-white text-lg font-medium">Trusted by top institutions</h2>
            <ul className="text-white/80 space-y-2">
              <li className="flex items-center">
                <span className="mr-2">•</span> Streamlined batch management
              </li>
              <li className="flex items-center">
                <span className="mr-2">•</span> Centralized resource library
              </li>
              <li className="flex items-center">
                <span className="mr-2">•</span> Intuitive student access
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Right side content */}
      <div className="w-full lg:w-1/2 flex justify-center items-center p-8">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;