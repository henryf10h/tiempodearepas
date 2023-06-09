import Link from 'next/link'
import Navbar from '../components/Navbar';

const MainSection = () => {
    return (
        <>
        <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-slate-30">
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-2">Welcome to Tiempos de Arepa</h1>
                <p className="text-lg text-gray-600">Here is some text about what we do.</p>
                <Link href="/register" legacyBehavior>
                    <a className="mt-6 px-4 py-2 bg-blue-500 rounded text-white hover:bg-blue-600">Crear perfil</a>
                </Link>
            </div>
        </div>
        </>

    )
}

export default MainSection
