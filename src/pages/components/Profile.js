import { useState } from 'react'
import { NFTStorage } from 'nft.storage'

const Card = ({ name, description, imageUrl }) => {
    return (
      <div className="w-full md:w-1/2 lg:w-1/2 max-h-[125%] mx-auto bg-slate-600 rounded-xl shadow-md overflow-hidden">
        <div className="flex flex-col items-center p-4">
          <div className="w-96 h-96 bg-neutral-400 flex items-center justify-center mb-4">
            <img className="max-w-full max-h-full object-contain" src={imageUrl} alt="NFT Image" />
          </div>
          <div className="text-center bg-transparent p-2 mb-4">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{name || "Enter name"}</div>
          </div>
          <div className="text-center bg-transparent p-2 mb-4">
            <p className="mt-2 text-gray-500">{description || "Enter description"}</p>
          </div>
          <a href="#" className="btn btn-primary mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out">
            Go somewhere
          </a>
        </div>
      </div>
    );
  };





const Profile = () => {
    const [file, setFile] = useState(null)
    const [metadataURL, setMetadataURL] = useState('')
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [imageURL, setImageURL] = useState('');


    const onFileChange = (e) => {
        setFile(e.target.files[0])
    }

    const onSubmit = async (e) => {
        e.preventDefault()
    
        // Initialize the client
        const client = new NFTStorage({ token: process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY });
    
        // Upload the image file to IPFS and get the CID
        const imageCID = await client.storeBlob(file);
        const imageUrl = `https://ipfs.io/ipfs/${imageCID}`; // Construct the image URL
    
        // Fetch the uploaded image as a Blob
        const response = await fetch(imageUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch the uploaded image: ${response.status} ${response.statusText}`);
        }
        const imageBlob = await response.blob();
    
        // Convert the Blob to a File object
        const imageFile = new File([imageBlob], file.name, { type: file.type });
    
        // Prepare the NFT metadata
        const nftMetadata = {
            name: name,
            description: description,
            image: imageFile, // use image File object as `image` field
        };
    
        // Upload the NFT metadata to IPFS and get the CID
        const metadata = await client.store(nftMetadata);

        // Extract the CID from metadata.url
        const cid = metadata.url.split("ipfs://")[1];

        // Construct the metadata URL
        const metadataUrl = `https://ipfs.io/ipfs/${cid}`;

        // Update the metadataURL state to trigger a re-render
        setMetadataURL(metadataUrl);

        const metadataResponse = await fetch(metadataUrl);
        if (!metadataResponse.ok) {
          throw new Error(`Failed to fetch the NFT metadata: ${metadataResponse.status} ${metadataResponse.statusText}`);
        }
        const metadataJson = await metadataResponse.json();
        
        // Extract the image IPFS URL from the metadata and convert it to the HTTP URL format
        const imageIpfsUrl = metadataJson.image;
        const imageHttpUrl = imageIpfsUrl.replace('ipfs://', 'https://ipfs.io/ipfs/');
        
        // Update the imageURL state
        setImageURL(imageHttpUrl);
    }
    
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-slate-500">
            {imageURL ? (
                <>
                    <Card name={name} description={description} imageUrl={imageURL} />
                    {/* {metadataURL && <p>Your Metadata URL: <a href={metadataURL} target="_blank" rel="noreferrer">{metadataURL}</a></p>}
                    {imageURL && <p>Your Image URL: <a href={imageURL} target="_blank" rel="noreferrer">{imageURL}</a></p>} */}
                </>
            ) : (
                <form onSubmit={onSubmit} className="flex flex-col items-center">
                    <input type="file" accept="image/*" onChange={onFileChange} required />
                    <input type="text" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} required />
                    <textarea placeholder="Enter description" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
                    <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 rounded text-white hover:bg-blue-600">Upload and Mint</button>
                </form>
            )}
        </div>
    )
    
}

export default Profile
