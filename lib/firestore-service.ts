import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
  orderBy,
  arrayUnion,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";
import { Listing, mockListings, mockRoommatePosts, RoommatePost, Review } from "@/data/mockData";

export const COLLECTION_NAME = "listings";
export const ROOMMATE_COLLECTION_NAME = "roommates";

// Get all approved listings (optionally filtered by category)
export async function getListings(
  category?: "students" | "studentesses",
): Promise<Listing[]> {
  const getMockData = () => {
    let list = mockListings.filter((l) => !l.isPending);
    if (category) {
      list = list.filter((l) => l.category === category);
    }
    return list;
  };

  if (!db) return getMockData();

  try {
    let q = query(
      collection(db, COLLECTION_NAME),
      where("isPending", "==", false),
    );

    if (category) {
      q = query(q, where("category", "==", category));
    }

    const querySnapshot = await getDocs(q);
    const firestoreListings = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Listing[];

    if (firestoreListings.length > 0) {
      // Append local reviews to Firestore listings if any exist in localStorage
      if (typeof window !== "undefined") {
        firestoreListings.forEach((listing) => {
          const local = localStorage.getItem(`local_reviews_${listing.id}`);
          if (local) {
            listing.reviews = [...(listing.reviews || []), ...JSON.parse(local)];
          }
        });
      }
      return firestoreListings;
    }
    return getMockData();
  } catch (error) {
    console.error("Error fetching listings from Firestore, falling back to mock data:", error);
    return getMockData();
  }
}

// Get all pending listings (for admin)
export async function getPendingListings(): Promise<Listing[]> {
  const getMockPending = () => mockListings.filter((l) => l.isPending);

  if (!db) return getMockPending();

  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("isPending", "==", true),
    );
    const querySnapshot = await getDocs(q);
    const pending = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Listing[];

    if (pending.length > 0) {
      return pending;
    }
    return getMockPending();
  } catch (error) {
    console.error("Error fetching pending listings, falling back to mock pending:", error);
    return getMockPending();
  }
}

// Get single listing by ID
export async function getListingById(id: string): Promise<Listing | null> {
  const mockItem = mockListings.find((l) => l.id === id);
  let listing: Listing | null = mockItem ? { ...mockItem } : null;

  if (!listing && db) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        listing = { id: docSnap.id, ...docSnap.data() } as Listing;
      }
    } catch (error) {
      console.error("Error fetching listing from Firestore:", error);
    }
  }

  // If found, append reviews from localStorage if they exist
  if (listing && typeof window !== "undefined") {
    const local = localStorage.getItem(`local_reviews_${listing.id}`);
    if (local) {
      const localReviews = JSON.parse(local);
      listing.reviews = [...(listing.reviews || []), ...localReviews];
    }
  }

  return listing;
}

// Add a review to a listing
export async function addListingReview(
  listingId: string,
  review: Omit<Review, "id" | "date">,
): Promise<Review> {
  const newReview: Review = {
    ...review,
    id: `rev_${Date.now()}`,
    date: new Date().toISOString().split("T")[0],
  };

  if (!db) {
    if (typeof window !== "undefined") {
      const local = localStorage.getItem(`local_reviews_${listingId}`);
      const current = local ? JSON.parse(local) : [];
      localStorage.setItem(`local_reviews_${listingId}`, JSON.stringify([...current, newReview]));
    }
    return newReview;
  }

  try {
    const docRef = doc(db, COLLECTION_NAME, listingId);
    // Check if document exists first, if it's a mock document it might not exist in Firestore
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      await updateDoc(docRef, {
        reviews: arrayUnion(newReview),
      });
    } else {
      // If it's a mock listing ID that is not in Firestore, save it to localStorage
      if (typeof window !== "undefined") {
        const local = localStorage.getItem(`local_reviews_${listingId}`);
        const current = local ? JSON.parse(local) : [];
        localStorage.setItem(`local_reviews_${listingId}`, JSON.stringify([...current, newReview]));
      }
    }
    return newReview;
  } catch (error) {
    console.error("Error adding review to Firestore, falling back to localStorage:", error);
    if (typeof window !== "undefined") {
      const local = localStorage.getItem(`local_reviews_${listingId}`);
      const current = local ? JSON.parse(local) : [];
      localStorage.setItem(`local_reviews_${listingId}`, JSON.stringify([...current, newReview]));
    }
    return newReview;
  }
}

