import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
  orderBy,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";
import { Listing } from "@/data/mockData";

export const COLLECTION_NAME = "listings";

// Get all approved listings (optionally filtered by category)
export async function getListings(
  category?: "students" | "studentesses",
): Promise<Listing[]> {
  if (!db) return [];

  try {
    let q = query(
      collection(db, COLLECTION_NAME),
      where("isPending", "==", false),
    );

    if (category) {
      q = query(q, where("category", "==", category));
    }

    // Note: You might need a composite index for isPending + category
    // If so, check console for the index creation link

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Listing[];
  } catch (error) {
    console.error("Error fetching listings:", error);
    return [];
  }
}

// Get all pending listings (for admin)
export async function getPendingListings(): Promise<Listing[]> {
  if (!db) return [];

  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("isPending", "==", true),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Listing[];
  } catch (error) {
    console.error("Error fetching pending listings:", error);
    return [];
  }
}

// Add a new listing
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
    // Return empty array instead of throwing to prevent blocking submission?
    // No, better to throw so user knows upload failed.
    throw error;
  }
}

// Upload an image file to Firebase Storage
export async function uploadImage(file: File): Promise<string> {
  if (!storage) throw new Error("Firebase Storage not initialized");

  try {
    // Create a unique filename: listings/timestamp_filename
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
