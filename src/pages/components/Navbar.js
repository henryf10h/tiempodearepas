import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useMediaQuery } from 'react-responsive';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'; // Import the useRouter hook
import { getAccount } from '@wagmi/core';
// import { connect } from '@wagmi/core'
// import { sepolia } from '@wagmi/core/chains'
// import { InjectedConnector } from '@wagmi/core/connectors/injected'

const Navbar = () => {
  const [isMounted, setIsMounted] = useState(false);
  const isLargerScreen = useMediaQuery({ minDeviceWidth: 1224 });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter(); // Initialize the useRouter hook
  const [addressInput, setAddressInput] = useState(''); // State to store the user's input
  // const connectWallet = async () => {
  //   try {
  //     const result = await connect({
  //       connector: new InjectedConnector(),
  //     });
  //     console.log(result)
  //     // Do something with the result, e.g., update a state variable
  //   } catch (error) {
  //     console.error("Error connecting to wallet:", error);
  //     // Handle the error accordingly
  //   }
  // };

  const goToProfile = () => {
    if (addressInput) {
      // Use Next.js's router to navigate to the profile page with the addressInput
      // router.push(`/profile/${addressInput}`);
      router.push(`/visit?input=${addressInput}`);
    }
  };

  useEffect(() => {
    // connectWallet();
    setIsMounted(true);
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <nav className="flex items-center justify-between py-4 border-black bg-white">
      <div className="flex justify-between items-center w-full px-6 pb-4 shadow-lg shadow-green-100">
        <div className="flex items-center space-x-6">
          <Link href="/" legacyBehavior>
            <a>
              <span className="flex items-center">
                <img src="/arepa.png" alt="Logo" className="h-12 w-12 rounded-full cursor-pointer" />
                {isLargerScreen && <p className="ml-2 text-lg font-semibold">Tiempos De Arepa</p>}
              </span>
            </a>
          </Link>
          {isLargerScreen && (
          <div className="flex items-center">
     <img
      src="/arepaa.png"
      alt="Logo"
      className="h-12 w-12 rounded-full cursor-pointer mr-2"
      onClick={goToProfile} // Added onClick here
    />
          <input
            type="text"
            value={addressInput}
            onChange={e => setAddressInput(e.target.value)}
            placeholder="e.g. 0xD5C...9331"
            className="border rounded p-1"
          />
          <button onClick={goToProfile} className="ml-2 text-lg font-semibold bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"> {/* Updated styling */}
            Visitar Amigos!
          </button>
        </div>
          )}
        </div>
        {isLargerScreen ? (
          <ConnectButton className="text-lg font-semibold" />
        ) : (
          <div className="relative">
            <button onClick={toggleDropdown} className="text-2xl hover:text-gray-700">&#9776;</button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-50 border border-gray-200 rounded shadow-lg">
                <div className="flex flex-col items-start justify-center py-2 px-4 space-y-2">
                  <div className="flex items-center">
                    <img
                      src="/arepaa.png"
                      alt="Logo"
                      className="h-8 w-8 rounded-full cursor-pointer mr-2"
                      onClick={goToProfile} // Added onClick here
                    />
                    <input
                      type="text"
                      value={addressInput}
                      onChange={e => setAddressInput(e.target.value)}
                      placeholder="e.g. 0xD5C...9331"
                      className="border rounded p-1"
                    />
                  </div>
                  <ConnectButton className="text-lg font-semibold" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
