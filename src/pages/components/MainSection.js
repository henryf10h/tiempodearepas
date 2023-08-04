import Link from 'next/link';


const MainSection = () => {
  return (
    <div className="flex flex-col items-center justify-center sm:justify-start py-2 bg-white">
      <div className="w-full max-w-md mx-auto text-center mb-6">
        <h1 className="mt-10 sm:mt-20 text-2xl sm:text-4xl font-bold mb-2 text-black-500">¿Eres un amante de las Arepas? 🍴</h1>
        <p className="text-base sm:text-lg text-gray-600 mb-6 leading-relaxed">
          Presentamos<br />
          <span className="text-green-500 text-2xl font-bold">Tiempos de Arepa 🍽️</span><br />
          Colecta con tus amigos<br />
          Diseña <span className="text-green-500 text-2xl font-bold">Experiencias Gastronómicas</span><br />
          Recompensa tus mejores momentos con<br />
          <span className="text-green-500 text-2xl font-bold">Recuerdos de Arepas</span>
        </p>
        <Link href="/register" legacyBehavior>
          <a className="mt-6 px-4 py-2 bg-orange-500 rounded text-white hover:bg-orange-600 w-48 sm:w-auto">IR A/CREAR PERFIL</a>
        </Link>
      </div>
    </div>
  );
};

export default MainSection;

