const Features = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 sm:space-y-0 sm:flex-row sm:space-x-6 p-6 bg-green-200">
      <div className="bg-white rounded-lg p-6 shadow-lg flex-1">
        <h2 className="text-xl font-bold mb-2 text-gray-800 text-center">🌐</h2>
        <p className="text-gray-700">Nuestra DApp ofrece una plataforma única donde puedes acuñar NFTs como recuerdos. Siempre que alguien te visite, puedes crear y compartir estos preciosos momentos como NFTs. </p>
      </div>
      <div className="bg-white rounded-lg p-6 shadow-lg flex-1">
        <h2 className="text-xl font-bold mb-2 text-gray-800 text-center">🤝</h2>
        <p className="text-gray-700">Los recuerdos son valiosos, ¿y qué mejor manera de preservarlos que como NFTs? Con nuestra plataforma, puedes acuñar NFTs únicos para representar tus recuerdos más apreciados. </p>
      </div>
      <div className="bg-white rounded-lg p-6 shadow-lg flex-1">
        <h2 className="text-xl font-bold mb-2 text-gray-800 text-center">🎟️</h2>
        <p className="text-gray-700">Organiza eventos distintivos y acuñalos como NFTs de eventos en nuestra plataforma. Ya sea un concierto, una conferencia o una reunión informal, puedes crear un registro duradero basado en la blockchain del evento.</p>
      </div>
    </div>
  );
};
   
export default Features;
