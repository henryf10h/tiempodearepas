import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="w-full py-4 bg-white">
      <div className="container mx-auto text-center text-gray-600">
        Hecho por{" "}
        <Link href="https://twitter.com/Fenrir_67" legacyBehavior>
          <a className="text-green-500 font-bold" target="_blank" rel="noopener noreferrer">
            Fenrir
          </a>
        </Link>
        🐺
      </div>
    </footer>
  );
};

export default Footer;
