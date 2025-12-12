import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../constants';
import { toast } from 'react-toastify';

export const useScholarship = () => {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        
        const _provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(_provider);
        
        const signer = await _provider.getSigner();
        const _contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        setContract(_contract);

        // Check if owner
        try {
            const owner = await _contract.owner();
            setIsOwner(owner.toLowerCase() === accounts[0].toLowerCase());
        } catch (e) {
            console.error("Error fetching owner:", e);
        }

      } catch (error) {
        console.error("Error connecting wallet:", error);
        toast.error("Failed to connect wallet");
      }
    } else {
      toast.error("Please install MetaMask!");
    }
  };

  useEffect(() => {
    if (window.ethereum) {
        window.ethereum.on('accountsChanged', (accounts) => {
            setAccount(accounts[0]);
            window.location.reload();
        });
    }
  }, []);

  return { account, contract, provider, isOwner, connectWallet, loading, setLoading };
};
