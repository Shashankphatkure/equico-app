"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { XMarkIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { Listbox, Transition } from "@headlessui/react";

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

export default function EditListing({ params }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: categories[0],
    condition: conditions[0],
    images: [],
    status: "active",
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);

  useEffect(() => {
    fetchListing();
  }, [params.id]);

  const fetchListing = async () => {
    try {
      const response = await fetch(`/api/marketplace/listings/${params.id}`);
      if (response.ok) {
        const listing = await response.json();
        setFormData({
          title: listing.title,
          description: listing.description,
          price: listing.price.toString(),
          category: listing.category,
          condition:
            conditions.find((c) => c.id === listing.condition) || conditions[0],
          images: listing.images,
          status: listing.status,
        });
      }
    } catch (error) {
      console.error("Error fetching listing:", error);
    } finally {
      setLoading(false);
    }
  };

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
    const image = formData.images[index];
    if (typeof image === "string" && image.startsWith("http")) {
      setDeletedImages((prev) => [...prev, image]);
    }
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("condition", formData.condition.id);
      formDataToSend.append("status", formData.status);
      formDataToSend.append("deletedImages", deletedImages.join(","));

      imageFiles.forEach((file) => {
        formDataToSend.append("images", file);
      });

      const response = await fetch(`/api/marketplace/listings/${params.id}`, {
        method: "PUT",
        body: formDataToSend,
      });

      if (response.ok) {
        router.push("/dashboard/marketplace/shop");
      }
    } catch (error) {
      console.error("Error updating listing:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="h-64 bg-gray-200 rounded" />
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <form onSubmit={handleSubmit} className="space-y-6">
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
              setFormData({ ...formData, title: e.target.value })
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
              <div key={index} className="relative aspect-square">
                <Image
                  src={image}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="object-cover rounded-lg"
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
                  <div className="text-xs text-gray-500">Add Image</div>
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
            Add up to 6 images. First image will be the cover image.
          </p>
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
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              id="price"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="block w-full rounded-md border-gray-300 pl-7 focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Condition */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Condition
          </label>
          <select
            value={formData.condition.id}
            onChange={(e) =>
              setFormData({
                ...formData,
                condition: conditions.find((c) => c.id === e.target.value),
              })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {conditions.map((condition) => (
              <option key={condition.id} value={condition.id}>
                {condition.name} - {condition.description}
              </option>
            ))}
          </select>
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
              setFormData({ ...formData, description: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="active">Active</option>
            <option value="sold">Sold</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
