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
import { Listing, mockListings, mockRoommatePosts, RoommatePost, Review, Ad, mockAds, NearbyService, mockNearbyServices } from "@/data/mockData";

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

export const ADS_COLLECTION_NAME = "ads";

// Get active ads
export async function getAds(): Promise<Ad[]> {
  const getMock = () => {
    if (typeof window !== "undefined") {
      const local = localStorage.getItem("local_ads");
      if (local) {
        return JSON.parse(local).filter((ad: Ad) => ad.isActive);
      }
    }
    return mockAds.filter((ad) => ad.isActive);
  };

  if (!db) return getMock();

  try {
    const q = query(collection(db, ADS_COLLECTION_NAME), where("isActive", "==", true));
    const querySnapshot = await getDocs(q);
    const dbAds = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Ad[];

    if (dbAds.length > 0) return dbAds;
    return getMock();
  } catch (error) {
    console.error("Error fetching active ads, using fallback:", error);
    return getMock();
  }
}

// Get all ads (for admin panel)
export async function getAllAds(): Promise<Ad[]> {
  const getMock = () => {
    if (typeof window !== "undefined") {
      const local = localStorage.getItem("local_ads");
      if (local) {
        return JSON.parse(local);
      }
      localStorage.setItem("local_ads", JSON.stringify(mockAds));
    }
    return mockAds;
  };

  if (!db) return getMock();

  try {
    const querySnapshot = await getDocs(collection(db, ADS_COLLECTION_NAME));
    const dbAds = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Ad[];

    if (dbAds.length > 0) return dbAds;
    return getMock();
  } catch (error) {
    console.error("Error fetching all ads, using fallback:", error);
    return getMock();
  }
}

// Add a new ad
export async function addAd(ad: Omit<Ad, "id">): Promise<string> {
  const newId = `ad_${Date.now()}`;
  const newAd = { ...ad, id: newId };

  if (typeof window !== "undefined") {
    const local = localStorage.getItem("local_ads");
    const current = local ? JSON.parse(local) : [...mockAds];
    localStorage.setItem("local_ads", JSON.stringify([newAd, ...current]));
  }

  if (!db) return newId;

  try {
    const docRef = await addDoc(collection(db, ADS_COLLECTION_NAME), {
      ...ad,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding ad to Firestore:", error);
    return newId;
  }
}

// Update ad status/details
export async function updateAd(id: string, updates: Partial<Ad>): Promise<void> {
  if (typeof window !== "undefined") {
    const local = localStorage.getItem("local_ads");
    const current = local ? JSON.parse(local) : [...mockAds];
    const updated = current.map((ad: Ad) => (ad.id === id ? { ...ad, ...updates } : ad));
    localStorage.setItem("local_ads", JSON.stringify(updated));
  }

  if (!db) return;

  try {
    const adRef = doc(db, ADS_COLLECTION_NAME, id);
    const snap = await getDoc(adRef);
    if (snap.exists()) {
      await updateDoc(adRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    }
  } catch (error) {
    console.error("Error updating ad in Firestore:", error);
  }
}

// Delete an ad
export async function deleteAd(id: string): Promise<void> {
  if (typeof window !== "undefined") {
    const local = localStorage.getItem("local_ads");
    const current = local ? JSON.parse(local) : [...mockAds];
    const updated = current.filter((ad: Ad) => ad.id !== id);
    localStorage.setItem("local_ads", JSON.stringify(updated));
  }

  if (!db) return;

  try {
    const adRef = doc(db, ADS_COLLECTION_NAME, id);
    const snap = await getDoc(adRef);
    if (snap.exists()) {
      await deleteDoc(adRef);
    }
  } catch (error) {
    console.error("Error deleting ad from Firestore:", error);
  }
}

export const NEARBY_SERVICES_COLLECTION_NAME = "nearby_services";

// Get active nearby services
export async function getNearbyServices(): Promise<NearbyService[]> {
  const getMock = () => {
    if (typeof window !== "undefined") {
      const local = localStorage.getItem("local_nearby_services");
      if (local) {
        return JSON.parse(local).filter((ns: NearbyService) => ns.isActive);
      }
    }
    return mockNearbyServices.filter((ns) => ns.isActive);
  };

  if (!db) return getMock();

  try {
    const q = query(collection(db, NEARBY_SERVICES_COLLECTION_NAME), where("isActive", "==", true));
    const querySnapshot = await getDocs(q);
    const dbNs = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as NearbyService[];

    if (dbNs.length > 0) return dbNs;
    return getMock();
  } catch (error) {
    console.error("Error fetching active nearby services, using fallback:", error);
    return getMock();
  }
}

// Get all nearby services (for admin panel)
export async function getAllNearbyServices(): Promise<NearbyService[]> {
  const getMock = () => {
    if (typeof window !== "undefined") {
      const local = localStorage.getItem("local_nearby_services");
      if (local) {
        return JSON.parse(local);
      }
      localStorage.setItem("local_nearby_services", JSON.stringify(mockNearbyServices));
    }
    return mockNearbyServices;
  };

  if (!db) return getMock();

  try {
    const querySnapshot = await getDocs(collection(db, NEARBY_SERVICES_COLLECTION_NAME));
    const dbNs = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as NearbyService[];

    if (dbNs.length > 0) return dbNs;
    return getMock();
  } catch (error) {
    console.error("Error fetching all nearby services, using fallback:", error);
    return getMock();
  }
}

// Add a new nearby service
export async function addNearbyService(service: Omit<NearbyService, "id">): Promise<string> {
  const newId = `ns_${Date.now()}`;
  const newNs = { ...service, id: newId };

  if (typeof window !== "undefined") {
    const local = localStorage.getItem("local_nearby_services");
    const current = local ? JSON.parse(local) : [...mockNearbyServices];
    localStorage.setItem("local_nearby_services", JSON.stringify([newNs, ...current]));
  }

  if (!db) return newId;

  try {
    const docRef = await addDoc(collection(db, NEARBY_SERVICES_COLLECTION_NAME), {
      ...service,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding nearby service to Firestore:", error);
    return newId;
  }
}

// Update nearby service details/status
export async function updateNearbyService(id: string, updates: Partial<NearbyService>): Promise<void> {
  if (typeof window !== "undefined") {
    const local = localStorage.getItem("local_nearby_services");
    const current = local ? JSON.parse(local) : [...mockNearbyServices];
    const updated = current.map((ns: NearbyService) => (ns.id === id ? { ...ns, ...updates } : ns));
    localStorage.setItem("local_nearby_services", JSON.stringify(updated));
  }

  if (!db) return;

  try {
    const nsRef = doc(db, NEARBY_SERVICES_COLLECTION_NAME, id);
    const snap = await getDoc(nsRef);
    if (snap.exists()) {
      await updateDoc(nsRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    }
  } catch (error) {
    console.error("Error updating nearby service in Firestore:", error);
  }
}

// Delete a nearby service
export async function deleteNearbyService(id: string): Promise<void> {
  if (typeof window !== "undefined") {
    const local = localStorage.getItem("local_nearby_services");
    const current = local ? JSON.parse(local) : [...mockNearbyServices];
    const updated = current.filter((ns: NearbyService) => ns.id !== id);
    localStorage.setItem("local_nearby_services", JSON.stringify(updated));
  }

  if (!db) return;

  try {
    const nsRef = doc(db, NEARBY_SERVICES_COLLECTION_NAME, id);
    const snap = await getDoc(nsRef);
    if (snap.exists()) {
      await deleteDoc(nsRef);
    }
  } catch (error) {
    console.error("Error deleting nearby service from Firestore:", error);
  }
}
