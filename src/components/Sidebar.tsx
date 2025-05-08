import Image from "next/image";
import { useTranslation } from "react-i18next";

export default function Sidebar() {
  const { t } = useTranslation("CreateProfile");
  return (
    <div className="absolute left-0 top-0 w-[300px] h-[1190px] bg-white shadow-md flex flex-col justify-center items-center p-8 border-r">
      <Image src="/Green Industry.png" alt="Sidebar Image" width={150} height={150} className="mb-6" />
      <ul className="text-gray-700 space-y-4 text-center">
        <li className="flex items-center space-x-2">
          <span className="w-5 aspect-square flex items-center justify-center bg-yellow-500 text-white rounded-full text-xs font-bold shrink-0 mb-3">✓</span>
          <span>{t("sidebar.point1")}</span>
        </li>
        <li className="flex items-center space-x-2">
          <span className="w-5 aspect-square flex items-center justify-center bg-yellow-500 text-white rounded-full text-xs font-bold shrink-0 mb-3">✓</span>
          <span>{t("sidebar.point2")}</span>
        </li>
        <li className="flex items-center space-x-2">
          <span className="w-5 aspect-square flex items-center justify-center bg-yellow-500 text-white rounded-full text-xs font-bold shrink-0 mb-3">✓</span>
          <span>{t("sidebar.point3")}</span>
        </li>
      </ul>
    </div>
  );
}