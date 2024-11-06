"use client";
import { Fragment, useState } from "react";
import { Dialog, Transition, Listbox } from "@headlessui/react";
import {
  XMarkIcon,
  CheckIcon,
  ChevronUpDownIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";

const categories = [
  "Saddles",
  "Bridles",
  "Riding Wear",
  "Grooming",
  "Safety Gear",
  "Accessories",
];

const conditions = [
  { id: "new", name: "New", description: "Brand new, unused item" },
  {
    id: "like-new",
    name: "Like New",
    description: "Used once or twice, in perfect condition",
  },
  { id: "used", name: "Used", description: "Used but in good condition" },
  {
    id: "for-parts",
    name: "For Parts",
    description: "Not fully functional, useful for parts",
  },
];

export default function CreateListingModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: categories[0],
    condition: conditions[0],
    images: [],
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles((prev) => [...prev, ...files]);

    // Create preview URLs
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newPreviews],
    }));
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("condition", formData.condition.id);

      imageFiles.forEach((file) => {
        formDataToSend.append("images", file);
      });

      const response = await fetch("/api/marketplace/listings", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        onSuccess();
        onClose();
        resetForm();
      }
    } catch (error) {
      console.error("Error creating listing:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      price: "",
      category: categories[0],
      condition: conditions[0],
      images: [],
    });
    setImageFiles([]);
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
                      Create New Listing
                    </Dialog.Title>
                    <form onSubmit={handleSubmit} className="mt-6">
                      <div className="space-y-6">
                        {/* Title */}
                        <div>
                          <label
                            htmlFor="title"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Title
                          </label>
                          <input
                            type="text"
                            id="title"
                            value={formData.title}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                title: e.target.value,
                              })
                            }
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                          />
                        </div>

                        {/* Category */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Category
                          </label>
                          <Listbox
                            value={formData.category}
                            onChange={(value) =>
                              setFormData({ ...formData, category: value })
                            }
                          >
                            <div className="relative mt-1">
                              <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                                <span className="block truncate">
                                  {formData.category}
                                </span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
                                </span>
                              </Listbox.Button>
                              <Transition
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                              >
                                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                  {categories.map((category) => (
                                    <Listbox.Option
                                      key={category}
                                      value={category}
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
                                            {category}
                                          </span>
                                          {selected && (
                                            <span
                                              className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                                active
                                                  ? "text-white"
                                                  : "text-indigo-600"
                                              }`}
                                            >
                                              <CheckIcon className="h-5 w-5" />
                                            </span>
                                          )}
                                        </>
                                      )}
                                    </Listbox.Option>
                                  ))}
                                </Listbox.Options>
                              </Transition>
                            </div>
                          </Listbox>
                        </div>

                        {/* Condition */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Condition
                          </label>
                          <Listbox
                            value={formData.condition}
                            onChange={(value) =>
                              setFormData({ ...formData, condition: value })
                            }
                          >
                            <div className="relative mt-1">
                              <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                                <span className="block truncate">
                                  {formData.condition.name}
                                </span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
                                </span>
                              </Listbox.Button>
                              <Transition
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                              >
                                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                  {conditions.map((condition) => (
                                    <Listbox.Option
                                      key={condition.id}
                                      value={condition}
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
                                          <div>
                                            <span
                                              className={`block truncate ${
                                                selected
                                                  ? "font-medium"
                                                  : "font-normal"
                                              }`}
                                            >
                                              {condition.name}
                                            </span>
                                            <span
                                              className={`block truncate text-sm ${
                                                active
                                                  ? "text-indigo-200"
                                                  : "text-gray-500"
                                              }`}
                                            >
                                              {condition.description}
                                            </span>
                                          </div>
                                          {selected && (
                                            <span
                                              className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                                active
                                                  ? "text-white"
                                                  : "text-indigo-600"
                                              }`}
                                            >
                                              <CheckIcon className="h-5 w-5" />
                                            </span>
                                          )}
                                        </>
                                      )}
                                    </Listbox.Option>
                                  ))}
                                </Listbox.Options>
                              </Transition>
                            </div>
                          </Listbox>
                        </div>

                        {/* Price */}
                        <div>
                          <label
                            htmlFor="price"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Price
                          </label>
                          <div className="relative mt-1 rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                              <span className="text-gray-500 sm:text-sm">
                                $
                              </span>
                            </div>
                            <input
                              type="number"
                              id="price"
                              step="0.01"
                              min="0"
                              value={formData.price}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  price: e.target.value,
                                })
                              }
                              className="block w-full rounded-md border-gray-300 pl-7 focus:border-indigo-500 focus:ring-indigo-500"
                              required
                            />
                          </div>
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
                            required
                          />
                        </div>

                        {/* Images */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Images
                          </label>
                          <div className="mt-2 grid grid-cols-3 gap-4">
                            {formData.images.map((image, index) => (
                              <div
                                key={index}
                                className="relative aspect-square"
                              >
                                <img
                                  src={image}
                                  alt={`Preview ${index + 1}`}
                                  className="h-full w-full object-cover rounded-lg"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute -top-2 -right-2 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 shadow-sm"
                                >
                                  <XMarkIcon className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                            {formData.images.length < 6 && (
                              <label className="relative aspect-square cursor-pointer rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-gray-400">
                                <div className="space-y-1 text-center">
                                  <PhotoIcon className="mx-auto h-8 w-8 text-gray-400" />
                                  <div className="text-xs text-gray-500">
                                    Add Image
                                  </div>
                                </div>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleImageChange}
                                  className="hidden"
                                />
                              </label>
                            )}
                          </div>
                          <p className="mt-2 text-xs text-gray-500">
                            Add up to 6 images. First image will be the cover
                            image.
                          </p>
                        </div>
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
                          {loading ? "Creating..." : "Create Listing"}
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