// Get all roommate posts
export async function getRoommatePosts(): Promise<RoommatePost[]> {
  const getMockRoommates = () => mockRoommatePosts;

  if (typeof window !== "undefined") {
    // Check if we have local posts stored
    const local = localStorage.getItem("local_roommates");
    const localPosts = local ? JSON.parse(local) : [];
    
    if (!db) {
      return [...localPosts, ...mockRoommatePosts];
    }

    try {
      const q = query(collection(db, ROOMMATE_COLLECTION_NAME), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const dbPosts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as RoommatePost[];

      // Merge db posts and local posts
      return [...localPosts, ...dbPosts];
    } catch (error) {
      console.error("Error fetching roommate posts from Firestore, using local storage:", error);
      return [...localPosts, ...mockRoommatePosts];
    }
  }

  return getMockRoommates();
}

// Add a roommate post
export async function addRoommatePost(post: Omit<RoommatePost, "id" | "date">): Promise<string> {
  const newPost = {
    ...post,
    date: new Date().toISOString().split("T")[0],
    createdAt: Timestamp.now(),
  };

  // Always save to localStorage so the current user sees their post instantly
  if (typeof window !== "undefined") {
    const local = localStorage.getItem("local_roommates");
    const current = local ? JSON.parse(local) : [];
    const postWithId = { ...newPost, id: `local_${Date.now()}` };
    localStorage.setItem("local_roommates", JSON.stringify([postWithId, ...current]));
  }

  if (!db) {
    return `local_${Date.now()}`;
  }

  try {
    const docRef = await addDoc(collection(db, ROOMMATE_COLLECTION_NAME), newPost);
    return docRef.id;
  } catch (error) {
    console.error("Error adding roommate post to Firestore:", error);
    // Silent return since we already stored it in localStorage for preview
    return `local_${Date.now()}`;
  }
}

// Add a new listing
export async function addListing(
  listing: Omit<Listing, "id" | "image"> & { image: string; images: string[] },
): Promise<string> {
  if (!db) throw new Error("Firebase not initialized");

  try {
    console.log(
      "Adding listing to Firestore:",
      JSON.stringify(listing, null, 2),
    );
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...listing,
      createdAt: Timestamp.now(),
      isPending: true, // Always pending initially
    });
    console.log("Listing added with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding listing:", error);
    throw error;
  }
}

// Approve a listing
export async function approveListing(id: string): Promise<void> {
  if (!db) throw new Error("Firebase not initialized");

  const listingRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(listingRef, {
    isPending: false,
    updatedAt: Timestamp.now(),
  });
}

// Reject/Delete a listing
export async function rejectListing(id: string): Promise<void> {
  if (!db) throw new Error("Firebase not initialized");

  const listingRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(listingRef);
}

// Upload multiple images
export async function uploadImages(files: File[]): Promise<string[]> {
  if (!storage) {
    console.error("Storage not initialized when calling uploadImages");
    throw new Error("Firebase Storage not initialized");
  }
  const validStorage = storage;
  console.log(`Starting upload for ${files.length} files...`);

  try {
    const uploadPromises = files.map(async (file) => {
      console.log(`Uploading file: ${file.name}`);
      const filename = `listings/${Date.now()}_${Math.random().toString(36).substring(7)}_${file.name}`;
      const storageRef = ref(validStorage, filename);
      const snapshot = await uploadBytes(storageRef, file);
      console.log(`File uploaded: ${file.name}, getting URL...`);
      return getDownloadURL(snapshot.ref);
    });

    const urls = await Promise.all(uploadPromises);
    console.log("All files uploaded. URLs:", urls);
    return urls;
  } catch (error) {
    console.error("Error uploading images:", error);
    throw error;
  }
}

// Upload an image file to Firebase Storage
export async function uploadImage(file: File): Promise<string> {
  if (!storage) throw new Error("Firebase Storage not initialized");

  try {
    const filename = `listings/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, filename);

    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}
