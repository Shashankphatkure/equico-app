"use client";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon, CameraIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

export default function EditProfileModal({
  isOpen,
  onClose,
  profile,
  onUpdate,
}) {
  const [formData, setFormData] = useState({
    name: profile?.name || "",
    bio: profile?.bio || "",
    profileImage: null,
  });
  const [imagePreview, setImagePreview] = useState(
    profile?.profileImage || null
  );
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profileImage: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await fetch("/api/profile", {
        method: "PUT",
        body: formDataToSend,
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        onUpdate(updatedProfile);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
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
                      Edit Profile
                    </Dialog.Title>
                    <form onSubmit={handleSubmit} className="mt-6">
                      <div className="space-y-6">
                        {/* Profile Image */}
                        <div className="flex flex-col items-center">
                          <div className="relative h-24 w-24 group">
                            {imagePreview ? (
                              <Image
                                src={imagePreview}
                                alt="Profile"
                                fill
                                className="rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                                <CameraIcon className="h-8 w-8 text-gray-400" />
                              </div>
                            )}
                            <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity">
                              <CameraIcon className="h-8 w-8 text-white" />
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                              />
                            </label>
                          </div>
                          <p className="mt-2 text-sm text-gray-500">
                            Click to change profile picture
                          </p>
                        </div>

                        {/* Name */}
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

                        {/* Bio */}
                        <div>
                          <label
                            htmlFor="bio"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Bio
                          </label>
                          <textarea
                            id="bio"
                            rows={3}
                            value={formData.bio}
                            onChange={(e) =>
                              setFormData({ ...formData, bio: e.target.value })
                            }
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>
                      </div>

                      <div className="mt-5 sm:mt-6">
                        <button
                          type="submit"
                          disabled={loading}
                          className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                        >
                          {loading ? "Saving..." : "Save Changes"}
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
