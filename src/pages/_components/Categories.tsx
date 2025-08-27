import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";

export default function Categories() {
  const categories = [
    {
      name: "Dresses",
      description: "Elegant dresses for every occasion",
      image: "https://images.unsplash.com/photo-1566479179817-c5c7133dce39?w=400&h=500&fit=crop",
      href: "/products?category=Dresses",
    },
    {
      name: "Tops & Blouses",
      description: "Stylish tops and comfortable blouses",
      image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=500&fit=crop",
      href: "/products?category=Tops",
    },
    {
      name: "Accessories",
      description: "Complete your look with our accessories",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop",
      href: "/products?category=Accessories",
    },
    {
      name: "Activewear",
      description: "Stay active in style and comfort",
      image: "https://images.unsplash.com/photo-1506629905607-bb5bdc3ba86b?w=400&h=500&fit=crop",
      href: "/products?category=Activewear",
    },
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Shop by Category</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our diverse collection organized by category to find exactly what you're looking for
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Card key={category.name} className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-0 bg-white">
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                  <p className="text-sm opacity-90 mb-3">{category.description}</p>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    asChild
                    className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
                  >
                    <Link to={category.href}>
                      Shop Now
                      <ArrowRight className="ml-2 size-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}