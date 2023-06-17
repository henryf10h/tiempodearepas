// Import necessary libraries
import React, { useEffect, useState } from 'react';
import { prepareWriteContract, writeContract, waitForTransaction, readContract } from '@wagmi/core';
import abi from '../../contract-abi.json';
import abi1 from '../../contract-abi1.json';
import abi2 from '../../contract-abi2.json'; // Assuming that ABI for MemoryNFT contract is available
import { useRouter } from 'next/router';

// Define the Profile component
const Profile = ({ id }) => {
    const [factoryAddress, setFactoryAddress] = useState(null);
    const [memoryNFTAddress, setMemoryNFTAddress] = useState(null);
    const [eventNFTAddress, setEventNFTAddress] = useState(null);
    const [uri, setUri] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [userAddress, setUserAddress] = useState('');
    const router = useRouter();

    const handleAddressChange = (event) => {
        setUserAddress(event.target.value);
    };

    const mintToken = async () => {
        try {
            const { request: requestMintMemoryPublic } = await prepareWriteContract({
                address: factoryAddress,
                abi: abi1,
                functionName: 'mintMemoryPublic',
                chainId: 11155111,
                args: [userAddress],
            });
        
            const { hash } = await writeContract(requestMintMemoryPublic);
            console.log("Transaction Hash: ", hash);
        
            const data = await waitForTransaction({ hash });
            console.log(data);
        
            if (hash) {
                console.log('mintMemoryPublic executed successfully, transaction hash: ', hash);
            } else {
                console.log('mintMemoryPublic execution failed');
            }
        } catch (error) {
            console.error("Error minting token: ", error);
        }
    };
      

    useEffect(() => { 
        const fetchFactoryAddressAndUri = async () => {
            try {
                // Call 'factories' function to get the Factory contract address
                const factoryAddressResponse = await readContract({
                    address: '0xfbC672F3B3e146272E4426B225791295Ca36EAe9',
                    abi: abi,
                    functionName: 'factories',
                    args: [id],
                });

                console.log('factoryAddressResponse:', factoryAddressResponse);

                if (!factoryAddressResponse) {
                   console.error('factories function did not return a valid address');
                return;
                  }

                setFactoryAddress(factoryAddressResponse);


                // Ensure that factoryAddressResponse is defined before trying to use it
                if (factoryAddressResponse) {
                    // Call 'getProfileNFT' function to get the MemoryNFT contract address
                    const memoryNFTAddressResponse = await readContract({
                        address: factoryAddressResponse,
                        abi: abi1,
                        functionName: 'getProfileNFT',
                        args: [], // pass any necessary arguments here
                    });

                    console.log('memoryNFTAddressResponse:', memoryNFTAddressResponse);

                    setMemoryNFTAddress(memoryNFTAddressResponse);

                    const eventNFTAddressResponse = await readContract({
                        address: factoryAddressResponse,
                        abi: abi1,
                        functionName: 'getCurrentEventNFT',
                        args: [], // pass any necessary arguments here
                    });

                    console.log('eventNFTAddressResponse:', eventNFTAddressResponse);

                    setEventNFTAddress(eventNFTAddressResponse);

                    //here we have to change the condition

                    // Ensure that memoryNFTAddressResponse is defined before trying to use it
                    if (memoryNFTAddressResponse) {
                        // Call 'uri' function to get the URI from the MemoryNFT contract
                        const uriResponse = await readContract({
                            address: memoryNFTAddressResponse,
                            abi: abi2, // use the ABI of the MemoryNFT contract
                            functionName: 'uri',
                            args: [0], // pass any necessary arguments here
                        });

                        console.log('uriResponse:', uriResponse);

                        setUri(uriResponse);

                        // Fetch the metadata from the URI
                        const res = await fetch(uriResponse);
                        const data = await res.json();
                        setProfileData(data);
                    }

                    if (eventNFTAddressResponse) {
                        // Call 'uri' function to get the URI from the EventNFT contract
                        const eventUriResponse = await readContract({
                            address: eventNFTAddressResponse,
                            abi: abi2, // use the ABI of the EventNFT contract
                            functionName: 'uri',
                            args: [0], // pass any necessary arguments here
                        });
        
                        console.log('Event uriResponse:', eventUriResponse);
        
                        setEventUri(eventUriResponse);
        
                        // Fetch the metadata from the URI
                        const res = await fetch(eventUriResponse);
                        const data = await res.json();
                        setEventData(data);
                    }
                }
            } catch (error) {
                console.error('Error fetching factory address and URI:', error);
            }
        }

        fetchFactoryAddressAndUri();
    }, [id]);

    // Loading state handling here
    if (!factoryAddress || !memoryNFTAddress || !uri || !profileData) {
        return <p>Loading...</p>;
    }

    // Component render
    return (
        <div className="h-screen w-screen flex items-center justify-center">
        <div className="max-w-sm bg-white rounded overflow-hidden shadow-lg p-6">
            {<div className="h-screen w-screen flex items-center justify-center">
            <div className="max-w-sm bg-white rounded overflow-hidden shadow-lg p-6">
                <img className="w-full" src={profileData.image.replace("ipfs://", "https://ipfs.io/ipfs/")} alt="Profile" />
                <div className="px-6 py-4 text-center">
                    <div className="font-bold text-xl mb-2">{profileData.name}</div>
                    <p className="text-gray-700 text-base">
                        {profileData.description}
                    </p>
                </div>
                <div className="px-6 py-4 text-center flex flex-col items-center">
                    <input type="text" value={userAddress} onChange={handleAddressChange} placeholder="Enter an address" className="mb-4 rounded px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-300"/>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={mintToken}>
                        Mint
                    </button>
                </div>

            </div>
             </div>}
             </div>
        {eventData ? (
            <div className="max-w-sm bg-white rounded overflow-hidden shadow-lg p-6">
                {/* Card for Event NFT */}
                <img className="w-full" src={eventData.image.replace("ipfs://", "https://ipfs.io/ipfs/")} alt="Event" />
                <div className="px-6 py-4 text-center">
                    <div className="font-bold text-xl mb-2">{eventData.name}</div>
                    <p className="text-gray-700 text-base">
                        {eventData.description}
                    </p>
                </div>
            </div>
        ) : (
            <div className="max-w-sm bg-white rounded overflow-hidden shadow-lg p-6">
                <p>Do you want to create an event?</p>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={() => router.push('/eventregister')}>
                    Create Event
                </button>
            </div>
        )}
    </div>
    );
};

// Export the Profile component
export default Profile;
