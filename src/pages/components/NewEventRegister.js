import { useCallback,useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { readContract, prepareWriteContract, writeContract } from '@wagmi/core';
import { useRouter } from 'next/router';
import abi from '../../contract-abi.json';
import abi1 from '../../contract-abi1.json';
import abi3 from '../../contract-abi3.json';
import { NFTStorage } from 'nft.storage';
import { waitForTransaction } from '@wagmi/core';
import { ethers } from 'ethers';
import Cropper from 'react-easy-crop'; // Import Cropper
// import getCroppedImg from '../hooks/cropImage'; // Assuming you've added the getCroppedImg function as separate module.

const NewEventRegister = () => {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [isNewRegistered, setIsNewRegistered] = useState(false);
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [metadataURL, setMetadataURL] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");
  const [previewImage, setPreviewImage] = useState(null); // add this line
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

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
        address: '0xc1aaa602B228e2e58c486A494c5A372edec10168',
        abi: abi,
        functionName: 'factories',
        args: [address],
      });
  
      const event = await readContract({
        address: result,
        abi: abi1,
        functionName: 'getCurrentEventNFT',
      });
  
      const duration = await readContract({
        address: event,
        abi: abi3,
        functionName: 'getDuration',
      });
  
      // Get current unix timestamp
      const currentTime = Math.floor(Date.now() / 1000);
      console.log(currentTime);
      console.log(duration);
  
      if (currentTime < duration) {
        setIsNewRegistered(true);
        router.push(`/profile/${address}`);
      } else {
        setIsNewRegistered(false);
      }
    };
  
    checkIfRegistered();
  }, [address, isConnected, router]);
  

  const onSubmit = async (e) => {
    e.preventDefault();

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
    
    const cid = metadata.url.split("ipfs://")[1];
    const metadataUrl = `https://ipfs.io/ipfs/${cid}`;
    
    setMetadataURL(metadataUrl);

    const metadataResponse = await fetch(metadataUrl);
    const metadataJson = await metadataResponse.json();
    
    const imageIpfsUrl = metadataJson.image;
    const imageHttpUrl = imageIpfsUrl.replace('ipfs://', 'https://ipfs.io/ipfs/');
    
    setImageURL(imageHttpUrl);

    const factoryContractAddress = await readContract({
      address: '0xc1aaa602B228e2e58c486A494c5A372edec10168',
      abi: abi,
      functionName: 'factories',
      args: [address],
    });

    const priceInWei = ethers.utils.parseEther(price);
    const stringWei = priceInWei.toString(10);

    console.log(typeof factoryContractAddress ,factoryContractAddress);
    console.log(typeof priceInWei);
    console.log(typeof metadataUrl);

    const { request: requestCreateProfileNFT } = await prepareWriteContract({
      address: factoryContractAddress,
      abi: abi1,
      functionName: 'createEventNFT',
      chainId:11155111,
      args: [metadataUrl,parseInt(duration),parseInt(stringWei),parseInt(amount)], // metadataUrl is used here
    });

    console.log(requestCreateProfileNFT);

    const { hash: createProfileNFTHash } = await writeContract(requestCreateProfileNFT);
    const data = await waitForTransaction({ hash: createProfileNFTHash });
    console.log(data);

    if (createProfileNFTHash) {
      router.push(`/profile/${address}`);
    } else {
      console.log('createProfileNFT execution failed');
    }
  
};
   

  return (
<div className="flex flex-col items-center justify-center min-h-screen py-2 bg-orange-100">
  {isConnected ? (
    isNewRegistered ? (
      <p>Redirecting to profile...</p>
    ) : (
      <form className="w-full max-w-sm" onSubmit={onSubmit}>
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="inline-full-name">
              Upload Image
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
                    Crop Image
                  </button>
                </div>
              )}
          </div>
        </div>
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="inline-full-name">
              Name
            </label>
          </div>
          <div className="md:w-2/3">
            <input className="bg-white-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" type="text" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
        </div>
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label className="block text-white-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="inline-full-name">
              Description
            </label>
          </div>
          <div className="md:w-2/3">
            <textarea className="bg-white-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" placeholder="Enter description" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
          </div>
        </div>
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label className="block text-white-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="inline-full-name">
              Duration
            </label>
          </div>
          <div className="md:w-2/3">
            <input className="bg-white-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" type="text" placeholder="Enter duration" value={duration} onChange={(e) => setDuration(e.target.value)} required />
          </div>
        </div>
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="inline-full-name">
              Price
            </label>
          </div>
          <div className="md:w-2/3">
            <input className="bg-white-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" type="text" placeholder="Enter price" value={price} onChange={(e) => setPrice(e.target.value)} required />
          </div>
        </div>
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="inline-full-name">
              Amount
            </label>
          </div>
          <div className="md:w-2/3">
            <input className="bg-white-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" type="text" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          </div>
        </div>
        <div className="md:flex md:items-center">
          <div className="md:w-1/3"></div>
          <div className="md:w-2/3">
            <button className="shadow bg-orange-500 hover:bg-orange-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="submit">
              Register
            </button>
          </div>
        </div>
      </form>
    )
  ) : (
    <p>Connect your wallet</p>
  )}
</div>



  );
};

export default NewEventRegister;
