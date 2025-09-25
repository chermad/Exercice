import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-gray-900 px-3 py-3 sm:px-6 sm:py-4">
      <ul className="flex flex-col sm:flex-row gap-3 sm:gap-8 items-center list-none m-0 p-0">
        <li>
          <Link href="/" className="text-white hover:text-cyan-400 font-medium transition-colors px-2 py-1 rounded">accueil</Link>
        </li>
        <li>
          <Link href="/excercice-1" className="text-white hover:text-cyan-400 font-medium transition-colors px-2 py-1 rounded">excercice 1</Link>
        </li>
        <li>
          <Link href="/excercice-2" className="text-white hover:text-cyan-400 font-medium transition-colors px-2 py-1 rounded">excercice 2</Link>
        </li>
        <li>
          <Link href="/excercice-3" className="text-white hover:text-cyan-400 font-medium transition-colors px-2 py-1 rounded">excercice 3</Link>
        </li>
      </ul>
    </nav>
  );
}
