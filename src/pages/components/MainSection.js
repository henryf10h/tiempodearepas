import Link from 'next/link';

const MainSection = () => {
  return (
    <div className="flex flex-col items-center justify-center sm:justify-start min-h-screen py-2 bg-slate-30 pt-0 sm:mt-20">
      <div className="w-full max-w-md mx-auto text-center min-h-3/4">
        <h1 className="text-2xl sm:text-4xl font-bold mb-2 text-black-500">¿Eres un amante de las Arepas? 🍴</h1>
        <p className="text-base sm:text-lg text-gray-600 mb-6 leading-relaxed">
          Presentamos<br/>
          <span className="text-green-500 text-2xl">Tiempos de Arepa 🍽️</span><br/>
          Colecta con tus amigos<br/>
          Diseña <span className="text-green-500 text-2xl">Experiencias Gastronómicas</span><br/>
          Recompensa tus mejores momentos con<br/>
          <span className="text-green-500 text-2xl">Recuerdos de Arepas</span>
        </p>
        <Link href="/register" legacyBehavior>
          <a className="mt-6 px-4 py-2 bg-orange-500 rounded text-white hover:bg-orange-600 w-full sm:w-auto">CREAR PERFIL</a>
        </Link>
      </div>
      <div className="absolute bottom-0 w-full">
        <p className="mt-auto pb-6 text-center text-base sm:text-lg text-slate-60">
          Hecho por <a href="https://twitter.com/Fenrir_67" target="_blank" rel="noopener noreferrer" className="text-slate-80 hover:text-slate-100">Fenrir 🐺</a>
        </p>
      </div>
    </div>
  )
}

export default MainSection;
