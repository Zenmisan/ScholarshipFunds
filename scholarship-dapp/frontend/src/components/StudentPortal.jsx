import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';

// Icon component (for consistency, you can move this to a ui/icons file later)
const GraduationCapIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.42 10.96V14L12 19L2.58 14V10.96"/>
    <path d="M22 8.5L12 3L2 8.5"/>
    <path d="M7.5 14L2 11.5"/>
    <path d="M12 19L12 3"/>
    <path d="M16.5 14L22 11.5"/>
    <path d="M16 8L16 11.5"/>
    <path d="M8 8L8 11.5"/>
  </svg>
);

const StudentPortal = ({ contract, account }) => {
  const [studentInfo, setStudentInfo] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state for better UX

  const fetchStudentData = useCallback(async () => {
    if (!contract || !account) return;
    setLoading(true);
    try {
      const info = await contract.getStudent(account);
      // Check if actually registered
      if (info.isRegistered) {
        setStudentInfo(info);
      } else {
        setStudentInfo(null);
      }
    } catch (error) {
      console.error("Error fetching student info:", error);
      setStudentInfo(null);
      toast.error("Failed to load student data.");
    } finally {
      setLoading(false);
    }
  }, [contract, account]);

  useEffect(() => {
    fetchStudentData();
  }, [fetchStudentData]);

  const handleClaim = async () => {
    try {
      toast.info("Preparing transaction...", { autoClose: 3000 });
      const tx = await contract.claimScholarship();
      toast.info("Transaction sent. Waiting for confirmation...", { autoClose: false });
      await tx.wait();
      toast.success("Scholarship claimed successfully!");
      fetchStudentData();
    } catch (error) {
      console.error(error);
      // More user-friendly error display
      const reason = error.reason || error.message || "Unknown Error";
      toast.error(`Claim failed: ${reason.split('(')[0].trim()}`);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[40vh] text-slate-300">
        <svg className="animate-spin h-8 w-8 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="ml-3 text-lg">Loading Student Data...</span>
    </div>
  );

  if (!studentInfo) return (
    <div className="bg-white/5 rounded-3xl shadow-lg backdrop-blur-md border border-white/10 p-12 text-center max-w-lg mx-auto transform hover:scale-[1.01] transition-transform duration-300">
      <GraduationCapIcon className="w-16 h-16 mx-auto text-blue-400 mb-6 opacity-80" />
      <h3 className="text-2xl font-bold text-white mb-3">Wallet Not Registered</h3>
      <p className="text-slate-400 text-lg">
        This address is not currently associated with an active scholarship. Please contact the administrator if you believe this is an error.
      </p>
    </div>
  );

  // Main Registered Student UI
  return (
    <div className="max-w-2xl mx-auto">
      {/* Main Content Card: Clean White Container */}
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden relative p-8 md:p-12">
        
        {/* Header Section */}
        <div className="relative z-10 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto shadow-lg flex items-center justify-center text-3xl mb-5 text-white transform rotate-3">
                🎓
            </div>
            
            <h2 className="text-3xl font-extrabold text-gray-900 mb-1">{studentInfo.name}</h2>
            <p className="text-gray-500 font-mono text-sm mb-10 tracking-wider">
              <span className="text-gray-400">Address:</span> {account.slice(0, 6)}...{account.slice(-4)}
            </p>
        </div>

        {/* Financial Stat Card */}
        <div className="bg-gray-50 rounded-2xl p-6 md:p-8 mb-10 border border-gray-100 shadow-inner">
            <p className="text-sm font-semibold text-purple-600 uppercase tracking-widest mb-3">Scholarship Allocation</p>
            <div className="text-6xl font-extrabold mb-3">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    {ethers.formatEther(studentInfo.amount)}
                </span>
                <span className="text-2xl text-gray-400 ml-2">ETH</span>
            </div>
            
            {/* Status Badge */}
            <div className="flex justify-center mt-4">
                <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-md ${studentInfo.hasClaimed ? 'bg-green-50 text-green-700 ring-2 ring-green-200' : 'bg-amber-50 text-amber-700 ring-2 ring-amber-200'}`}>
                    {studentInfo.hasClaimed ? '✓ Claimed Successfully' : '⏳ Ready to Claim'}
                </span>
            </div>
        </div>

        {/* Action Button */}
        {!studentInfo.hasClaimed ? (
            <button 
                onClick={handleClaim} 
                className="w-full relative group flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xl font-bold px-8 py-5 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-xl shadow-purple-200/50 hover:shadow-purple-400/50 transform hover:-translate-y-1"
            >
                <GraduationCapIcon className="w-6 h-6" />
                Claim Scholarship Now
            </button>
        ) : (
            <button disabled className="w-full bg-gray-100 text-gray-400 text-xl font-bold px-8 py-5 rounded-xl cursor-not-allowed border border-gray-200 shadow-inner">
                Scholarship Claimed
            </button>
        )}
      </div>
    </div>
  );
};

export default StudentPortal;