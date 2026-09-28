import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import API from '../api/axiosInstance';
import { 
  User, 
  ShieldCheck, 
  Mail, 
  MapPin, 
  Calendar, 
  Briefcase, 
  Building2, 
  Camera, 
  Phone, 
  Hash, 
  IndianRupee 
} from 'lucide-react';

const Profile = () => {
  // Redux state se currently logged-in user ka data lena
  const { user } = useSelector((state) => state.auth);
  
  const [profileData, setProfileData] = useState(user || {});
  const [avatar, setAvatar] = useState(user?.avatar || '');

  // Backend se fresh aur real-time data fetch karna
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Backend ke standard profile routes try karna (jo aapke backend mein configured ho)
        const res = await API.get('/auth/me').catch(() => API.get('/users/me').catch(() => API.get('/auth/profile')));
        if (res.data) {
          const fetchedUser = res.data.user || res.data;
          setProfileData(fetchedUser);
          if (fetchedUser.avatar) setAvatar(fetchedUser.avatar);
        }
      } catch (err) {
        console.error('Failed to fetch profile data from backend:', err);
      }
    };
    fetchProfile();
  }, []);

  // 100% Dynamic Data Mapping (Strictly MongoDB / Redux Fields - No Hardcoding)
  const userName = profileData?.name || profileData?.fullName || user?.name || user?.fullName || '';
  const userEmail = profileData?.email || user?.email || '';
  const userRole = profileData?.role || user?.role || '';
  const userPhone = profileData?.phone || profileData?.phoneNumber || user?.phone || user?.phoneNumber || '';
  
  const userDesignation = profileData?.designation || user?.designation || '';
  const employeeCode = profileData?.employeeCode || profileData?.empCode || user?.employeeCode || user?.empCode || '';
  const address = profileData?.address || profileData?.location || user?.address || user?.location || '';
  const salary = profileData?.salary || user?.salary || '';
  
  const rawJoiningDate = profileData?.createdAt || profileData?.joiningDate || user?.createdAt || user?.joiningDate;
  const formattedJoiningDate = rawJoiningDate 
    ? new Date(rawJoiningDate).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : '';

  // Handle Photo Upload (Base64 state update)
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setAvatar(base64String);

        try {
          const storedUser = JSON.parse(localStorage.getItem('userInfo')) || {};
          storedUser.avatar = base64String;
          localStorage.setItem('userInfo', JSON.stringify(storedUser));
        } catch (err) {
          console.error('Failed to save avatar', err);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 h-36 px-8 flex items-end pb-4 relative">
          <div className="flex items-center gap-4 translate-y-8">
            <div className="relative group">
              <div className="w-24 h-24 rounded-2xl bg-white border-4 border-white shadow-md overflow-hidden flex items-center justify-center bg-indigo-50 text-indigo-600 font-bold text-4xl">
                {avatar ? (
                  <img src={avatar} alt="Profile Avatar" className="w-full h-full object-cover" />
                ) : (
                  userName ? userName.charAt(0).toUpperCase() : 'U'
                )}
              </div>
              <label 
                htmlFor="avatar-upload" 
                className="absolute inset-0 bg-black/40 text-white rounded-2xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] font-semibold"
                title="Upload Profile Picture"
              >
                <Camera size={20} className="mb-1" />
                Change Photo
              </label>
              <input 
                id="avatar-upload" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageUpload} 
              />
            </div>
          </div>
        </div>
        
        <div className="pt-12 px-8 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800">{userName || 'N/A'}</h1>
            <p className="text-xs text-slate-500 font-medium">
              {userDesignation || 'User'} {userRole ? `| Logged in as ${userRole}` : ''}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100 self-start sm:self-auto">
            <ShieldCheck size={14} /> System Verified Account
          </span>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Personal Information */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <User size={16} className="text-indigo-600" /> Account Information
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-xs text-slate-500 flex items-center gap-2"><User size={14} /> Full Name</span>
              <span className="text-xs font-semibold text-slate-800">{userName || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-xs text-slate-500 flex items-center gap-2"><Mail size={14} /> Email Address</span>
              <span className="text-xs font-semibold text-slate-800">{userEmail || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-xs text-slate-500 flex items-center gap-2"><Phone size={14} /> Phone Number</span>
              <span className="text-xs font-semibold text-slate-800">{userPhone || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Employment & Organization Details */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Briefcase size={16} className="text-indigo-600" /> Employment Details
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-xs text-slate-500 flex items-center gap-2"><Hash size={14} /> Employee Code</span>
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                {employeeCode || 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-xs text-slate-500 flex items-center gap-2"><Briefcase size={14} /> Designation</span>
              <span className="text-xs font-semibold text-slate-800">{userDesignation || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-xs text-slate-500 flex items-center gap-2"><Calendar size={14} /> Date of Joining</span>
              <span className="text-xs font-semibold text-slate-800">{formattedJoiningDate || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-xs text-slate-500 flex items-center gap-2"><IndianRupee size={14} /> Salary</span>
              <span className="text-xs font-semibold text-slate-800">
                {salary ? `₹ ${Number(salary).toLocaleString('en-IN')}` : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Company & Address Details */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:col-span-2">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Building2 size={16} className="text-indigo-600" /> Company & Address Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-xs text-slate-500 flex items-center gap-2"><Building2 size={14} /> Organization</span>
              <span className="text-xs font-semibold text-slate-800">LIN IN MICROCARE FOUNDATION</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-xs text-slate-500 flex items-center gap-2"><MapPin size={14} /> Branch/Location</span>
              <span className="text-xs font-semibold text-slate-800">Head Office</span>
            </div>
            <div className="flex items-start justify-between py-2 border-b border-slate-100 md:col-span-2">
              <span className="text-xs text-slate-500 flex items-center gap-2 mt-0.5"><MapPin size={14} /> Registered Address</span>
              <span className="text-xs font-semibold text-slate-800 text-right max-w-md">{address || 'N/A'}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;