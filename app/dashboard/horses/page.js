"use client";
import { useState } from "react";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import AddHorseModal from "./AddHorseModal";

const sampleHorses = [
  {
    id: 1,
    name: "Thunder",
    breed: "Arabian",
    color: "Bay",
    age: 7,
    nextVetVisit: "2024-04-15",
    nextFarrierVisit: "2024-03-20",
  },
  // Add more sample horses here
];

export default function Horses() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHorse, setSelectedHorse] = useState(null);

  const handleEdit = (horse) => {
    setSelectedHorse(horse);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">My Horses</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your horses' profiles, health records, and training logs
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedHorse(null);
            setIsModalOpen(true);
          }}
          className="mt-4 inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:mt-0"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Horse
        </button>
      </div>

      {/* Horse Cards Grid */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sampleHorses.map((horse) => (
          <div
            key={horse.id}
            className="relative rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                {horse.name}
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(horse)}
                  className="rounded p-1 text-gray-400 hover:bg-gray-50 hover:text-gray-500"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button className="rounded p-1 text-gray-400 hover:bg-gray-50 hover:text-red-500">
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            <dl className="mt-4 space-y-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Breed</dt>
                <dd className="text-sm text-gray-900">{horse.breed}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Color</dt>
                <dd className="text-sm text-gray-900">{horse.color}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Age</dt>
                <dd className="text-sm text-gray-900">{horse.age} years</dd>
              </div>
            </dl>
            <div className="mt-4 border-t border-gray-200 pt-4">
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium text-gray-500">
                    Next Vet Visit:{" "}
                  </span>
                  <span className="text-gray-900">{horse.nextVetVisit}</span>
                </p>
                <p className="text-sm">
                  <span className="font-medium text-gray-500">
                    Next Farrier:{" "}
                  </span>
                  <span className="text-gray-900">
                    {horse.nextFarrierVisit}
                  </span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AddHorseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        horse={selectedHorse}
      />
    </div>
  );
}
