import { LuLoader } from "react-icons/lu";

export default function Loader() {
  return (
    <div className="flex items-center justify-center h-20">
      <LuLoader className="animate-spin text-xl text-text-disabled" />
    </div>
  );
}
