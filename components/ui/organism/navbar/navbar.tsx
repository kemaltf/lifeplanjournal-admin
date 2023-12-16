import { UserNav } from '../../molecules/user-nav';
import { MainNav } from './main-nav';

export default function Navbar() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <div>This component of navbar</div>
        <MainNav className="mx-6"></MainNav>
        <div className="ml-auto flex items-center space-x-4">
          <UserNav />
        </div>
      </div>
    </div>
  );
}
