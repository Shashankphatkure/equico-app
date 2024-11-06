"use client";
import { useState } from "react";
import {
  CalendarIcon,
  PlusIcon,
  ClockIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import AddMedicalRecordModal from "./AddMedicalRecordModal";
import AddAppointmentModal from "./AddAppointmentModal";

export default function HorseDetails({ params }) {
  const [activeTab, setActiveTab] = useState("medical");
  const [medicalModalOpen, setMedicalModalOpen] = useState(false);
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Thunder</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage medical records and appointments
          </p>
        </div>
        <div className="mt-4 flex space-x-3 sm:mt-0">
          <button
            onClick={() => setMedicalModalOpen(true)}
            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            <DocumentTextIcon className="h-5 w-5 mr-2" />
            Add Medical Record
          </button>
          <button
            onClick={() => setAppointmentModalOpen(true)}
            className="inline-flex items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <CalendarIcon className="h-5 w-5 mr-2" />
            Schedule Appointment
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("medical")}
            className={`${
              activeTab === "medical"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
          >
            Medical Records
          </button>
          <button
            onClick={() => setActiveTab("appointments")}
            className={`${
              activeTab === "appointments"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
          >
            Appointments
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="mt-8">
        {activeTab === "medical" ? (
          <div className="space-y-6">
            {/* Sample medical record */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Annual Checkup
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">March 15, 2024</p>
                </div>
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-sm font-medium text-green-800">
                  Completed
                </span>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  Routine annual checkup. All vitals normal. Vaccines updated.
                </p>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <DocumentTextIcon className="h-5 w-5 mr-2" />
                Dr. Smith - Valley Equine Clinic
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Sample appointment */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Farrier Visit
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    April 5, 2024 - 2:00 PM
                  </p>
                </div>
                <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-sm font-medium text-blue-800">
                  Scheduled
                </span>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  Regular trimming and shoeing
                </p>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <ClockIcon className="h-5 w-5 mr-2" />
                John Miller - Mobile Farrier Services
              </div>
            </div>
          </div>
        )}
      </div>

      <AddMedicalRecordModal
        isOpen={medicalModalOpen}
        onClose={() => setMedicalModalOpen(false)}
        horseId={params.id}
      />
      <AddAppointmentModal
        isOpen={appointmentModalOpen}
        onClose={() => setAppointmentModalOpen(false)}
        horseId={params.id}
      />
    </div>
  );
}
