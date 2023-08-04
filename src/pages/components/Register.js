import React, { useCallback, useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { readContract, prepareWriteContract, writeContract  } from '@wagmi/core';
import { useRouter } from 'next/router';
import abi from '../../contract-abi.json';
import abi1 from '../../contract-abi1.json';
import { NFTStorage } from 'nft.storage';
import { waitForTransaction } from '@wagmi/core';
import Cropper from 'react-easy-crop'; // Import Cropper
// import getCroppedImg from '../hooks/cropImage'; // Assuming you've added the getCroppedImg function as separate module.


const Register = () => {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [isRegistered, setIsRegistered] = useState(false);
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [metadataURL, setMetadataURL] = useState(null); // add this line
  const [imageURL, setImageURL] = useState(null); // add this line
  const [previewImage, setPreviewImage] = useState(null); // add this line
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [loading, setLoading] = useState(false); // new state for loading

  const onCropChange = crop => {
    setCrop(crop);
  };

  const onZoomChange = zoom => {
    setZoom(zoom);
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const onFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFile(file);
      let imageDataUrl = await readFile(file);
      setPreviewImage(imageDataUrl);
    } else {
      setFile(null);
      setPreviewImage(null); // if no file is selected, remove the current preview
    }
  };
  

  const readFile = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => resolve(reader.result), false);
      reader.readAsDataURL(file);
    });
  };

  const handleCrop = async (event) => {
    event.preventDefault();
    if (!previewImage || !croppedAreaPixels) {
      return;
    }
    try {
      const croppedImage = await getCroppedImage(previewImage, croppedAreaPixels);
      setPreviewImage(croppedImage); // update the previewImage with the cropped image
      const file = await dataURLToFile(croppedImage, 'croppedImage.jpg');
      setFile(file); // update the file with the cropped image
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  };
  
  const getCroppedImage = (imageSrc, croppedAreaPixels) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        const canvasWidth = croppedAreaPixels.width;
        const canvasHeight = croppedAreaPixels.height;
        const canvasContext = canvas.getContext('2d');
  
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
  
        canvasContext.drawImage(
          image,
          croppedAreaPixels.x * scaleX,
          croppedAreaPixels.y * scaleY,
          croppedAreaPixels.width * scaleX,
          croppedAreaPixels.height * scaleY,
          0,
          0,
          canvasWidth,
          canvasHeight
        );
  
        canvas.toBlob((blob) => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            const base64data = reader.result;
            resolve(base64data);
          };
        }, 'image/jpeg');
      };
      image.onerror = (error) => reject(error);
    });
  };
  
  
  const dataURLToFile = (dataURL, filename) => {
    if (!dataURL || typeof dataURL !== 'string') {
      return null;
    }
  
    const arr = dataURL.split(',');
    if (arr.length < 2) {
      return null;
    }
  
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
  
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
  
    return new File([u8arr], filename, { type: mime });
  };
  


  useEffect(() => {
    const checkIfRegistered = async () => {
      if (!isConnected || !address) {
        console.log('Wallet not connected');
        return;
      }

      const result = await readContract({
        address: '0xE12C657b5F6A6bc7ff862764FFFB73c9C46397dD',
        abi: abi,
        functionName: 'factories',
        args: [address],
      });

      console.log(`factories call result: ${result}`);

      if (result !== '0x0000000000000000000000000000000000000000') {
        setIsRegistered(true);
        router.push(`/profile/${address}`);
      } else {
        setIsRegistered(false);
      }
    };

    checkIfRegistered();
  }, [address, isConnected, router]);

  
  const onSubmit = async (e) => {
    e.preventDefault();

    setLoading(true); // set loading true before starting the transaction

    // Initialize the client
    const client = new NFTStorage({ token: process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY });
  
    // Convert the cropped image to a File object
    const croppedFile = new File([file], 'croppedImage.jpg', { type: 'image/jpeg' });
  
    // Prepare the NFT metadata
    const nftMetadata = {
      name: name,
      description: description,
      image: croppedFile, // use the croppedFile as the `image` field
    };
  
    // Upload the NFT metadata to IPFS and get the CID
    const metadata = await client.store(nftMetadata);
    console.log(metadata);
 
    // Extract the CID from metadata.url
    const cid = metadata.url.split("ipfs://")[1];
 
    // Construct the metadata URL
    const metadataUrl = `https://ipfs.io/ipfs/${cid}`;
 
    // Update the metadataURL state to trigger a re-render
    setMetadataURL(metadataUrl);

    console.log(metadataUrl);
 
    const metadataResponse = await fetch(metadataUrl);
    if (!metadataResponse.ok) {
      throw new Error(`Failed to fetch the NFT metadata: ${metadataResponse.status} ${metadataResponse.statusText}`);
    }
    const metadataJson = await metadataResponse.json();
    
    // Extract the image IPFS URL from the metadata and convert it to the HTTP URL format
    const imageIpfsUrl = metadataJson.image;
    const imageHttpUrl = imageIpfsUrl.replace('ipfs://', 'https://ipfs.io/ipfs/');
    
    console.log(imageHttpUrl);

    // Update the imageURL state
    setImageURL(imageHttpUrl);
 
  // Prepare the call to createUserFactory
  const { request: requestCreateUserFactory } = await prepareWriteContract({
    address: '0xE12C657b5F6A6bc7ff862764FFFB73c9C46397dD',
    abi: abi,
    functionName: 'createUserFactory',
    chainId: 11155111,
    args: [],
  });

  const { hash: createUserFactoryHash } = await writeContract(requestCreateUserFactory);
  console.log("Transaction Hash: ", createUserFactoryHash);
  const data = await waitForTransaction({ hash: createUserFactoryHash });
  console.log(data);

  // Check if hash exists (transaction successful)
  if (createUserFactoryHash) {
    console.log('createUserFactory executed successfully, transaction hash: ', createUserFactoryHash);

    // Call factories function to get the new Factory contract address
    const factoryContractAddress = await readContract({
      address: '0xE12C657b5F6A6bc7ff862764FFFB73c9C46397dD',
      abi: abi,
      functionName: 'factories',
      args: [address],
    });

    console.log('Factory contract address: ', factoryContractAddress);

    // Prepare the call to createProfileNFT at the Factory contract
    const { request: requestCreateProfileNFT } = await prepareWriteContract({
      address: factoryContractAddress,
      abi: abi1,
      functionName: 'createProfileNFT',
      chainId:11155111,
      args: [metadataUrl], // metadataUrl is used here
    });

    // Execute createProfileNFT
    const { hash: createProfileNFTHash } = await writeContract(requestCreateProfileNFT);
    console.log("Transaction Hash: ", createProfileNFTHash);
    const data = await waitForTransaction({ hash: createProfileNFTHash });
    console.log(data);

    // Check if hash exists (transaction successful)
    if (createProfileNFTHash) {
      console.log('createProfileNFT executed successfully, transaction hash: ', createProfileNFTHash);
      router.push(`/profile/${address}`);
    } else {
      console.log('createProfileNFT execution failed');
    }
  }
  setLoading(false); // set loading false after the transaction ends
};  

