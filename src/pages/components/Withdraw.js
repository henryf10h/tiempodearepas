import React, { useEffect, useState } from 'react';
import abi from '../../contract-abi.json';
import abi1 from '../../contract-abi1.json';
import abi3 from '../../contract-abi3.json';
import {  writeContract, waitForTransaction, readContract } from '@wagmi/core';
import { fetchBalance } from '@wagmi/core'

function Withdraw({id}) {
  const [eventNFTAddress, setEventNFTAddress] = useState(null);
  const [eventBalance, setEventBalance] = useState(null);
  const handleWithdraw = async () => {
    try {
      // Assuming the contract ABI has a 'withdraw' function
      // and 'eventNFTAddress' is the contract's address
      const response = await writeContract({
        address: eventNFTAddress,
        abi: abi3, // Assuming this is the correct ABI for the withdraw function
        functionName: 'withdraw',
        args: [], // Add any required arguments here
      });

      const data = await waitForTransaction({ response });
      console.log(data);
      console.log('Withdrawal successful:', response);
  
      // Refreshing the balance after a successful withdrawal
      const balance = await fetchBalance({
        address: eventNFTAddress,
      });
  
      setEventBalance(balance);
  
      // Optional: You may want to refresh the balance or navigate the user to a different page
    } catch (error) {
      console.error('Error with withdrawal:', error);
    }
  };
  

  useEffect(() => {
    const fetchEventNFTDetails = async () => {
      try {
        // Assuming '0xE12C657b5F6A6bc7ff862764FFFB73c9C46397dD' is a constant Factory contract address
        const factoryAddressResponse = await readContract({
          address: '0xF84697716aE761772ee3C61A1D7840ECFDE9eC4a',
          abi: abi,
          functionName: 'factories',
          args: [id],
        });

        if (!factoryAddressResponse) {
          console.error('factories function did not return a valid address');
          return;
        }

        const eventNFTAddressResponse = await readContract({
          address: factoryAddressResponse,
          abi: abi1,
          functionName: 'getCurrentEventNFT',
          args: [], // pass any necessary arguments here
        });

        console.log('eventNFTAddressResponse:', eventNFTAddressResponse);

        setEventNFTAddress(eventNFTAddressResponse);
        console.log(eventNFTAddressResponse);

        if (eventNFTAddressResponse !== "0x0000000000000000000000000000000000000000") {
          // Read the balance from the EventNFT contract
          const balance = await fetchBalance({
               address: eventNFTAddressResponse,
             })

          console.log('Event balanceResponse:', balance);

          setEventBalance(balance);
          console.log(balance);
        }
      } catch (error) {
        console.error('Error fetching event NFT details and balance:', error);
      }
    };

    fetchEventNFTDetails();
  }, [id,handleWithdraw]);

  return (
     <div className="flex flex-col items-center justify-center min-h-screen bg-green-100">
       <div className="max-w-md w-full bg-white p-6 rounded-xl shadow-md space-y-4 text-center">
         <p className="text-gray-700">
           <span className="font-bold">Event NFT Address:</span> {eventNFTAddress}
         </p>
         <p className="text-gray-700">
           <span className="font-bold">Event Balance:</span> {eventBalance ? eventBalance.formatted : 'Loading...'}
         </p>
       </div>
       <button className="mt-5 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700" onClick={handleWithdraw}>
         RETIRAR!
       </button>
     </div>
   );
}

export default Withdraw;
