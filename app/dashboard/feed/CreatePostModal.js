"use client";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  XMarkIcon,
  PhotoIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";

export default function CreatePostModal({ isOpen, onClose, onPost }) {
  const [formData, setFormData] = useState({
    content: "",
    media: null,
    isPublic: true,
    horseId: "",
  });
  const [mediaPreview, setMediaPreview] = useState(null);

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, media: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await fetch("/api/posts", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        const post = await response.json();
        onPost(post);
        resetForm();
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      content: "",
      media: null,
      isPublic: true,
      horseId: "",
    });
    setMediaPreview(null);
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
                      Create Post
                    </Dialog.Title>
                    <form onSubmit={handleSubmit} className="mt-6">
                      <textarea
                        rows={4}
                        value={formData.content}
                        onChange={(e) =>
                          setFormData({ ...formData, content: e.target.value })
                        }
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="What's on your mind?"
                        required
                      />

                      {mediaPreview && (
                        <div className="mt-4 relative">
                          <img
                            src={mediaPreview}
                            alt="Preview"
                            className="max-h-48 rounded-lg object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, media: null });
                              setMediaPreview(null);
                            }}
                            className="absolute top-2 right-2 rounded-full bg-gray-900 bg-opacity-50 p-1 text-white hover:bg-opacity-75"
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </button>
                        </div>
                      )}

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex space-x-4">
                          <label className="cursor-pointer text-gray-700 hover:text-gray-900">
                            <PhotoIcon className="h-6 w-6" />
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleMediaChange}
                              className="hidden"
                            />
                          </label>
                          <label className="cursor-pointer text-gray-700 hover:text-gray-900">
                            <VideoCameraIcon className="h-6 w-6" />
                            <input
                              type="file"
                              accept="video/*"
                              onChange={handleMediaChange}
                              className="hidden"
                            />
                          </label>
                        </div>
                        <div className="flex items-center">
                          <label className="mr-2 text-sm text-gray-700">
                            Public
                          </label>
                          <input
                            type="checkbox"
                            checked={formData.isPublic}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                isPublic: e.target.checked,
                              })
                            }
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        </div>
                      </div>

                      <div className="mt-5 sm:mt-6">
                        <button
                          type="submit"
                          className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                          Post
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
