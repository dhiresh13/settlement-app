import Link from "next/link";
import Image from "next/image";
import logo from "../../logo.png";

const LayoutScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Image src={logo} alt="Leyline Technologies" width={200} height={200} />
      <h1 className="text-3xl font-bold mb-8 text-center px-4">
        Welcome to the Chat App
      </h1>
      <div className="flex flex-col sm:flex-row">
        <Link href="/chat/partyA">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 sm:mb-0 sm:mr-4">
            Party A
          </button>
        </Link>
        <Link href="/chat/partyB">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Party B
          </button>
        </Link>
      </div>
    </div>
  );
};

export default LayoutScreen;
