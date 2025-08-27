import { useSearchParams } from "react-router-dom";
import { useQuery } from "convex/react";

import { Checkbox } from "@/components/ui/checkbox.tsx";
import { Slider } from "@/components/ui/slider.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { api } from "@/convex/_generated/api";
import { useState } from "react";

export default function ProductFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [priceRange, setPriceRange] = useState([0, 200]);
  const categories = useQuery(api.products.getCategories);
  
  const selectedCategory = searchParams.get("category");
  const selectedFilters = {
    category: selectedCategory,
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newParams = new URLSearchParams(searchParams);
    if (checked) {
      newParams.set("category", category);
    } else {
      newParams.delete("category");
    }
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams({});
    setPriceRange([0, 200]);
  };

  const filterCategories = [
    "Dresses",
    "Tops", 
    "Bottoms",
    "Accessories",
    "Activewear",
    "Outerwear",
  ];

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const colors = [
    { name: "Black", value: "#000000" },
    { name: "White", value: "#FFFFFF" },
    { name: "Red", value: "#EF4444" },
    { name: "Blue", value: "#3B82F6" },
    { name: "Pink", value: "#EC4899" },
    { name: "Purple", value: "#8B5CF6" },
    { name: "Green", value: "#10B981" },
    { name: "Brown", value: "#A3581D" },
  ];

  const activeFiltersCount = Object.values(selectedFilters).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium">Active Filters ({activeFiltersCount})</h4>
            <Button variant="ghost" size="sm" onClick={clearAllFilters}>
              Clear All
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedCategory && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {selectedCategory}
                <button 
                  onClick={() => handleCategoryChange(selectedCategory, false)}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Categories */}
      <div>
        <h4 className="font-medium mb-3">Categories</h4>
        <div className="space-y-2">
          {filterCategories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox 
                id={category}
                checked={selectedCategory === category}
                onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
              />
              <label 
                htmlFor={category} 
                className="text-sm cursor-pointer hover:text-primary"
              >
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <h4 className="font-medium mb-3">Price Range</h4>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={500}
            step={10}
            className="mb-4"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Sizes */}
      <div>
        <h4 className="font-medium mb-3">Sizes</h4>
        <div className="grid grid-cols-3 gap-2">
          {sizes.map((size) => (
            <Button key={size} variant="outline" size="sm" className="h-8 text-xs">
              {size}
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Colors */}
      <div>
        <h4 className="font-medium mb-3">Colors</h4>
        <div className="grid grid-cols-4 gap-2">
          {colors.map((color) => (
            <button
              key={color.name}
              className="size-8 rounded-full border-2 border-muted hover:border-primary transition-colors"
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
        </div>
      </div>

      <Separator />

      {/* Rating */}
      <div>
        <h4 className="font-medium mb-3">Customer Rating</h4>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox id={`rating-${rating}`} />
              <label htmlFor={`rating-${rating}`} className="text-sm cursor-pointer flex items-center">
                <span className="mr-1">{rating}+ stars</span>
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span 
                      key={i} 
                      className={i < rating ? "text-yellow-400" : "text-muted-foreground"}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}