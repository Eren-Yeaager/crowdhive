import Link from "next/link";
export function Header() {
  return (
    <header>
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <div className="text-2xl font-bold text-green-300">
          <a href="/">CrowdHive</a>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-6 text-lg text-gray-400">
          <a href="/" className="hover:text-green-400 transition">
            Home
          </a>
          <a href="/about" className="hover:text-green-400 transition">
            About
          </a>
          <a href="/projects" className="hover:text-green-400 transition">
            Projects
          </a>
          <a href="/contact" className="hover:text-green-400 transition">
            Contact
          </a>
        </nav>

        {/* Connect Wallet Button */}
        <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-500 transition">
          Connect Wallet
        </button>
      </div>
    </header>
  );
}
