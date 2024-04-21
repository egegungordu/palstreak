import AccountDropdown from "./account-dropdown";

export default function Sidebar() {
  return (
    <div className="h-full min-h-screen border-r w-64 bg-stone-100 flex flex-col p-2">
      <AccountDropdown />
    </div>
  );
}
