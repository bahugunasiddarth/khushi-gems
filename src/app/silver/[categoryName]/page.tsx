"use client";

import { useMemo, useState, useEffect } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { useProducts } from "@/components/product-provider";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Filter, X, ChevronLeft, ChevronRight } from "lucide-react";
import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader } from "@/components/ui/sidebar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PriceRangeSlider } from "@/components/price-range-slider";
import { motion } from "framer-motion";
import { LoadingLogo } from "@/components/loading-logo";

const MIN_PRICE = 500;
const MAX_PRICE = 2575000;
const PRODUCTS_PER_PAGE = 32;

const sectionAnimation = {
  initial: { opacity: 0, y: 50 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: "easeOut", staggerChildren: 0.1 }
};

const itemAnimation = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: "easeOut" }
};

export default function SilverCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const { products: allProducts, isLoading } = useProducts();

  const categoryName = useMemo(() => {
    const name = params.categoryName;
    return typeof name === 'string' ? decodeURIComponent(name) : '';
  }, [params.categoryName]);

  const silverCategories = useMemo(() => 
    [...new Set(allProducts.filter(p => p.material === 'Silver').map(p => p.category))]
  , [allProducts]);
  
  const [selectedCategory, setSelectedCategory] = useState(categoryName);

  const categoryProducts = useMemo(() => {
    return allProducts.filter(
      (p) => p.material === 'Silver' && p.category?.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [allProducts, selectedCategory]);

  const [availability, setAvailability] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([MIN_PRICE, MAX_PRICE]);
  const [sortOption, setSortOption] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  
  useEffect(() => {
    setSelectedCategory(categoryName);
    setPriceRange([MIN_PRICE, MAX_PRICE]);
    setCurrentPage(1);
  }, [categoryName]);

  const filteredProducts = useMemo(() => {
    let filtered = categoryProducts;

    if (availability.length > 0) {
      filtered = filtered.filter(p => p.tag && availability.includes(p.tag));
    }

    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    if (sortOption === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'name-asc') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [categoryProducts, availability, priceRange, sortOption]);
  
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  const products = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handleAvailabilityChange = (tag: string) => {
    setAvailability(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
    setCurrentPage(1);
  }

  const handleCategoryChange = (newCategory: string) => {
    setSelectedCategory(newCategory);
    router.push(`/silver/${encodeURIComponent(newCategory)}`);
  }

  if (!categoryName) {
    return notFound();
  }

  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-screen">
            <LoadingLogo />
        </div>
    );
  }

  const availabilityOptions = ["READY TO SHIP", "MADE TO ORDER"];

  const FilterContent = () => (
    <>
      <SidebarGroup>
          <SidebarGroupLabel>Availability</SidebarGroupLabel>
          <SidebarGroupContent className="grid gap-2">
              {availabilityOptions.map(tag => (
                  <div key={tag} className="flex items-center gap-2">
                      <Checkbox 
                          id={`silver-${tag}`}
                          checked={availability.includes(tag)} 
                          onCheckedChange={() => handleAvailabilityChange(tag)} 
                      />
                      <Label htmlFor={`silver-${tag}`} className="font-normal">{tag}</Label>
                  </div>
              ))}
          </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
          <SidebarGroupLabel>Price</SidebarGroupLabel>
          <SidebarGroupContent>
              <PriceRangeSlider
                  products={categoryProducts}
                  minPrice={MIN_PRICE}
                  maxPrice={MAX_PRICE}
                  priceRange={priceRange}
                  onPriceChange={(newRange) => {
                    setPriceRange(newRange);
                    setCurrentPage(1);
                  }}
              />
          </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
          <SidebarGroupLabel>Category</SidebarGroupLabel>
          <SidebarGroupContent>
              <RadioGroup value={selectedCategory} onValueChange={handleCategoryChange}>
                  {silverCategories.map(cat => (
                      <div key={cat} className="flex items-center space-x-2">
                          <RadioGroupItem value={cat} id={`silver-${cat}`} />
                          <Label htmlFor={`silver-${cat}`} className="font-normal">{cat}</Label>
                      </div>
                  ))}
              </RadioGroup>
          </SidebarGroupContent>
      </SidebarGroup>
    </>
  );

  return (
    <SidebarProvider>
      <motion.div 
        className="container mx-auto px-4 py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-row items-start gap-8">
            <motion.div {...itemAnimation} className="hidden md:block">
              <Sidebar className="sticky top-24 w-72">
                <SidebarHeader className="px-4 pb-4 border-b border-black/10">
                    <h2 className="font-headline text-2xl">Filters</h2>
                </SidebarHeader>
                <SidebarContent className="p-4">
                    <FilterContent />
                </SidebarContent>
              </Sidebar>
            </motion.div>
          
            <main className="flex-1 min-w-0">
                <motion.div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4" {...itemAnimation}>
                    <div>
                      <h1 className="font-headline text-4xl md:text-5xl font-bold">Silver {categoryName}</h1>
                      <p className="text-muted-foreground mt-2 text-lg">
                        Browse our beautiful collection of silver {categoryName.toLowerCase()}.
                      </p>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <Select value={sortOption} onValueChange={setSortOption}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">Default</SelectItem>
                          <SelectItem value="price-asc">Price: Low to High</SelectItem>
                          <SelectItem value="price-desc">Price: High to Low</SelectItem>
                          <SelectItem value="name-asc">Alphabetically, A-Z</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="md:hidden">
                        <Sheet>
                          <SheetTrigger asChild>
                             <Button variant="outline" className="flex items-center gap-2">
                              <Filter className="h-4 w-4" />
                              <span>Filters</span>
                            </Button>
                          </SheetTrigger>
                          <SheetContent side="left" className="w-[80vw] max-w-sm">
                            <SheetHeader className="p-4 border-b border-black/10 flex-row justify-between items-center">
                              <SheetTitle className="font-headline text-2xl">Filters</SheetTitle>
                            </SheetHeader>
                            <div className="p-4">
                              <FilterContent />
                            </div>
                          </SheetContent>
                        </Sheet>
                      </div>
                    </div>
                </motion.div>

                <motion.div className="pb-12" {...sectionAnimation}>
                    {products.length > 0 ? (
                      <>
                        {/* UPDATED: grid-cols-2 on mobile */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                        {products.map((product, index) => (
                            <motion.div
                              key={product.id}
                              {...itemAnimation}
                              transition={{ ...itemAnimation.transition, delay: index * 0.1 }}
                            >
                              <ProductCard product={product} />
                            </motion.div>
                        ))}
                        </div>
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4 mt-12">
                                <Button 
                                    variant="outline"
                                    onClick={() => setCurrentPage(p => p - 1)}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft className="h-4 w-4 mr-2" />
                                    Previous
                                </Button>
                                <span className="text-sm font-medium">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentPage(p => p + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                    <ChevronRight className="h-4 w-4 ml-2" />
                                </Button>
                            </div>
                          )}
                        </>
                    ) : (
                        <p className="text-center">
                        No silver products found matching your criteria in the {categoryName} category.
                        </p>
                    )}
                </motion.div>
            </main>
        </div>
      </motion.div>
    </SidebarProvider>
  );
}