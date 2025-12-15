import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';

// Icons
const EthIcon = () => (<span className="text-xl font-bold">Ξ</span>);
const StudentsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);
const PlusIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>);

// Stat Card
const StatCard = ({ title, value, unit, iconType, statusComponent }) => {
    let icon, iconBg, iconText;

    if (iconType === 'ETH') {
        icon = <EthIcon />;
        iconBg = 'bg-blue-50';
        iconText = 'text-blue-600';
    } else if (iconType === 'STUDENTS') {
        icon = <StudentsIcon />;
        iconBg = 'bg-purple-50';
        iconText = 'text-purple-600';
    } else {
        icon = iconType;
        iconBg = 'bg-gray-50';
        iconText = 'text-gray-600';
    }

    const valueDisplay = statusComponent ? statusComponent : (
        <p className="text-4xl font-extrabold text-gray-900 mt-1">
            {value} <span className="text-lg text-gray-400 font-normal">{unit}</span>
        </p>
    );

    return (
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 flex items-center justify-between transition-shadow hover:shadow-2xl">
            <div>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">{title}</p>
                {valueDisplay}
            </div>
            <div className={`w-14 h-14 ${iconBg} rounded-full flex items-center justify-center text-xl font-bold ${iconText}`}>
                {icon}
            </div>
        </div>
    );
};

// Form Input
const FormInput = ({ label, placeholder, value, onChange, type = "text", step = "", required = true, isMono = false }) => {
    const monoClass = isMono ? 'font-mono text-sm' : '';
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input 
                placeholder={placeholder} 
                value={value} 
                onChange={onChange} 
                type={type}
                step={step}
                className={`w-full border border-gray-200 p-3 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 outline-none transition-all duration-200 text-gray-800 ${monoClass}`} 
                required={required} 
            />
        </div>
    );
};

