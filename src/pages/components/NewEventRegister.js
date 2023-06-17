import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { readContract, prepareWriteContract, writeContract } from '@wagmi/core';
import { useRouter } from 'next/router';
import abi from '../../contract-abi.json';
import abi1 from '../../contract-abi1.json';
import abi3 from '../../contract-abi3.json';
import { NFTStorage } from 'nft.storage';
import { waitForTransaction } from '@wagmi/core';
import { ethers } from 'ethers';

const NewEventRegister = () => {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [isNewRegistered, setIsNewRegistered] = useState(false);
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [metadataURL, setMetadataURL] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    const checkIfRegistered = async () => {
      if (!isConnected || !address) {
        console.log('Wallet not connected');
        return;
      }
  
      const result = await readContract({
        address: '0x0FD831cb538F0452B84D6848EC905D8ECb05DEc7',
        abi: abi,
        functionName: 'factories',
        args: [address],
      });
  
      const event = await readContract({
        address: result,
        abi: abi1,
        functionName: 'getCurrentEventNFT',
      });
  
      const duration = await readContract({
        address: event,
        abi: abi3,
        functionName: 'getDuration',
      });
  
      // Get current unix timestamp
      const currentTime = Math.floor(Date.now() / 1000);
      console.log(currentTime);
      console.log(duration);
  
      if (currentTime < duration) {
        setIsNewRegistered(true);
        router.push(`/profile/${address}`);
      } else {
        setIsNewRegistered(false);
      }
    };
  
    checkIfRegistered();
  }, [address, isConnected, router]);
  

  const onSubmit = async (e) => {
    e.preventDefault();

    const client = new NFTStorage({ token: process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY });
    
    const nftMetadata = {
        name: name,
        description: description,
        image: file,
    };
    
    const metadata = await client.store(nftMetadata);
    
    const cid = metadata.url.split("ipfs://")[1];
    const metadataUrl = `https://ipfs.io/ipfs/${cid}`;
    
    setMetadataURL(metadataUrl);

    const metadataResponse = await fetch(metadataUrl);
    const metadataJson = await metadataResponse.json();
    
    const imageIpfsUrl = metadataJson.image;
    const imageHttpUrl = imageIpfsUrl.replace('ipfs://', 'https://ipfs.io/ipfs/');
    
    setImageURL(imageHttpUrl);

    const factoryContractAddress = await readContract({
      address: '0x0FD831cb538F0452B84D6848EC905D8ECb05DEc7',
      abi: abi,
      functionName: 'factories',
      args: [address],
    });

    const priceInWei = ethers.utils.parseEther(price);

    console.log(typeof factoryContractAddress ,factoryContractAddress);
    console.log(typeof priceInWei);
    console.log(typeof metadataUrl);

    const { request: requestCreateProfileNFT } = await prepareWriteContract({
      address: factoryContractAddress,
      abi: abi1,
      functionName: 'createEventNFT',
      chainId:11155111,
      args: [metadataUrl,1000,1000000000000000,20], // metadataUrl is used here
    });

    console.log(requestCreateProfileNFT);

    const { hash: createProfileNFTHash } = await writeContract(requestCreateProfileNFT);

    if (createProfileNFTHash) {
      router.push(`/profile/${address}`);
    } else {
      console.log('createProfileNFT execution failed');
    }
  
};
   

  return (
<div className="flex flex-col items-center justify-center min-h-screen py-2">
  {isConnected ? (
    isNewRegistered ? (
      <p>You are already registered</p>
    ) : (
      <form className="w-full max-w-sm" onSubmit={onSubmit}>
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="inline-full-name">
              Upload Image
            </label>
          </div>
          <div className="md:w-2/3">
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} required />
          </div>
        </div>
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="inline-full-name">
              Name
            </label>
          </div>
          <div className="md:w-2/3">
            <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" type="text" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
        </div>
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="inline-full-name">
              Description
            </label>
          </div>
          <div className="md:w-2/3">
            <textarea className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" placeholder="Enter description" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
          </div>
        </div>
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="inline-full-name">
              Duration
            </label>
          </div>
          <div className="md:w-2/3">
            <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" type="text" placeholder="Enter duration" value={duration} onChange={(e) => setDuration(e.target.value)} required />
          </div>
        </div>
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="inline-full-name">
              Price
            </label>
          </div>
          <div className="md:w-2/3">
            <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" type="text" placeholder="Enter price" value={price} onChange={(e) => setPrice(e.target.value)} required />
          </div>
        </div>
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="inline-full-name">
              Amount
            </label>
          </div>
          <div className="md:w-2/3">
            <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" type="text" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          </div>
        </div>
        <div className="md:flex md:items-center">
          <div className="md:w-1/3"></div>
          <div className="md:w-2/3">
            <button className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="submit">
              Register
            </button>
          </div>
        </div>
      </form>
    )
  ) : (
    <p>Connect your wallet</p>
  )}
</div>



  );
};

export default NewEventRegister;
