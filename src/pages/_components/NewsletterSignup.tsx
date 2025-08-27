import { useState } from "react";
import { useMutation } from "convex/react";
import { Mail, Gift, Bell, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { api } from "@/convex/_generated/api";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const subscribeNewsletter = useMutation(api.contact.subscribeNewsletter);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isLoading) return;

    setIsLoading(true);
    try {
      await subscribeNewsletter({ email });
      toast.success("Welcome to our community! Check your email for exclusive offers.");
      setEmail("");
    } catch (error) {
      toast.error("Oops! Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    {
      icon: Gift,
      title: "Exclusive Offers",
      description: "Get 15% off your first order"
    },
    {
      icon: Bell,
      title: "New Arrivals",
      description: "Be first to know about latest trends"
    },
    {
      icon: Sparkles,
      title: "Style Tips",
      description: "Weekly fashion tips and inspiration"
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-pink-100 via-purple-50 to-indigo-100 dark:from-gray-800 dark:via-purple-900/20 dark:to-indigo-900/20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden border-0 shadow-xl">
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-2">
                {/* Left Side - Content */}
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="mb-8">
                    <div className="inline-flex items-center space-x-2 bg-primary/10 px-3 py-1 rounded-full text-primary text-sm font-medium mb-4">
                      <Mail className="size-4" />
                      <span>Join Our Community</span>
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-balance">
                      Stay Updated with Exclusive Offers
                    </h2>
                    <p className="text-muted-foreground text-lg">
                      Join thousands of fashion-forward women and get insider access to new collections, exclusive discounts, and style inspiration.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4 mb-8">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1 h-12 text-base"
                        required
                      />
                      <Button 
                        type="submit" 
                        size="lg"
                        disabled={isLoading}
                        className="h-12 px-8"
                      >
                        {isLoading ? "Subscribing..." : "Subscribe Now"}
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      By subscribing, you agree to our privacy policy and terms of service. Unsubscribe at any time.
                    </p>
                  </form>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <benefit.icon className="size-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm">{benefit.title}</h4>
                          <p className="text-xs text-muted-foreground">{benefit.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Side - Visual */}
                <div className="relative overflow-hidden bg-gradient-to-br from-pink-200 to-purple-300 lg:aspect-auto aspect-[2/1]">
                  <img
                    src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=800&fit=crop"
                    alt="Fashion newsletter signup"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent" />
                  
                  {/* Floating elements */}
                  <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg">
                    <div className="flex items-center space-x-2">
                      <div className="size-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">5,000+ Subscribers</span>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg">
                    <div className="text-center">
                      <div className="text-lg font-bold text-primary">15% OFF</div>
                      <div className="text-xs text-muted-foreground">First Order</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}