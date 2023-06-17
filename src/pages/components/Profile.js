// Import necessary libraries
import React, { useEffect, useState } from 'react';
import { prepareWriteContract, writeContract, waitForTransaction, readContract } from '@wagmi/core';
import abi from '../../contract-abi.json';
import abi1 from '../../contract-abi1.json';
import abi2 from '../../contract-abi2.json'; // Assuming that ABI for MemoryNFT contract is available
import abi3 from '../../contract-abi3.json';
import { useRouter } from 'next/router';
import Web3 from 'web3';

// Define the Profile component
const Profile = ({ id }) => {
    const [factoryAddress, setFactoryAddress] = useState(null);
    const [memoryNFTAddress, setMemoryNFTAddress] = useState(null);
    const [eventNFTAddress, setEventNFTAddress] = useState(null);
    const [uri, setUri] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [userAddress, setUserAddress] = useState('');
    const router = useRouter();
    const [eventData, setEventData] = useState(null);
    const [eventSupply, setEventSupply] = useState(null);
    const [eventPrice, setEventPrice] = useState(null);
    const [eventDuration, setEventDuration] = useState(null);
    const [userEventAddress, setUserEventAddress] = useState('');

    const handleAddressChange = (event) => {
        setUserAddress(event.target.value);
    };

    const handleEventAddressChange = (event) => {
        setUserEventAddress(event.target.value); // NEW
    };

    const mintEventToken = async () => {
        try {
            const { request: requestMintEvent } = await prepareWriteContract({
                address: factoryAddress,
                abi: abi1, // Assume abi1 is the ABI for the EventNFT contract
                functionName: 'mintEvent',
                chainId: 11155111, 
                value: 1000000000000000, // Assume you have eventPrice variable in your state
            });
            
            const { hash } = await writeContract(requestMintEvent);
            console.log("Transaction Hash: ", hash);
    
            const data = await waitForTransaction({ hash });
            console.log(data);
    
            if (hash) {
                console.log('mintEventToken executed successfully, transaction hash: ', hash);
            } else {
                console.log('mintEventToken execution failed');
            }
        } catch (error) {
            console.error("Error minting event token:", error);
        }
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
                    address: '0x0FD831cb538F0452B84D6848EC905D8ECb05DEc7',
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

                    if (eventNFTAddressResponse !== "0x0000000000000000000000000000000000000000") {
                        // Call 'uri' function to get the URI from the EventNFT contract
                        const eventUriResponse = await readContract({
                            address: eventNFTAddressResponse,
                            abi: abi3, // use the ABI of the EventNFT contract
                            functionName: 'uri',
                            args: [0], // pass any necessary arguments here
                        });
                    
                        console.log('Event uriResponse:', eventUriResponse);
                    
                        // Fetch the metadata from the URI
                        const res = await fetch(eventUriResponse.replace('ipfs://', 'https://ipfs.io/ipfs/'));
                        const data = await res.json();
                        setEventData(data);

                        const eventSupplyResponse = await readContract({
                            address: eventNFTAddressResponse,
                            abi: abi3,
                            functionName: 'getSupply',
                            args: [], 
                        });
                        setEventSupply(eventSupplyResponse);
                        console.log(typeof eventSupplyResponse,eventSupplyResponse);
                    
                        const eventPriceResponse = await readContract({
                            address: eventNFTAddressResponse,
                            abi: abi3,
                            functionName: 'getPrice',
                            args: [], 
                        });
                        setEventPrice(eventPriceResponse);
                        console.log(typeof eventPriceResponse,eventPriceResponse);
                    
                        const eventDurationResponse = await readContract({
                            address: eventNFTAddressResponse,
                            abi: abi3,
                            functionName: 'getDuration',
                            args: [], 
                        });
                        setEventDuration(eventDurationResponse);
                        console.log(typeof eventDurationResponse,eventDurationResponse);
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

    return (
        <div className="container mx-auto py-4 min-h-screen flex flex-col sm:flex-row items-center justify-center sm:space-x-64 overflow-auto">
            <div className="max-w-sm bg-white rounded overflow-hidden shadow-lg p-6">
                <img className="w-full" src={profileData.image.replace("ipfs://", "https://ipfs.io/ipfs/")} alt="Profile" />
                <div className="px-6 pt-4 text-center">
                    <div className="font-bold text-xl mb-2">{profileData.name}</div>
                    <p className="text-gray-700 text-base">
                        {profileData.description}
                    </p>
                </div>
                <div className="px-6 pt-4 pb-2 text-center flex flex-col items-center">
                    <input type="text" value={userAddress} onChange={handleAddressChange} placeholder="Enter an address" className="mb-4 rounded px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-300"/>
                    <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={mintToken}>
                        MINT
                    </button>
                </div>
            </div>
    
            {eventData ? (
                <div className="flex flex-col w-full sm:max-w-sm bg-white rounded overflow-hidden shadow-lg p-6 space-y-4 mb-4 sm:mb-0 overflow-y-auto">
                    {/* Card for Event NFT */}
                    <img className="w-full h-64 object-cover" src={eventData.image.replace("ipfs://", "https://ipfs.io/ipfs/")} alt="Event" />
                    <div className="px-6 py-1 text-center">
                        <div className="font-bold text-xl mb-2">{eventData.name}</div>
                        <p className="text-gray-700 text-base">
                            {eventData.description}
                        </p>
                        <p className="text-gray-700 text-base">
                            Supply: {eventSupply ? eventSupply.toString() : ''}
                        </p>
                        <p className="text-gray-700 text-base">
                            Price: {eventPrice ? Web3.utils.fromWei(eventPrice.toString(), 'ether') : ''}
                        </p>
                        <p className="text-gray-700 text-base">
                            Duration: {eventDuration ? eventDuration.toString() : ''}
                        </p>
                    </div>
                    <div className="px-6 py-1 text-center flex flex-col items-center">
                        <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={mintEventToken}>
                            Mint
                        </button>
                        <a className="text-blue-500 hover:text-blue-700 cursor-pointer underline" onClick={() => router.push('/neweventregister')}>
                            Create a new event
                        </a>
                    </div>
                </div>
            ) : (
                <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline self-center mt-4 sm:mt-0" onClick={() => router.push('/eventregister')}>
                    CREA UN EVENTO
                </button>
            )}
        </div>
    );
    
      
};

// Export the Profile component
export default Profile;
