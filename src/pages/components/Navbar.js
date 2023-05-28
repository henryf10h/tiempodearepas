import Link from 'next/link'
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Navbar = () => {
    return (
        <nav className="flex items-center justify-between py-2 border-b bg-slate-600 border-b border-black">
            <div className="flex items-center space-x-2 px-6">
                <img src="/logo.png" alt="Logo" className="h-8 w-8" />
                <span className="text-2xl font-bold">Tiempos de Arepa</span>
            </div>
            <ConnectButton></ConnectButton>
        </nav>
    )
}

export default Navbar