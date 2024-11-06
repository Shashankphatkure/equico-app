"use client";
import { useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutline } from "@heroicons/react/24/outline";

export default function ReviewSection({ listingId, reviews }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId, rating, comment }),
      });
      if (response.ok) {
        setRating(0);
        setComment("");
        // Refresh reviews
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium text-gray-900">Reviews</h3>

      {/* Review Form */}
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="focus:outline-none"
            >
              {star <= rating ? (
                <StarIcon className="h-5 w-5 text-yellow-400" />
              ) : (
                <StarOutline className="h-5 w-5 text-gray-300" />
              )}
            </button>
          ))}
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="mt-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          rows={3}
          placeholder="Write your review..."
          required
        />
        <button
          type="submit"
          disabled={submitting || !rating}
          className="mt-4 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>

      {/* Reviews List */}
      <div className="mt-8 space-y-6">
        {reviews?.map((review) => (
          <div key={review.id} className="border-t border-gray-200 pt-6">
            <div className="flex items-center">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-5 w-5 ${
                      i < review.rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="ml-2 text-sm text-gray-500">
                by {review.user.name}
              </p>
            </div>
            <p className="mt-2 text-sm text-gray-600">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
