"use client";
import { Fragment, useState } from "react";
import { Dialog, Transition, Listbox } from "@headlessui/react";
import {
  XMarkIcon,
  CheckIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";

const appointmentTypes = [
  "Veterinary Visit",
  "Farrier",
  "Training Session",
  "Dental Care",
  "Chiropractic",
  "Other",
];

export default function AddAppointmentModal({ isOpen, onClose, horseId }) {
  const [formData, setFormData] = useState({
    type: appointmentTypes[0],
    date: "",
    time: "",
    provider: "",
    notes: "",
    reminder: true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dateTime = new Date(`${formData.date}T${formData.time}`);

      const response = await fetch(`/api/horses/${horseId}/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          date: dateTime.toISOString(),
        }),
      });

      if (response.ok) {
        onClose();
        // Refresh appointments list
      }
    } catch (error) {
      console.error("Error scheduling appointment:", error);
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
                      Schedule Appointment
                    </Dialog.Title>
                    <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Appointment Type
                        </label>
                        <Listbox
                          value={formData.type}
                          onChange={(value) =>
                            setFormData({ ...formData, type: value })
                          }
                        >
                          <div className="relative mt-1">
                            <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
                              <span className="block truncate">
                                {formData.type}
                              </span>
                              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <ChevronUpDownIcon
                                  className="h-5 w-5 text-gray-400"
                                  aria-hidden="true"
                                />
                              </span>
                            </Listbox.Button>
                            <Transition
                              as={Fragment}
                              leave="transition ease-in duration-100"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                            >
                              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {appointmentTypes.map((type) => (
                                  <Listbox.Option
                                    key={type}
                                    value={type}
                                    className={({ active }) =>
                                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                        active
                                          ? "bg-indigo-600 text-white"
                                          : "text-gray-900"
                                      }`
                                    }
                                  >
                                    {({ selected, active }) => (
                                      <>
                                        <span
                                          className={`block truncate ${
                                            selected
                                              ? "font-medium"
                                              : "font-normal"
                                          }`}
                                        >
                                          {type}
                                        </span>
                                        {selected ? (
                                          <span
                                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                              active
                                                ? "text-white"
                                                : "text-indigo-600"
                                            }`}
                                          >
                                            <CheckIcon
                                              className="h-5 w-5"
                                              aria-hidden="true"
                                            />
                                          </span>
                                        ) : null}
                                      </>
                                    )}
                                  </Listbox.Option>
                                ))}
                              </Listbox.Options>
                            </Transition>
                          </div>
                        </Listbox>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="date"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Date
                          </label>
                          <input
                            type="date"
                            id="date"
                            value={formData.date}
                            onChange={(e) =>
                              setFormData({ ...formData, date: e.target.value })
                            }
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="time"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Time
                          </label>
                          <input
                            type="time"
                            id="time"
                            value={formData.time}
                            onChange={(e) =>
                              setFormData({ ...formData, time: e.target.value })
                            }
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="provider"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Provider
                        </label>
                        <input
                          type="text"
                          id="provider"
                          value={formData.provider}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              provider: e.target.value,
                            })
                          }
                          placeholder="Name of vet, farrier, or trainer"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="notes"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Notes
                        </label>
                        <textarea
                          id="notes"
                          rows={3}
                          value={formData.notes}
                          onChange={(e) =>
                            setFormData({ ...formData, notes: e.target.value })
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      </div>

                      <div className="flex items-center">
                        <input
                          id="reminder"
                          type="checkbox"
                          checked={formData.reminder}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              reminder: e.target.checked,
                            })
                          }
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label
                          htmlFor="reminder"
                          className="ml-2 block text-sm text-gray-900"
                        >
                          Send me a reminder
                        </label>
                      </div>

                      <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                        <button
                          type="submit"
                          className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                        >
                          Schedule
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