// Button
const Button = ({ children, onClick, variant = 'primary', disabled = false, className = '' }) => {
    const baseStyles = "relative inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg";

    const variants = {
        primary: "bg-purple-600 hover:bg-purple-700 text-white shadow-purple-200/50",
        success: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200/50",
        danger: "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-200/50",
        secondary: "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200/50",
        warning: "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200/50",
        disabled: "bg-gray-100 text-gray-400 cursor-not-allowed shadow-inner hover:!translate-y-0 !shadow-none",
    };

    const styleClass = disabled ? variants.disabled : variants[variant] || variants.primary;
    
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${styleClass} ${className}`}
        >
            {children}
        </button>
    );
};

// =========================================================
// AdminDashboard Component Logic
// =========================================================

const AdminDashboard = ({ contract }) => {
    const [students, setStudents] = useState([]);
    const [balance, setBalance] = useState('0');
    const [isPaused, setIsPaused] = useState(false);
    const [newStudent, setNewStudent] = useState({ name: '', address: '', amount: '' });
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        if (!contract) return;
        setLoading(true);
        try {
            // Updated to use pagination (fetching first 100 for now)
            const _students = await contract.getStudents(0, 100); 
            setStudents(_students);
            const _balance = await contract.getContractBalance();
            setBalance(ethers.formatEther(_balance));
            const _paused = await contract.paused();
            setIsPaused(_paused);
        } catch (error) {
            console.error("Error fetching admin data:", error);
            toast.error("Failed to load dashboard data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [contract]);

    const handleAddStudent = async (e) => {
        e.preventDefault();
        try {
            const tx = await contract.addStudent(
                newStudent.name,
                newStudent.address,
                ethers.parseEther(newStudent.amount)
            );
            toast.info("Sending transaction...", { autoClose: 3000 });
            await tx.wait();
            toast.success("Student added successfully!");
            fetchData();
            setNewStudent({ name: '', address: '', amount: '' });
        } catch (error) {
            console.error(error);
            const reason = error.reason || error.message;
            toast.error(`Failed to add student: ${reason.split('(')[0].trim()}`);
        }
    };

    const handleDeposit = async () => {
        const amount = prompt("Enter amount to deposit (ETH):");
        if (!amount || isNaN(parseFloat(amount))) return;
        try {
            const tx = await contract.depositFunds({ value: ethers.parseEther(amount) });
            toast.info("Processing deposit...", { autoClose: 3000 });
            await tx.wait();
            toast.success(`${amount} ETH deposited!`);
            fetchData();
        } catch (error) {
            console.error(error);
            toast.error("Deposit failed.");
        }
    };

    const handleWithdraw = async () => {
        if (balance === '0') {
            toast.info("Contract balance is zero. Nothing to withdraw.");
            return;
        }
        if (!window.confirm(`Are you sure you want to withdraw ALL ${balance} ETH from the contract?`)) return;

        try {
            const tx = await contract.withdrawFunds();
            toast.info("Initiating withdrawal...", { autoClose: 3000 });
            await tx.wait();
            toast.success("Funds withdrawn successfully!");
            fetchData();
        } catch (error) {
            console.error(error);
            toast.error("Withdrawal failed. Check transaction details.");
        }
    }

    const togglePause = async () => {
        try {
            const action = isPaused ? "Unpausing" : "Pausing";
            const tx = isPaused ? await contract.unpause() : await contract.pause();
            toast.info(`${action} contract...`, { autoClose: 3000 });
            await tx.wait();
            toast.success(isPaused ? "Contract Unpaused! Claims are now active." : "Contract Paused! Claims are suspended.");
            fetchData();
        } catch (error) {
            console.error(error);
            toast.error("Action failed.");
        }
    }

    if (loading) return (
        <div className="flex justify-center items-center min-h-[40vh] text-slate-300">
            <svg className="animate-spin h-8 w-8 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="ml-3 text-lg">Loading Admin Dashboard...</span>
        </div>
    );

    return (
        <div className="space-y-10 animate-fade-in-up">
            {/* Header and Primary Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-gray-100">
                <h2 className="text-3xl font-extrabold text-gray-900">Platform Overview</h2>
                <div className="flex flex-wrap gap-3">
                    <Button onClick={handleDeposit} variant="success">
                        <PlusIcon /> Deposit Funds
                    </Button>
                    <Button onClick={handleWithdraw} variant="danger">
                        Withdraw All
                    </Button>
                    <Button 
                        onClick={togglePause} 
                        variant={isPaused ? 'secondary' : 'warning'}
                    >
                        {isPaused ? "▶ Unpause" : "⏸ Pause Claims"}
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    title="Total Contract Balance" 
                    value={balance} 
                    unit="ETH" 
                    iconType="ETH" 
                />
                <StatCard 
                    title="Registered Scholars" 
                    value={students.length} 
                    unit="" 
                    iconType="STUDENTS"
                />
                <StatCard 
                    title="Contract Status" 
                    iconType={isPaused ? '🛑' : '✅'}
                    statusComponent={
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold mt-2 ${isPaused ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                            <span className={`w-2.5 h-2.5 rounded-full ${isPaused ? 'bg-rose-500' : 'bg-emerald-500'} shadow-sm`}></span>
                            {isPaused ? "Paused" : "Active"}
                        </div>
                    }
                />
            </div>
            

            {/* Add Student Form & Students List */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                
                {/* 1. Add Student Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 h-full">
                        <h3 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-3">
                            Grant New Scholarship
                        </h3>
                        <form onSubmit={handleAddStudent} className="space-y-4">
                            <FormInput 
                                label="Scholar's Full Name"
                                placeholder="e.g. Alice Smith" 
                                value={newStudent.name} 
                                onChange={(e) => setNewStudent({...newStudent, name: e.target.value})} 
                            />
                            <FormInput 
                                label="Wallet Address"
                                placeholder="0x..." 
                                value={newStudent.address} 
                                onChange={(e) => setNewStudent({...newStudent, address: e.target.value})} 
                                isMono={true} // Add font-mono for addresses
                            />
                            <FormInput 
                                label="Amount (ETH)"
                                placeholder="0.0" 
                                type="number" 
                                step="0.001"
                                value={newStudent.amount} 
                                onChange={(e) => setNewStudent({...newStudent, amount: e.target.value})} 
                            />
                            <Button type="submit" variant="primary" className="w-full mt-4 !text-lg">
                                Grant Scholarship
                            </Button>
                        </form>
                    </div>
                </div>

                {/* 2. Students List Table */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-xl font-bold text-gray-800">Registered Scholars ({students.length})</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        {/* Name column removed as it is not stored on-chain anymore */}
                                        <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Wallet Address</th>
                                        <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Amount</th>
                                        <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {students.length === 0 ? (
                                        <tr>
                                            <td colSpan="3" className="p-10 text-center text-gray-500 bg-white">
                                                No students registered yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        students.map((s, i) => (
                                        <tr key={i} className="group hover:bg-gray-50 transition-colors">
                                            <td className="p-4 text-gray-500 font-mono text-xs">
                                                {s.walletAddress.slice(0,6)}...{s.walletAddress.slice(-4)}
                                            </td>
                                            <td className="p-4 font-bold text-gray-900 text-right">
                                                {ethers.formatEther(s.amount)} <span className="text-gray-400 font-normal">ETH</span>
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${s.hasClaimed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {s.hasClaimed ? 'Claimed' : 'Pending'}
                                                </span>
                                            </td>
                                        </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;