return (
    <div className="container mx-auto py-4 min-h-screen flex flex-col sm:flex-row items-center justify-center sm:space-x-64 overflow-auto">
        <div className="sm:max-w-sm bg-white rounded overflow-hidden shadow-lg p-6 flex-1 mb-4 sm:mb-0">
            <img className="w-full object-cover" src={profileData.image.replace("ipfs://", "https://ipfs.io/ipfs/")} alt="Profile" />
            <div className="px-6 pt-4 text-center">
            <div className="font-bold text-xl mb-2">{profileData.name}</div>
                    <p className="text-gray-700 text-base">
                        {profileData.description}
                    </p>
                </div>
                <div className="px-6 pt-4 pb-2 text-center flex flex-col items-center">
                    <input type="text" value={userAddress} onChange={handleAddressChange} placeholder="Enter an address" className="mb-4 rounded px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-300"/>
                    <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={mintToken}>
                        MINT
                    </button>
            </div>
        </div>
    
        {eventData ? (
            <div className="sm:max-w-sm bg-white rounded overflow-hidden shadow-lg p-6 flex-1 mb-4 sm:mb-0 overflow-y-auto">
                <img className="w-full object-cover" src={eventData.image.replace("ipfs://", "https://ipfs.io/ipfs/")} alt="Event" />
                <div className="font-bold text-xl mb-2">{eventData.name}</div>
                        <p className="text-gray-700 text-base">
                            {eventData.description}
                        </p>
                        <p className="text-gray-700 text-base">
                            Supply: {eventSupply ? eventSupply.toString() : ''}
                        </p>
                        <p className="text-gray-700 text-base">
                            Price: {eventPrice ? Web3.utils.fromWei(eventPrice.toString(), 'ether') : ''}
                        </p>
                        <p className="text-gray-700 text-base">
                            Duration: {eventDuration ? eventDuration.toString() : ''}
                        </p>
            </div>
        ) : (
            <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline self-center mt-4 sm:mt-0" onClick={() => router.push('/eventregister')}>
                CREA UN EVENTO
            </button>
        )}
    </div>
);


<div className="container mx-auto py-4 min-h-screen flex flex-col sm:flex-row items-center justify-center sm:space-x-64 overflow-auto">
<div className="max-w-sm bg-white rounded overflow-hidden shadow-lg p-6">
    <img className="w-full" src={profileData.image.replace("ipfs://", "https://ipfs.io/ipfs/")} alt="Profile" />
    <div className="px-6 pt-4 text-center">
        <div className="font-bold text-xl mb-2">{profileData.name}</div>
        <p className="text-gray-700 text-base">
            {profileData.description}
        </p>
    </div>
    <div className="px-6 pt-4 pb-2 text-center flex flex-col items-center">
        <input type="text" value={userAddress} onChange={handleAddressChange} placeholder="Enter an address" className="mb-4 rounded px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-300"/>
        <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={mintToken}>
            MINT
        </button>
    </div>
</div>

{eventData ? (
    <div className="flex flex-col w-full sm:max-w-sm bg-white rounded overflow-hidden shadow-lg p-6 space-y-4 mb-4 sm:mb-0 overflow-y-auto">
        {/* Card for Event NFT */}
        <img className="w-full object-cover" src={eventData.image.replace("ipfs://", "https://ipfs.io/ipfs/")} alt="Event" />
        <div className="px-6 py-1 text-center">
            <div className="font-bold text-xl mb-2">{eventData.name}</div>
            <p className="text-gray-700 text-base">
                {eventData.description}
            </p>
            <p className="text-gray-700 text-base">
                Supply: {eventSupply ? eventSupply.toString() : ''}
            </p>
            <p className="text-gray-700 text-base">
                Price: {eventPrice ? Web3.utils.fromWei(eventPrice.toString(), 'ether') : ''}
            </p>
            <p className="text-gray-700 text-base">
                Duration: {eventDuration ? eventDuration.toString() : ''}
            </p>
        </div>
        <div className="px-6 py-1 text-center flex flex-col items-center">
            <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={mintEventToken}>
                MINT
            </button>
            <a className="text-blue-500 hover:text-blue-700 cursor-pointer underline" onClick={() => router.push('/neweventregister')}>
                Create a new event
            </a>
        </div>
    </div>
) : (
    <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline self-center mt-4 sm:mt-0" onClick={() => router.push('/eventregister')}>
        CREA UN EVENTO
    </button>
)}
</div>
