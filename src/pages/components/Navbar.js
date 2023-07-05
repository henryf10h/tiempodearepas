import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useMediaQuery } from 'react-responsive';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const [isMounted, setIsMounted] = useState(false);
  const isLargerScreen = useMediaQuery({ minDeviceWidth: 1224 });
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <nav className="flex items-center justify-between py-4 border-black bg-green-400">
      <div className="flex justify-between items-center w-full px-6">
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
            <Link href="/" legacyBehavior>
              <a>
                <span className="flex items-center">
                  <img src="/arepaa.png" alt="Logo" className="h-12 w-12 rounded-full cursor-pointer" />
                  <p className="ml-2 text-lg font-semibold">Arepas Recolectadas</p>
                </span>
              </a>
            </Link>
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
                  <Link href="/" legacyBehavior>
                    <a>
                      <span className="flex items-center space-x-2">
                        <img src="/arepaa.png" alt="Logo" className="h-8 w-8 rounded-full cursor-pointer" />
                        <p className="text-lg font-semibold">Arepas Recolectadas</p>
                      </span>
                    </a>
                  </Link>
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
