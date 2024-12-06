import { ethers } from 'ethers';
import WorkExperienceValidation from '../contract/WorkExperienceValidation.json';
import { contractAddress } from '../config';

export const connectEthereum = async()=>{
    if (typeof window.ethereum === 'undefined') {
        alert('Please install MetaMask.');
        return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(contractAddress, WorkExperienceValidation, signer);
}