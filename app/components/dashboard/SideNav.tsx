import MyLogo from "./MyLogo";
import NavLinks from "./NavLinks";
import SignOutButton from "./SignOutButton";

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <div className="mb-2 flex h-20 items-center justify-start rounded-md bg-indigo-600 p-4 md:h-40">
        <MyLogo />
      </div>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <div className="md:hidden">
          <SignOutButton isMobile={true} />
        </div>
        <div className="hidden w-full md:block">
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}
