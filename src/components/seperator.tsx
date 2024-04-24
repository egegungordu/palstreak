
export default function Seperator({ orientation = "horizontal" }: { orientation?: "horizontal" | "vertical" }) {
  return <div className={`bg-neutral-200 ${orientation === "horizontal" ? "h-px" : "w-px"}`} />;
}
