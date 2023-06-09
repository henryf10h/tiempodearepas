import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { readContract, prepareWriteContract, writeContract  } from '@wagmi/core';
import { useRouter } from 'next/router';
import abi from '../../contract-abi.json';
import abi1 from '../../contract-abi1.json';
import { NFTStorage } from 'nft.storage';
import { waitForTransaction } from '@wagmi/core'


const Register = () => {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [isRegistered, setIsRegistered] = useState(false);
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [metadataURL, setMetadataURL] = useState(null); // add this line
  const [imageURL, setImageURL] = useState(null); // add this line

  useEffect(() => {
    const checkIfRegistered = async () => {
      if (!isConnected || !address) {
        console.log('Wallet not connected');
        return;
      }

      const result = await readContract({
        address: '0xfbC672F3B3e146272E4426B225791295Ca36EAe9',
        abi: abi,
        functionName: 'factories',
        args: [address],
      });

      console.log(`factories call result: ${result}`);

      if (result !== '0x0000000000000000000000000000000000000000') {
        setIsRegistered(true);
        router.push(`/profile/${address}`);
      } else {
        setIsRegistered(false);
      }
    };

    checkIfRegistered();
  }, [address, isConnected, router]);

  
  const onSubmit = async (e) => {
    e.preventDefault();
 
    // Initialize the client
    const client = new NFTStorage({ token: process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY });
 
    // Prepare the NFT metadata
    const nftMetadata = {
        name: name,
        description: description,
        image: file, // use image File object as `image` field
    };
 
    // Upload the NFT metadata to IPFS and get the CID
    const metadata = await client.store(nftMetadata);
    console.log(metadata);
 
    // Extract the CID from metadata.url
    const cid = metadata.url.split("ipfs://")[1];
 
    // Construct the metadata URL
    const metadataUrl = `https://ipfs.io/ipfs/${cid}`;
 
    // Update the metadataURL state to trigger a re-render
    setMetadataURL(metadataUrl);

    console.log(metadataUrl);
 
    const metadataResponse = await fetch(metadataUrl);
    if (!metadataResponse.ok) {
      throw new Error(`Failed to fetch the NFT metadata: ${metadataResponse.status} ${metadataResponse.statusText}`);
    }
    const metadataJson = await metadataResponse.json();
    
    // Extract the image IPFS URL from the metadata and convert it to the HTTP URL format
    const imageIpfsUrl = metadataJson.image;
    const imageHttpUrl = imageIpfsUrl.replace('ipfs://', 'https://ipfs.io/ipfs/');
    
    console.log(imageHttpUrl);

    // Update the imageURL state
    setImageURL(imageHttpUrl);
 
  // Prepare the call to createUserFactory
  const { request: requestCreateUserFactory } = await prepareWriteContract({
    address: '0xfbC672F3B3e146272E4426B225791295Ca36EAe9',
    abi: abi,
    functionName: 'createUserFactory',
    chainId: 11155111,
    args: [],
  });

  const { hash: createUserFactoryHash } = await writeContract(requestCreateUserFactory);
  console.log("Transaction Hash: ", createUserFactoryHash);
  const data = await waitForTransaction({ hash: createUserFactoryHash });
  console.log(data);

  // Check if hash exists (transaction successful)
  if (createUserFactoryHash) {
    console.log('createUserFactory executed successfully, transaction hash: ', createUserFactoryHash);

    // Call factories function to get the new Factory contract address
    const factoryContractAddress = await readContract({
      address: '0xfbC672F3B3e146272E4426B225791295Ca36EAe9',
      abi: abi,
      functionName: 'factories',
      args: [address],
    });

    console.log('Factory contract address: ', factoryContractAddress);

    // Prepare the call to createProfileNFT at the Factory contract
    const { request: requestCreateProfileNFT } = await prepareWriteContract({
      address: factoryContractAddress,
      abi: abi1,
      functionName: 'createProfileNFT',
      chainId: 11155111,
      args: [metadataUrl], // metadataUrl is used here
    });

    // Execute createProfileNFT
    const { hash: createProfileNFTHash } = await writeContract(requestCreateProfileNFT);
    console.log("Transaction Hash: ", createProfileNFTHash);
    const data = await waitForTransaction({ hash: createProfileNFTHash });
    console.log(data);

    // Check if hash exists (transaction successful)
    if (createProfileNFTHash) {
      console.log('createProfileNFT executed successfully, transaction hash: ', createProfileNFTHash);
      router.push(`/profile/${address}`);
    } else {
      console.log('createProfileNFT execution failed');
    }
  }
};
 
   

  return (
<div className="flex flex-col items-center justify-center min-h-screen py-2">
    {isConnected ? (
        isRegistered ? (
            <p>You are already registered</p>// we want to change to: 'you are not connected' 
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

export default Register;
