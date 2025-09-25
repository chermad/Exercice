import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-gray-900 px-8 py-4">
      <ul className="flex gap-8 list-none m-0 p-0">
        <li>
          <Link href="/" className="text-white hover:text-cyan-400 font-medium transition-colors">accueil</Link>
        </li>
        <li>
          <Link href="/excercice-1" className="text-white hover:text-cyan-400 font-medium transition-colors">excercice 1</Link>
        </li>
        <li>
          <Link href="/excercice-2" className="text-white hover:text-cyan-400 font-medium transition-colors">excercice 2</Link>
        </li>
        <li>
          <Link href="/excercice-3" className="text-white hover:text-cyan-400 font-medium transition-colors">excercice 3</Link>
        </li>
      </ul>
    </nav>
  );
}
