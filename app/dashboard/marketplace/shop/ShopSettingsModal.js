"use client";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon, PhotoIcon } from "@heroicons/react/24/outline";

export default function ShopSettingsModal({ isOpen, onClose, shop, onUpdate }) {
  const [formData, setFormData] = useState({
    name: shop?.name || "",
    description: shop?.description || "",
    profileImage: null,
  });
  const [imagePreview, setImagePreview] = useState(shop?.profileImage);
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
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      if (formData.profileImage) {
        formDataToSend.append("profileImage", formData.profileImage);
      }

      const response = await fetch("/api/marketplace/shop", {
        method: "PUT",
        body: formDataToSend,
      });

      if (response.ok) {
        const updatedShop = await response.json();
        onUpdate(updatedShop);
        onClose();
      }
    } catch (error) {
      console.error("Error updating shop:", error);
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
                      Shop Settings
                    </Dialog.Title>
                    <form onSubmit={handleSubmit} className="mt-6">
                      <div className="space-y-6">
                        {/* Shop Image */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Shop Image
                          </label>
                          <div className="mt-2 flex items-center space-x-6">
                            <div className="relative h-24 w-24 group">
                              {imagePreview ? (
                                <img
                                  src={imagePreview}
                                  alt="Shop"
                                  className="h-24 w-24 rounded-lg object-cover"
                                />
                              ) : (
                                <div className="h-24 w-24 rounded-lg bg-gray-200 flex items-center justify-center">
                                  <PhotoIcon className="h-8 w-8 text-gray-400" />
                                </div>
                              )}
                              <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 rounded-lg cursor-pointer transition-opacity">
                                <PhotoIcon className="h-8 w-8 text-white" />
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleImageChange}
                                  className="hidden"
                                />
                              </label>
                            </div>
                            <p className="text-sm text-gray-500">
                              Click to upload a new shop image
                            </p>
                          </div>
                        </div>

                        {/* Shop Name */}
                        <div>
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Shop Name
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

                        {/* Description */}
                        <div>
                          <label
                            htmlFor="description"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Description
                          </label>
                          <textarea
                            id="description"
                            rows={4}
                            value={formData.description}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                description: e.target.value,
                              })
                            }
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          />
                          <p className="mt-2 text-sm text-gray-500">
                            Brief description of your shop and what you sell.
                          </p>
                        </div>

                        {/* Premium Features */}
                        {!shop?.isPremium && (
                          <div className="rounded-lg bg-indigo-50 p-4">
                            <h4 className="text-sm font-medium text-indigo-800">
                              Upgrade to Premium
                            </h4>
                            <p className="mt-1 text-sm text-indigo-700">
                              Get verified status, boost listings, and access
                              advanced analytics.
                            </p>
                            <button
                              type="button"
                              onClick={() =>
                                (window.location.href =
                                  "/dashboard/marketplace/shop/upgrade")
                              }
                              className="mt-4 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
                            >
                              Learn more
                              <span className="ml-2">→</span>
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="mt-6 flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={onClose}
                          className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
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
