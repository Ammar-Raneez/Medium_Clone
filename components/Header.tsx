import Image from 'next/image';
import Link from 'next/link';

const Header = () => {
  return (
    <nav className="mx-auto flex max-w-7xl items-center justify-between p-5">
      <div className="flex items-center space-x-5">
        <Link href="/">
          <Image
            src="/logo.png"
            className="w-44 cursor-pointer object-contain"
            alt="logo"
            height={50}
            width={100}
          />
        </Link>

        <div className="hidden items-center space-x-5 md:inline-flex">
          <h3>About</h3>
          <h3>Contact</h3>
          <h3 className="rounded-full bg-green-600 px-5 py-1 text-white">
            Follow
          </h3>
        </div>
      </div>

      <div className="flex items-center space-x-5 text-green-600">
        <h3>Sign In</h3>
        <h3 className="rounded-full border border-green-600 px-5 py-1">
          Get Started
        </h3>
      </div>
    </nav>
  )
}

export default Header;
