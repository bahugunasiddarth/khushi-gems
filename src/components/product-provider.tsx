'use client';

import { createContext, useContext, useMemo, ReactNode, FC } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, Query } from 'firebase/firestore';
import type { Product as ProductType } from '@/lib/types';

interface ProductFromDB {
  name: string;
  price: number | string;
  imageUrl?: string;
  iageUrl?: string; 
  imageUrls?: string[]; 
  category?: string;
  description: string;
  type?: string; 
  material?: 'Gold' | 'Silver';
  availability?: string;
  sizes?: any;
  stockQuantity?: number; // Added to DB interface
  [key: string]: any; 
}

interface ProductsContextType {
  products: ProductType[];
  bestsellers: ProductType[]; // Separate bestsellers array
  isLoading: boolean;
  error: Error | null;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

// Helper to determine category from any text string
function detectCategory(input: string | undefined): string | null {
    if (!input || typeof input !== 'string') return null;
    const lower = input.toLowerCase();
    
    if (lower.includes('earring') || lower.includes('jhumka') || lower.includes('stud') || lower.includes('bali')) return 'Earrings';
    if (lower.includes('necklace') || lower.includes('chain') || lower.includes('mangalsutra')) return 'Necklaces';
    if (lower.includes('pendant') || lower.includes('locket')) return 'Pendants';
    if (lower.includes('ring') && !lower.includes('nose') && !lower.includes('toe')) return 'Rings';
    if (lower.includes('bangle') || lower.includes('bracelet') || lower.includes('kada') || lower.includes('cuff')) return 'Bangles/bracelets';
    if (lower.includes('nose') || lower.includes('nath')) return 'Nosepin';
    if (lower.includes('choker')) return 'Chokers';
    if (lower.includes('maang') || lower.includes('tikka')) return 'Maang Tikka';
    if (lower.includes('diamond')) return 'Diamond Jewellery';
    
    return null;
}

function transformProduct(product: ProductFromDB & { id: string }, source: 'products' | 'bestsellers' = 'products'): ProductType | null {
    try {
        // 1. Validate Name
        if (typeof product.name !== 'string' || !product.name) return null;
        
        // 2. Validate and Sanitize Price (Default to 0 if missing)
        let price: number = 0;
        if (typeof product.price === 'string') {
            const cleanPrice = product.price.replace(/[^0-9.]/g, '');
            price = parseFloat(cleanPrice) || 0;
        } else if (typeof product.price === 'number') {
            price = product.price;
        }

        // 3. Determine Material ('Gold' or 'Silver')
        let material: 'Gold' | 'Silver' | undefined;
        const typeStr = typeof product.type === 'string' ? product.type : '';
        const materialStr = typeof product.material === 'string' ? product.material : '';
        const sizesTypeStr = (typeof product.sizes === 'object' && product.sizes?.type) ? product.sizes.type : '';

        const allInfoForMaterial = (typeStr + ' ' + materialStr + ' ' + sizesTypeStr).toLowerCase();
        
        if (allInfoForMaterial.includes('gold')) material = 'Gold';
        else if (allInfoForMaterial.includes('silver')) material = 'Silver';

        // For bestsellers, try to determine material from 'type' field
        if (!material && source === 'bestsellers') {
            if (typeof product.type === 'string' && product.type.toLowerCase() === 'gold') material = 'Gold';
            else if (typeof product.type === 'string' && product.type.toLowerCase() === 'silver') material = 'Silver';
        }

        if (!material) {
            return null; 
        }

        // 4. Determine Category 
        let finalCategory = 'Uncategorized';
        const detectedFromType = detectCategory(typeStr);
        const detectedFromName = detectCategory(product.name);
        const detectedFromCat = detectCategory(product.category);

        if (detectedFromType) finalCategory = detectedFromType;
        else if (detectedFromCat) finalCategory = detectedFromCat;
        else if (detectedFromName) finalCategory = detectedFromName;
        else if (product.category) finalCategory = product.category;

        // 5. Find the primary image URL (Use placeholder if missing)
        let mainImageUrl = "https://placehold.co/600x400?text=No+Image";
        let images: { url: string; hint: string }[] = [];

        // Handle different image field names
        if (Array.isArray(product.imageUrls) && product.imageUrls.length > 0) {
            const validImageUrls = product.imageUrls.filter(url => typeof url === 'string' && url);
            if (validImageUrls.length > 0) {
                mainImageUrl = validImageUrls[0];
                images = validImageUrls.map(url => ({ url, hint: product.name }));
            }
        } else if (typeof product.imageUrl === 'string' && product.imageUrl) {
            mainImageUrl = product.imageUrl;
            images = [{ url: mainImageUrl, hint: product.name }];
        } else if (typeof (product as any).iageUrl === 'string' && (product as any).iageUrl) {
            mainImageUrl = (product as any).iageUrl;
            images = [{ url: mainImageUrl, hint: product.name }];
        } else if (source === 'bestsellers' && product.images && Array.isArray(product.images)) {
            // Handle bestsellers with images array
            const firstImage = product.images[0];
            if (firstImage && firstImage.url) {
                mainImageUrl = firstImage.url;
                images = product.images.map((img: any) => ({
                    url: img.url || img,
                    hint: product.name
                }));
            }
        }
        
        if (images.length === 0) {
            images.push({ url: mainImageUrl, hint: product.name });
        }

        // 6. Generate slug
        const slug = product.slug || product.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

        // 7. Validate Availability
        let availability: 'READY TO SHIP' | 'MADE TO ORDER' = 'READY TO SHIP';
        if (product.availability === 'MADE TO ORDER') {
            availability = 'MADE TO ORDER';
        } else if (product.availability === 'READY TO SHIP') {
            availability = 'READY TO SHIP';
        }

        // 8. Capture Stock Quantity (CRITICAL for your logic)
        const stockQuantity = typeof product.stockQuantity === 'number' ? product.stockQuantity : 0;
        
        return {
            id: product.id,
            name: product.name.trim(),
            price: price,
            slug: slug,
            material: material,
            tag: availability, 
            imageUrl: mainImageUrl,
            images: images,
            imageHint: product.name,
            category: finalCategory,
            description: product.description || '',
            isBestseller: source === 'bestsellers',
            imageUrls: product.imageUrls || images.map(img => img.url),
            availability: availability,
            stockQuantity: stockQuantity // Passing stock to frontend
        };
    } catch (e: any) {
        console.error(`Error transforming product ${product.id}:`, e);
        return null;
    }
}

export const ProductProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const firestore = useFirestore();
    
