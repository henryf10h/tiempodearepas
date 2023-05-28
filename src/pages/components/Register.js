import Link from 'next/link'

const Register = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-slate-500">
            <Link href="/profile" legacyBehavior>
                <a className="mt-6 px-4 py-2 bg-blue-500 rounded text-white hover:bg-blue-600">Register</a>
            </Link>
        </div>
    )
}

export default Register
