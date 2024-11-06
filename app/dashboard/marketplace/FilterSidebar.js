"use client";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const conditions = ["new", "like-new", "used", "for-parts"];
const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "most-viewed", label: "Most Viewed" },
];

export default function FilterSidebar({
  show,
  onClose,
  filters,
  onFilterChange,
}) {
  const handleConditionChange = (condition) => {
    const newConditions = filters.condition.includes(condition)
      ? filters.condition.filter((c) => c !== condition)
      : [...filters.condition, condition];
    onFilterChange({ ...filters, condition: newConditions });
  };

  const handlePriceChange = (field, value) => {
    onFilterChange({ ...filters, [field]: value });
  };

  return (
    <>
      {/* Mobile filter dialog */}
      <Transition.Root show={show} as={Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                <div className="flex items-center justify-between px-4">
                  <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                  <button
                    type="button"
                    className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Filters */}
                <div className="mt-4 border-t border-gray-200">
                  <FilterContent
                    filters={filters}
                    onConditionChange={handleConditionChange}
                    onPriceChange={handlePriceChange}
                    onSortChange={(value) =>
                      onFilterChange({ ...filters, sortBy: value })
                    }
                  />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop filter sidebar */}
      <div className="hidden lg:block">
        <div className="fixed w-64 top-0 bottom-0 left-0 overflow-y-auto bg-white border-r border-gray-200 pt-24 px-4">
          <h2 className="text-lg font-medium text-gray-900">Filters</h2>
          <FilterContent
            filters={filters}
            onConditionChange={handleConditionChange}
            onPriceChange={handlePriceChange}
            onSortChange={(value) =>
              onFilterChange({ ...filters, sortBy: value })
            }
          />
        </div>
      </div>
    </>
  );
}

function FilterContent({
  filters,
  onConditionChange,
  onPriceChange,
  onSortChange,
}) {
  return (
    <div className="space-y-6 px-4">
      {/* Sort */}
      <div>
        <h3 className="text-sm font-medium text-gray-900">Sort By</h3>
        <select
          value={filters.sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="mt-2 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Condition */}
      <div>
        <h3 className="text-sm font-medium text-gray-900">Condition</h3>
        <div className="mt-2 space-y-2">
          {conditions.map((condition) => (
            <div key={condition} className="flex items-center">
              <input
                id={`condition-${condition}`}
                type="checkbox"
                checked={filters.condition.includes(condition)}
                onChange={() => onConditionChange(condition)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label
                htmlFor={`condition-${condition}`}
                className="ml-3 text-sm text-gray-600 capitalize"
              >
                {condition.replace("-", " ")}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-medium text-gray-900">Price Range</h3>
        <div className="mt-2 grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="min-price" className="sr-only">
              Minimum Price
            </label>
            <input
              type="number"
              id="min-price"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => onPriceChange("minPrice", e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="max-price" className="sr-only">
              Maximum Price
            </label>
            <input
              type="number"
              id="max-price"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => onPriceChange("maxPrice", e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Clear Filters */}
      <button
        onClick={() =>
          onPriceChange("all", {
            condition: [],
            minPrice: "",
            maxPrice: "",
            sortBy: "newest",
          })
        }
        className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Clear All Filters
      </button>
    </div>
  );
}
