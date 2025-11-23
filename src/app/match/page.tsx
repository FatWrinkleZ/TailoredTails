'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/config';
import Image from 'next/image';

type Dog = {
  id: string;
  image_url: string;
  name: string;
  gender: string;
  breed: string;
  age: string;
  location: string;
  embedding: [number, number, number, number, number];
};

const TRAITS = [
  { label: "Cleanliness", color: "bg-blue-500" },
  { label: "Low Energy", color: "bg-green-500" },
  { label: "Dog-Social", color: "bg-purple-500" },
  { label: "Independent", color: "bg-orange-500" },
  { label: "Kid-Friendly", color: "bg-pink-500" },
];

const DOGS_PER_PAGE = 30;

export default function DogsPage() {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchDogs() {
      try {
        const querySnapshot = await getDocs(collection(db, "dogs"));
        const dogsList: Dog[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Dog));

        dogsList.sort((a, b) => a.name.localeCompare(b.name));
        setDogs(dogsList);
      } catch (err) {
        console.error(err);
        alert("Failed to load dogs. Check Firestore rules.");
      } finally {
        setLoading(false);
      }
    }
    fetchDogs();
  }, []);

  const totalPages = Math.ceil(dogs.length / DOGS_PER_PAGE);
  const startIndex = (currentPage - 1) * DOGS_PER_PAGE;
  const currentDogs = dogs.slice(startIndex, startIndex + DOGS_PER_PAGE);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-xl text-gray-300">Loading {dogs.length || ''} beautiful dogs...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-3">
            Adoptable Dogs
          </h1>
          <p className="text-xl text-gray-400">
            {dogs.length} dogs waiting for their forever home
          </p>
        </div>

        {/* Dog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {currentDogs.map((dog) => (
                    <a
            key={dog.id}
            href={`https://24petconnect.com/DetailsMain/MIAD/${dog.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <div
              key={dog.id}
              className="bg-gray-800 rounded-xl overflow-hidden shadow-xl border border-gray-700 hover:border-gray-600 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative aspect-square bg-gray-700">
                <Image
                  src={dog.image_url || "/placeholder-dog.jpg"}
                  alt={dog.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {dog.name}
                </h2>
                <p className="text-gray-300 font-medium mb-3">
                  {dog.breed} • {dog.age} • {dog.gender}
                </p>
                <p className="text-sm text-gray-500 mb-6">{dog.location}</p>

                {/* Temperament Bars */}
                <div className="space-y-3">
                  {dog.embedding.map((score, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-xs font-medium text-gray-400 w-28">
                        {TRAITS[i].label}
                      </span>
                      <div className="flex-1 bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div
                          className={`${TRAITS[i].color} h-full transition-all duration-700 ease-out shadow-lg`}
                          style={{ width: `${score * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-gray-300 w-10 text-right">
                        {(score * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            </a>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-6">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-all"
          >
            Previous
          </button>

          <span className="text-lg font-medium text-gray-300">
            Page <span className="text-blue-400 font-bold">{currentPage}</span> of{' '}
            <span className="text-blue-400 font-bold">{totalPages}</span>
          </span>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-all"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}