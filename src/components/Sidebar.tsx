import Image from "next/image";

export default function Sidebar() {
  return (
    <div className="absolute left-0 top-0 w-[300px] h-[1190px] bg-white shadow-md flex flex-col justify-center items-center p-8 border-r">
      <Image src="/Green Industry.png" alt="Sidebar Image" width={150} height={150} className="mb-6" />
      <ul className="text-gray-700 space-y-4 text-center">
        <li className="flex items-center space-x-2">
          <span className="w-5 aspect-square flex items-center justify-center bg-yellow-500 text-white rounded-full text-xs font-bold shrink-0 mb-3">✓</span>
          <span>Save up to 40% on total energy costs</span>
        </li>
        <li className="flex items-center space-x-2">
          <span className="w-5 aspect-square flex items-center justify-center bg-yellow-500 text-white rounded-full text-xs font-bold shrink-0 mb-3">✓</span>
          <span>Market timing for green energy</span>
        </li>
        <li className="flex items-center space-x-2">
          <span className="w-5 aspect-square flex items-center justify-center bg-yellow-500 text-white rounded-full text-xs font-bold shrink-0 mb-3">✓</span>
          <span>Power plants from top suppliers</span>
        </li>
      </ul>
    </div>
  );
}