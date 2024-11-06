"use client";
import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function AddHorseModal({ isOpen, onClose, horse = null }) {
  const [formData, setFormData] = useState({
    name: "",
    breed: "",
    color: "",
    dateOfBirth: "",
    gender: "",
    registrationNumber: "",
    microchipNumber: "",
    notes: "",
  });

  useEffect(() => {
    if (horse) {
      setFormData({
        name: horse.name || "",
        breed: horse.breed || "",
        color: horse.color || "",
        dateOfBirth: horse.dateOfBirth || "",
        gender: horse.gender || "",
        registrationNumber: horse.registrationNumber || "",
        microchipNumber: horse.microchipNumber || "",
        notes: horse.notes || "",
      });
    } else {
      setFormData({
        name: "",
        breed: "",
        color: "",
        dateOfBirth: "",
        gender: "",
        registrationNumber: "",
        microchipNumber: "",
        notes: "",
      });
    }
  }, [horse]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = horse ? `/api/horses/${horse.id}` : "/api/horses";
      const method = horse ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onClose();
        // Refresh the horses list
      }
    } catch (error) {
      console.error("Error saving horse:", error);
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 w-full sm:mt-0">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-semibold leading-6 text-gray-900"
                    >
                      {horse ? "Edit Horse" : "Add New Horse"}
                    </Dialog.Title>
                    <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="breed"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Breed
                          </label>
                          <input
                            type="text"
                            id="breed"
                            value={formData.breed}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                breed: e.target.value,
                              })
                            }
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>
                        {/* Add more form fields here */}
                      </div>
                      <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                        <button
                          type="submit"
                          className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                        >
                          {horse ? "Save Changes" : "Add Horse"}
                        </button>
                        <button
                          type="button"
                          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                          onClick={onClose}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
