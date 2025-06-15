// src/app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-10 select-none">Gestionnaire de Combat D&D</h1>
      <div className="flex gap-8">
        {/* Version Maître du Jeu */}
        <Link
          href="/maitre"
          className="px-8 py-6 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 shadow-xl text-2xl font-semibold hover:scale-105 transition select-none"
        >
          Version Maître du Jeu
        </Link>
        {/* Version Joueur */}
        <Link
          href="/joueur"
          className="px-8 py-6 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 shadow-xl text-2xl font-semibold hover:scale-105 transition select-none"
        >
          Version Joueur
        </Link>
      </div>
    </main>
  );
}
