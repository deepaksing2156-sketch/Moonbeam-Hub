import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { usePaginatedQuery, useMutation } from "convex/react";
import { Filter, Grid, List, SlidersHorizontal } from "lucide-react";

import Layout from "@/components/Layout.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import ProductGrid from "./_components/ProductGrid.tsx";
import ProductFilters from "./_components/ProductFilters.tsx";
import { api } from "@/convex/_generated/api";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const category = searchParams.get("category") || "";

  const seedProducts = useMutation(api.products.seedProducts);

  // Initialize with sample data
  useEffect(() => {
    const initializeData = async () => {
      try {
        await seedProducts();
      } catch (error) {
        // Products might already exist
        console.log("Products may already be seeded");
      }
    };
    initializeData();
  }, [seedProducts]);

  const {
    results: products,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.products.getProducts,
    { 
      category: category || undefined,
    },
    { initialNumItems: 12 }
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchQuery) {
      newParams.set("search", searchQuery);
    } else {
      newParams.delete("search");
    }
    setSearchParams(newParams);
  };

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "popular", label: "Most Popular" },
    { value: "rating", label: "Highest Rated" },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">
            {category ? `${category} Collection` : "All Products"}
          </h1>
          <p className="text-muted-foreground">
            Discover our carefully curated selection of premium ladies' fashion
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <form onSubmit={handleSearchSubmit} className="flex-1">
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </form>

          <div className="flex items-center gap-4">
            <Select defaultValue="newest">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center border rounded-lg">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid className="size-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="size-4" />
              </Button>
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <Filter className="size-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <ProductFilters />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <SlidersHorizontal className="size-5" />
                <h3 className="font-semibold">Filters</h3>
              </div>
              <ProductFilters />
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground">
                {products ? `${products.length} products found` : "Loading..."}
              </p>
            </div>

            <ProductGrid products={products} viewMode={viewMode} />

            {status === "CanLoadMore" && (
              <div className="text-center mt-12">
                <Button 
                  onClick={() => loadMore(12)} 
                  variant="outline" 
                  size="lg"
                >
                  Load More Products
                </Button>
              </div>
            )}

            {status === "LoadingMore" && (
              <div className="text-center mt-12">
                <p className="text-muted-foreground">Loading more products...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}