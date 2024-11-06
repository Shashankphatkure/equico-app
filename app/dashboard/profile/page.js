"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  UserIcon,
  CameraIcon,
  UsersIcon,
  NewspaperIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import EditProfileModal from "./EditProfileModal";
import PostCard from "../feed/PostCard";

const tabs = [
  { name: "Posts", icon: NewspaperIcon },
  { name: "Horses", icon: UsersIcon },
  { name: "Liked", icon: HeartIcon },
];

export default function Profile() {
  const [activeTab, setActiveTab] = useState("Posts");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
    fetchPosts();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/profile");
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/profile/posts");
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Profile Header */}
      <div className="relative h-48 rounded-lg bg-indigo-100 mb-8">
        <div className="absolute -bottom-16 left-8 flex items-end space-x-5">
          <div className="relative h-32 w-32">
            {profile.profileImage ? (
              <Image
                src={profile.profileImage}
                alt={profile.name}
                fill
                className="rounded-full ring-4 ring-white"
              />
            ) : (
              <div className="h-32 w-32 rounded-full bg-gray-200 ring-4 ring-white flex items-center justify-center">
                <UserIcon className="h-16 w-16 text-gray-400" />
              </div>
            )}
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="absolute bottom-0 right-0 rounded-full bg-white p-2 shadow-lg hover:bg-gray-50"
            >
              <CameraIcon className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="mt-16 sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <div className="flex items-center">
              <span className="font-medium text-gray-900">
                {profile.followers}
              </span>
              <span className="mx-1">followers</span>
            </div>
            <span className="mx-2">·</span>
            <div className="flex items-center">
              <span className="font-medium text-gray-900">
                {profile.following}
              </span>
              <span className="mx-1">following</span>
            </div>
          </div>
        </div>
        <div className="mt-5 flex sm:mt-0">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`${
                activeTab === tab.name
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              } flex items-center whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
            >
              <tab.icon className="h-5 w-5 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-8">
        {activeTab === "Posts" && (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
        {activeTab === "Horses" && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {profile.horses?.map((horse) => (
              <div
                key={horse.id}
                className="relative rounded-lg border border-gray-200 bg-white p-6"
              >
                <h3 className="text-lg font-medium text-gray-900">
                  {horse.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500">{horse.breed}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profile={profile}
        onUpdate={(updatedProfile) => {
          setProfile(updatedProfile);
          setIsEditModalOpen(false);
        }}
      />
    </div>
  );
}
