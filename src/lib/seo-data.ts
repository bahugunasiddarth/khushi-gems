import { getFirebaseServer } from "@/firebase/server";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { Product } from "./types";

// Helper to format DB data (Keep this same as before)
function normalizeProduct(doc: any): Product {
  const data = doc.data();
  
  let images: { url: string; hint?: string }[] = [];
  if (Array.isArray(data.images) && data.images.length > 0) {
     images = data.images;
  } else if (Array.isArray(data.imageUrls) && data.imageUrls.length > 0) {
     images = data.imageUrls.map((url: string) => ({ url, hint: data.name }));
  } else if (data.imageUrl) {
     images = [{ url: data.imageUrl, hint: data.name }];
  } else {
     images = [{ url: "https://placehold.co/600x400?text=No+Image", hint: "No Image" }];
  }

  // Derive material if missing
  const material = data.material || (data.type?.toLowerCase().includes('gold') ? 'Gold' : 'Silver');

  return {
    id: doc.id,
    name: data.name || "Untitled Product",
    price: Number(data.price) || 0,
    slug: data.slug || null,
    description: data.description || "",
    category: data.category || "Uncategorized",
    material: material,
    availability: data.availability || "READY TO SHIP",
    stockQuantity: Number(data.stockQuantity) || 0,
    tag: data.tag || data.availability || "READY TO SHIP",
    priceOnRequest: !!data.priceOnRequest,
    images: images,
    imageUrl: images[0]?.url || "",
  } as Product;
}

// --- NEW FUNCTION: Fetch Similar Products ---
export async function getSimilarProducts(category: string, material: string, currentId: string): Promise<Product[]> {
  try {
    const { firestore } = getFirebaseServer();
    const productsRef = collection(firestore, 'products');

    // 1. Fetch by Category (Fetch slightly more to allow filtering)
    const q = query(productsRef, where("category", "==", category), limit(20));
    const snapshot = await getDocs(q);
    
    // 2. Filter by Material & Remove Current Product
    const products = snapshot.docs
        .map(doc => normalizeProduct(doc))
        .filter(p => p.id !== currentId && p.material === material)
        .slice(0, 8); // Return top 8

    return products;
  } catch (error) {
    console.error("Error fetching similar products:", error);
    return [];
  }
}

export async function getAllProductsForSEO(): Promise<Product[]> {
  try {
    const { firestore } = getFirebaseServer(); 
    const productsRef = collection(firestore, 'products');
    const snapshot = await getDocs(productsRef);
    return snapshot.docs.map(doc => normalizeProduct(doc));
  } catch (error) {
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { firestore } = getFirebaseServer();
    const productsRef = collection(firestore, 'products');
    
    // Try finding by direct slug
    const q = query(productsRef, where("slug", "==", slug));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      return normalizeProduct(snapshot.docs[0]);
    }

    // Fallback: Check derived name
    const allSnap = await getDocs(productsRef);
    const found = allSnap.docs.find(doc => {
        const data = doc.data();
        if (!data.name) return false;
        const generated = data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        return generated === slug;
    });

    if (found) return normalizeProduct(found);

    return null;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}