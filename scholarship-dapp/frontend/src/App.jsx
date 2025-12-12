import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useScholarship } from './hooks/useScholarship';
import AdminDashboard from './components/AdminDashboard';
import StudentPortal from './components/StudentPortal';

// Wallet Icon (Keep this for the Navbar)
const WalletIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
      <path d="M4 6v12a2 2 0 0 0 2 2h14v-4" />
      <path d="M18 12a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2v-8h-2Z" />
    </svg>
);

function App() {
  const { account, contract, isOwner, connectWallet } = useScholarship();

  return (
    // Updated background to be a solid dark blue/black for a cleaner "space" look
    <div className="min-h-screen bg-black text-white selection:bg-purple-500 selection:text-white relative">
      
      {/* Subtle radial gradient for a deep space effect */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-black via-slate-950 to-black opacity-90"></div>

      {/* Navbar (Kept largely the same, removed fixed position padding adjustment) */}
      {/* We are modifying the header to be simpler, like the image */}
      <nav className="relative w-full z-20 pt-8 border-b border-white/10 max-w-7xl mx-auto px-6">
        <div className="pb-8 flex justify-between items-center">
          {/* Left: Scholarship Dapp Title */}
          <div className="flex items-center">
            <h1 className="text-sm md:text-md font-extrabold tracking-[0.5em] text-white/80 uppercase">
              SCHOLARSHIP DAPP
            </h1>
          </div>

          {/* Right Side - Connect Wallet */}
          <div className="flex justify-end">
            <button 
              onClick={connectWallet} 
              // Using a subtle button for the navbar connect action
              className="group relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 backdrop-blur-sm transition-all duration-300"
            >
              <WalletIcon className="w-4 h-4 text-purple-300 group-hover:text-purple-200 transition-colors" />
              <span className="font-medium text-xs tracking-wide text-white/90">
                {account ? (
                  <span className="flex items-center gap-2 font-mono text-purple-200">
                    <span className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.5)]"></span>
                    {account.slice(0, 4)}...{account.slice(-3)}
                  </span>
                ) : "Connect Wallet"}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="relative z-10 pt-16 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          
          {!account ? (
            // =======================================================
            // REDESIGNED HERO SECTION (MATCHING YOUR IMAGE)
            // =======================================================
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-5xl mx-auto">
                
                {/* Subtitle */}
                <span className="inline-block text-xs font-semibold tracking-[0.5em] uppercase text-white/40 mb-1">
                    -DECENTRALIZED EDUCATION FUNDING
                </span>

                {/* Primary Headline (Huge, Bold, High Contrast) */}
                <h2 className="text-7xl md:text-9xl font-extrabold mb-8 leading-none tracking-tighter">
                    Funding the <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-green-400 to-purple-400">
                        Next Generation
                    </span>

                </h2>

                {/* Subtitle/Description */}
                <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
                    A transparent, secure, and automated scholarship platform powered by blockchain technology. 
                    Connect your wallet to apply or manage funds.
                </p>
                
                {/* CTA Button - Use the 'GET STARTED' simple box style */}
                <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                    <button 
                        onClick={connectWallet}
                        className="group relative px-10 py-3 border border-white text-white font-semibold text-lg hover:border-white transition-all duration-300 tracking-widest"
                    >
                        GET STARTED
                    </button>
                </div>
            </div>
            
          ) : (
            // =======================================================
            // CONNECTED STATE (Dashboard/Portal)
            // =======================================================
            <div className="animate-fade-in-up max-w-7xl mx-auto">
               <div className="glass-card rounded-3xl p-1 md:p-8 overflow-hidden relative">
                 {/* Inner Content Container */}
                 <div className="relative z-10">
                   {isOwner ? (
                     <AdminDashboard contract={contract} />
                   ) : (
                     <StudentPortal contract={contract} account={account} />
                   )}
                 </div>
               </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer position="bottom-right" theme="dark" toastClassName="!bg-slate-800 !text-white !rounded-xl !shadow-2xl" />
    </div>
  );
}

export default App;