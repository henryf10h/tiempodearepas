import Link from 'next/link'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useMediaQuery } from 'react-responsive';
import { useState } from 'react'; 

const Navbar = () => {
    const isLargerScreen = useMediaQuery({ minDeviceWidth: 1224 })
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    }

    return (
        <nav className="flex items-center justify-between py-2 bg-slate-50 border-black">
            <div className="flex justify-between items-center w-full px-6">
                <img src="/arepa.jpg" alt="Logo" className="h-10 w-10 rounded-full" />
                <span className="text-2xl font-bold">TIEMPOS DE AREPA</span>
                {isLargerScreen ? 
                    <ConnectButton />
                    :
                    <div className="relative">
                        <button onClick={toggleDropdown} className="text-3xl">&#9776;</button>
                        {dropdownOpen && 
                            <div className="absolute right-0 mt-2 w-72 bg-slate-600 border border-gray-200 rounded shadow-lg">
                                <div className="flex items-center justify-center py-2">
                                    <ConnectButton />
                                </div>
                            </div>
                        }
                    </div>
                }
            </div>
        </nav>
    )
}

export default Navbar;
