import { Star, Quote } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b830?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      text: "Amazing quality and beautiful designs! I've ordered multiple times and I'm always impressed with the fast shipping and excellent customer service.",
      product: "Elegant Evening Dress",
    },
    {
      name: "Emma Wilson",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      text: "The fit is perfect and the fabric quality exceeded my expectations. Moonbeam has become my go-to place for all my fashion needs!",
      product: "Designer Handbag",
    },
    {
      name: "Rachel Davis",
      avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      text: "Love the personalized recommendations! The website made it so easy to find exactly what I was looking for. Will definitely shop here again.",
      product: "Casual Summer Top",
    },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied customers who have found their perfect style with us
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="relative overflow-hidden bg-gradient-to-br from-pink-50/50 to-purple-50/50 dark:from-gray-800 dark:to-gray-900 border-0">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Avatar className="size-12 mr-4">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <div className="flex items-center">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="size-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
                
                <Quote className="size-8 text-primary/20 mb-2" />
                
                <p className="text-muted-foreground mb-4 italic">
                  "{testimonial.text}"
                </p>
                
                <div className="text-sm text-primary font-medium">
                  Purchased: {testimonial.product}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-4 bg-muted/50 px-6 py-4 rounded-full">
            <div className="flex -space-x-2">
              {testimonials.map((testimonial, index) => (
                <Avatar key={index} className="size-8 border-2 border-background">
                  <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                  <AvatarFallback className="text-xs">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            <div className="text-sm">
              <span className="font-semibold">1,000+</span> happy customers and counting
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}