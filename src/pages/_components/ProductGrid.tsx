import { Link } from "react-router-dom";
import { useMutation } from "convex/react";
import { ShoppingCart, Heart, Star } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { useAuth } from "@/hooks/use-auth.ts";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";

interface ProductGridProps {
  products: Doc<"products">[] | undefined;
  viewMode: "grid" | "list";
}

export default function ProductGrid({ products, viewMode }: ProductGridProps) {
  const { isAuthenticated } = useAuth();
  const addToCart = useMutation(api.cart.addToCart);

  const handleAddToCart = async (productId: Id<"products">, productName: string) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to add items to cart");
      return;
    }

    try {
      await addToCart({ productId, quantity: 1 });
      toast.success(`${productName} added to cart!`);
    } catch (error) {
      toast.error("Failed to add item to cart");
    }
  };

  if (!products) {
    const skeletonCount = viewMode === "grid" ? 12 : 6;
    return (
      <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-6"}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            {viewMode === "grid" ? (
              <>
                <Skeleton className="aspect-[3/4] w-full" />
                <CardContent className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-8 w-full" />
                </CardContent>
              </>
            ) : (
              <div className="flex">
                <Skeleton className="w-48 aspect-[3/4]" />
                <CardContent className="flex-1 p-4 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-10 w-32" />
                </CardContent>
              </div>
            )}
          </Card>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold mb-2">No products found</h3>
        <p className="text-muted-foreground mb-6">
          Try adjusting your search or filter criteria
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Clear Filters
        </Button>
      </div>
    );
  }

  if (viewMode === "list") {
    return (
      <div className="space-y-6">
        {products.map((product) => (
          <Card key={product._id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="flex flex-col md:flex-row">
              <div className="relative md:w-48 aspect-[3/4] md:aspect-[3/4] overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.originalPrice && (
                  <Badge className="absolute top-2 left-2 bg-red-500">
                    Sale
                  </Badge>
                )}
              </div>
              <CardContent className="flex-1 p-6">
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <Link 
                      to={`/products/${product._id}`}
                      className="text-xl font-semibold hover:text-primary transition-colors mb-2 block"
                    >
                      {product.name}
                    </Link>
                    
                    <div className="flex items-center space-x-1 mb-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`size-4 ${
                            i < Math.floor(product.rating || 0)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                      <span className="text-sm text-muted-foreground ml-2">
                        ({product.reviewCount || 0} reviews)
                      </span>
                    </div>

                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-primary">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-lg text-muted-foreground line-through">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="size-10"
                      >
                        <Heart className="size-4" />
                      </Button>
                      <Button
                        onClick={() => handleAddToCart(product._id, product.name)}
                        className="px-6"
                      >
                        <ShoppingCart className="size-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product._id} className="group overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative aspect-[3/4] overflow-hidden">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {product.originalPrice && (
              <Badge className="absolute top-2 left-2 bg-red-500">
                Sale
              </Badge>
            )}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="secondary" size="icon" className="size-8">
                <Heart className="size-4" />
              </Button>
            </div>
          </div>
          
          <CardContent className="p-4">
            <div className="space-y-3">
              <Link 
                to={`/products/${product._id}`}
                className="font-semibold hover:text-primary transition-colors line-clamp-2 block"
              >
                {product.name}
              </Link>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`size-4 ${
                      i < Math.floor(product.rating || 0)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
                <span className="text-sm text-muted-foreground">
                  ({product.reviewCount || 0})
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-primary">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              
              <Button 
                className="w-full" 
                size="sm"
                onClick={() => handleAddToCart(product._id, product.name)}
              >
                <ShoppingCart className="size-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}