if (loading) {
  return (
    <div className="flex items-center justify-center min-h-screen text-2xl font-bold text-green-500 bg-white">
      Cargando
      <span className="animate-ping ml-1">.</span>
      <span className="animate-ping ml-1 delay-150">.</span>
      <span className="animate-ping ml-1 delay-300">.</span>
    </div>
  )
}

return (
  <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-white">
    {isConnected ? (
      <form className="w-full max-w-sm" onSubmit={onSubmit}>
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label
              className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
              htmlFor="inline-full-name"
            >
              Cargar Imagen
            </label>
          </div>
          <div className="md:w-2/3">
            <input type="file" accept="image/*" onChange={onFileChange} required />
            {previewImage && (
              <div className="relative w-full h-96">
                <Cropper
                  image={previewImage}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={onCropChange}
                  onZoomChange={onZoomChange}
                  onCropComplete={onCropComplete}
                  className="z-10"
                />
                <button
                  className="absolute bottom-4 right-4 z-20 bg-green-500 text-white p-2 rounded"
                  onClick={handleCrop}
                >
                  Cortar Imagen
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label
              className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
              htmlFor="inline-full-name"
            >
              Nombre
            </label>
          </div>
          <div className="md:w-2/3">
            <input
              className="bg-white-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label
              className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
              htmlFor="inline-full-name"
            >
              Descripción
            </label>
          </div>
          <div className="md:w-2/3">
            <textarea
              className="bg-white-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
        </div>
        <div className="flex justify-center">
          <button
            className="shadow bg-orange-500 hover:bg-orange-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
            type="submit"
          >
            Registrar
          </button>
        </div>
      </form>
    ) : (
      <p className='font-bold text-green-400 text-lg'>Conecta tu cartera</p>
    )}
  </div>
);


};

export default Register;