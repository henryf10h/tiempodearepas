import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useMediaQuery } from 'react-responsive';
import { useState } from 'react';

const Navbar = () => {
    const isLargerScreen = useMediaQuery({ minDeviceWidth: 1224 });
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <nav className="flex items-center justify-between py-4 bg-slate-50 border-black">
            <div className="flex justify-between items-center w-full px-6">
                <Link href="/" legacyBehavior>
                    <a>
                        <img src="/arepa.png" alt="Logo" className="h-12 w-12 rounded-full cursor-pointer" />
                    </a>
                </Link>
                {isLargerScreen ? (
                    <ConnectButton className="text-lg font-semibold" />
                ) : (
                    <div className="relative">
                        <button onClick={toggleDropdown} className="text-2xl hover:text-gray-700">&#9776;</button>
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-72 bg-slate-50 border border-gray-200 rounded shadow-lg">
                                <div className="flex flex-col items-start justify-center py-2 px-4 space-y-2">
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
