import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, ShieldCheck, Truck } from "lucide-react";

import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/badge.tsx";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20">
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="w-fit">
                <Sparkles className="size-4 mr-1" />
                New Collection Available
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-balance leading-tight">
                Discover Your Perfect
                <span className="text-primary block">Ladies' Style</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-md">
                Join our community of empowered women! Explore a curated selection of ladies' products tailored just for you.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="text-lg px-8">
                <Link to="/products">
                  Start Shopping
                  <ArrowRight className="ml-2 size-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8" asChild>
                <Link to="/about">
                  Learn More
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t">
              <div className="text-center">
                <ShieldCheck className="size-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">Secure Shopping</p>
              </div>
              <div className="text-center">
                <Truck className="size-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">Free Shipping $50+</p>
              </div>
              <div className="text-center">
                <Sparkles className="size-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">Premium Quality</p>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-pink-200 to-purple-300">
              <img
                src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=800&fit=crop"
                alt="Fashion model showcasing elegant ladies' wear"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Floating Cards */}
            <div className="absolute -top-4 -left-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
              <div className="flex items-center space-x-2">
                <div className="size-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">1,000+ Happy Customers</span>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -right-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">4.9★</div>
                <div className="text-sm text-muted-foreground">Customer Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}