import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Visit = () => {
  const router = useRouter();
  const { address, isConnecting, isDisconnected } = useAccount();

  // Extracting the input from query parameters
  const userInput = router.query.input;

  useEffect(() => {
    if (!isDisconnected && userInput) {
      router.push(`/profile/${userInput}`);
    }
  }, [isDisconnected, userInput, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      {isDisconnected ? (
        <ConnectButton />
      ) : (
        <span className="text-2xl text-green-500 font-bold animate-pulse">Conectando...</span>
      )}
    </div>
  );
};

export default Visit;