    // Fetch regular products
    const productsCollection = useMemoFirebase(() => {
        if (!firestore) return null;
        return collection(firestore, 'products');
    }, [firestore]);

    const { data: rawProducts, isLoading: productsLoading, error: productsError } = useCollection<ProductFromDB>(productsCollection as Query | null);

    // Fetch bestsellers
    const bestsellersCollection = useMemoFirebase(() => {
        if (!firestore) return null;
        return collection(firestore, 'bestsellers');
    }, [firestore]);

    const { data: rawBestsellers, isLoading: bestsellersLoading, error: bestsellersError } = useCollection<ProductFromDB>(bestsellersCollection as Query | null);

    // Transform products
    const products = useMemo(() => {
        if (!rawProducts) return [];
        return rawProducts
            .map(p => transformProduct(p as ProductFromDB & { id: string }, 'products'))
            .filter((p): p is ProductType => p !== null);
    }, [rawProducts]);

    // Transform bestsellers
    const bestsellers = useMemo(() => {
        if (!rawBestsellers) return [];
        return rawBestsellers
            .map(p => transformProduct(p as ProductFromDB & { id: string }, 'bestsellers'))
            .filter((p): p is ProductType => p !== null);
    }, [rawBestsellers]);

    // Combine products + bestsellers
    const allProducts = useMemo(() => {
        const productMap = new Map<string, ProductType>();
        
        // 1. Add regular products first (This has the latest STOCK info)
        products.forEach(p => productMap.set(p.id, p));
        
        // 2. Add bestsellers
        bestsellers.forEach(p => {
            const existing = productMap.get(p.id);
            if (existing) {
                // IMPORTANT: We use 'existing' (from products collection) as the base
                // This ensures we keep the updated stock from the products collection
                // We only append the isBestseller flag.
                productMap.set(p.id, { ...existing, isBestseller: true });
            } else {
                productMap.set(p.id, p);
            }
        });
        
        return Array.from(productMap.values());
    }, [products, bestsellers]);

    const isLoading = productsLoading || bestsellersLoading;
    const error = productsError || bestsellersError;

    const value = {
        products: allProducts,
        bestsellers, 
        isLoading,
        error: error as Error | null,
    };

    return (
        <ProductsContext.Provider value={value}>
            {children}
        </ProductsContext.Provider>
    );
};

export const useProducts = () => {
    const context = useContext(ProductsContext);
    if (context === undefined) {
        throw new Error('useProducts must be used within a ProductProvider');
    }
    return context;
};