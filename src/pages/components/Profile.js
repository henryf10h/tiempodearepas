// Import necessary libraries
import React, { useEffect, useState } from 'react';
import { prepareWriteContract, writeContract, waitForTransaction, readContract } from '@wagmi/core';
import abi from '../../contract-abi.json';
import abi1 from '../../contract-abi1.json';
import abi2 from '../../contract-abi2.json'; // Assuming that ABI for MemoryNFT contract is available
import abi3 from '../../contract-abi3.json';
import { useRouter } from 'next/router';
import Web3 from 'web3';
import EventDuration from '../hooks/eventDuration';
import { ethers } from 'ethers';
import { useAccount } from 'wagmi';
import Withdraw from './Withdraw';

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
    const [eventCounter, setEventCounter] = useState(null); 
    const [transactionHash, setTransactionHash] = useState(null);
    const isEventOpen = eventDuration > (Date.now() / 1000);
    const { address } = useAccount(); // Using the useAccount hook to get the connected user's address

    // Check if the account address is the same as the profile's ID (address)
    const isAddressMatch = address === id;
    let provider;
    if (typeof window !== 'undefined') {
      provider = new ethers.providers.Web3Provider(window.ethereum);
    }

    const handleAddressChange = (event) => {
        setUserAddress(event.target.value);
    };

    const handleEventAddressChange = (event) => {
        setUserEventAddress(event.target.value); // NEW
    };

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(memoryNFTAddress);
        alert('Address copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    };

    const mintEventToken = async () => {
        const stringWei = eventPrice.toString();
        console.log(stringWei);
        // use ethers to convert the wei value to a BigNumber
        const weiToBigNumber = ethers.utils.parseUnits(stringWei, "wei");
        console.log(weiToBigNumber);
        try {
            const { request: requestMintEvent } = await prepareWriteContract({
                address: factoryAddress,
                abi: abi1, // Assume abi1 is the ABI for the EventNFT contract
                functionName: 'mintEvent',
                chainId: 11155111, 
                value: weiToBigNumber, // Assume you have eventPrice variable in your state
            });
            
            const { hash } = await writeContract(requestMintEvent);
            console.log("Transaction Hash: ", hash);
            const receipt = await provider.waitForTransaction(hash);
            console.log('Transaction Receipt: ', receipt);
            // after confirmation, update the state which will trigger useEffect
            if(receipt.confirmations > 0){
                setTransactionHash(hash);
            }
    
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
    }, [provider]);

    useEffect(() => { 
        const fetchFactoryAddressAndUri = async () => {
            try {
                // Call 'factories' function to get the Factory contract address
                const factoryAddressResponse = await readContract({
                    address: '0xF84697716aE761772ee3C61A1D7840ECFDE9eC4a',
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
                        setEventSupply(eventSupplyResponse.toString());
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

                        const eventCounterResponse = await readContract({
                          address: eventNFTAddressResponse,
                          abi: abi3,
                          functionName: 'getCounter',
                          args: [], 
                      });
                      setEventCounter(eventCounterResponse.toString());
                      console.log(typeof eventCounterResponse,eventCounterResponse);
                    }
                }
            } catch (error) {
                console.error('Error fetching factory address and URI:', error);
            }
        }

        fetchFactoryAddressAndUri();
    }, [id, transactionHash]);

    if (!factoryAddress || !memoryNFTAddress || !uri || !profileData) {
        return (
          <div className="flex items-center justify-center min-h-screen text-2xl font-bold text-green-500 bg-white">
            Cargando
            <span className="animate-ping ml-1">.</span>
            <span className="animate-ping ml-1 delay-150">.</span>
            <span className="animate-ping ml-1 delay-300">.</span>
          </div>
        );
      }
      
      return (
        <>
        <div className="container mx-auto py-4 min-h-screen flex flex-col sm:flex-row items-center justify-center sm:space-x-64 overflow-auto bg-white">
          <div className="sm:max-w-sm bg-white rounded overflow-hidden shadow-2xl mb-4 sm:mb-0">
            <img className="w-full object-cover" src={profileData.image.replace("ipfs://", "https://ipfs.io/ipfs/")} alt="Profile" />
            <div className="p-6">
              <div className="text-left">
                <div className="font-bold text-xl mb-2">{profileData.name}</div>
                <p className="text-gray-700 text-base">
                  {profileData.description}
                </p>
              </div>
              <div className="py-4 border-b border-black mb-4"></div>
              <div className="text-center flex flex-col items-center">
                <input type="text" value={userAddress} onChange={handleAddressChange} placeholder="Mandar NFT a e.g. 0x67t...7890" className="mb-4 rounded px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-300" />
                <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={mintToken}>
                  ACUÑA NFT!
                </button>
              </div>
            </div>
             <div className="p-2 text-left">
              <button  onClick={() => alert('Carta de perfil: Información sobre el dueño del perfil.')}>ℹ️</button>
              <button onClick={handleCopy} style={{ cursor: 'pointer' }}>⏹️</button>
             </div>
          </div>
      
          {eventData ? (
  <div className="sm:max-w-sm bg-green-400 rounded overflow-hidden shadow-lg p-6 mb-4 ml-0 sm:ml-4">
  <img className="w-full object-cover p-0 pt-0" src={eventData.image.replace("ipfs://", "https://ipfs.io/ipfs/")} alt="Event" />
  <div className="text-left">
    <div className="font-bold text-xl mb-2">{eventData.name}</div>
    <p className="text-gray-700 text-base">
      {eventData.description}
    </p>
    <div className="flex justify-between my-2">
    <div>
        <p className="font-bold text-base">Precio:</p>
        <p className="text-orange-700 text-base font-bold">
          ⟠ {eventPrice ? Web3.utils.fromWei(eventPrice.toString(), 'ether') : ''}Ξ
        </p>
    </div>
    <div>
        <p className="font-bold text-base">Duración:</p>
        <p className="text-gray-700 text-base font-bold">
          <EventDuration duration={eventDuration} />
        </p>
    </div>
</div>
    <div className="flex justify-center my-2">
      <p className="text-gray-700 text-base align-itmes font-bold">
        Contador: {eventCounter}/{eventSupply}
      </p>
    </div>
  </div>
  <div className="py-4 border-b mb-4 border-black"></div>
  <div className="text-center flex flex-col items-center">
  <button
    className={`bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isEventOpen ? '' : 'opacity-50 cursor-not-allowed'}`}
    onClick={isEventOpen ? mintEventToken : null}
>
    {isEventOpen ? 'ACUÑA NFT!' : 'CERRADO!'}
</button>
  </div>
  <div className="flex justify-between p-2">
    <button onClick={() => alert('Esta es la carta de evento. Aqui se muestra información relevante del evento.')}>ℹ️</button>
    {isAddressMatch && (
    <button onClick={() => router.push('/neweventregister')} className="text-blue-500 hover:text-blue-700 cursor-pointer">
      ➕
    </button>
  )}
  </div>
</div>
          ) : (
            <div className="flex justify-end mt-4 sm:mt-0 ml-2 sm:ml-4">
              <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded" onClick={() => router.push('/eventregister')}>
                CREA UN EVENTO
              </button>
            </div>
          )}
        </div>
{/* Conditionally render Withdraw component if account matches id */}
{address && address.toLowerCase() === id.toLowerCase() && <Withdraw id={id} />}
        </>
      );
          
};

// Export the Profile component
export default Profile;
