import { Heart, Award, Users, Sparkles, Shield, Truck } from "lucide-react";

import Layout from "@/components/Layout.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Link } from "react-router-dom";

export default function About() {
  const values = [
    {
      icon: Heart,
      title: "Empowerment",
      description: "We believe every woman deserves to feel confident and beautiful in her own skin.",
    },
    {
      icon: Award,
      title: "Quality",
      description: "Premium materials and craftsmanship in every piece we curate for our collection.",
    },
    {
      icon: Users,
      title: "Community",
      description: "Building a supportive community of empowered women who inspire each other.",
    },
    {
      icon: Sparkles,
      title: "Innovation",
      description: "Constantly evolving to bring you the latest trends and timeless classics.",
    },
  ];

  const features = [
    {
      icon: Shield,
      title: "Secure Shopping",
      description: "Your personal information and payments are always protected.",
    },
    {
      icon: Truck,
      title: "Fast Shipping",
      description: "Free shipping on orders over $50, delivered within 3-5 business days.",
    },
  ];

  const stats = [
    { number: "10K+", label: "Happy Customers" },
    { number: "500+", label: "Products" },
    { number: "99%", label: "Satisfaction Rate" },
    { number: "24/7", label: "Customer Support" },
  ];

  const team = [
    {
      name: "Sarah Mitchell",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b830?w=300&h=300&fit=crop&crop=face",
      bio: "Former fashion buyer with 10+ years experience in women's fashion.",
    },
    {
      name: "Emma Rodriguez",
      role: "Creative Director",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      bio: "Award-winning designer passionate about sustainable fashion.",
    },
    {
      name: "Lisa Chen",
      role: "Head of Customer Experience",
      image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=300&h=300&fit=crop&crop=face",
      bio: "Dedicated to ensuring every customer has an exceptional experience.",
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4">About Moonbeam</Badge>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-balance">
            Empowering Women Through
            <span className="text-primary block">Fashion & Style</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Founded with a mission to celebrate the unique beauty and strength of every woman, 
            Moonbeam offers carefully curated fashion that makes you feel confident, comfortable, and authentically you.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Moonbeam began in 2020 with a simple yet powerful vision: to create a space where 
                  every woman could discover her perfect style. Founded by Sarah Mitchell, a former 
                  fashion buyer who understood the struggle of finding quality, affordable fashion 
                  that truly fits and flatters.
                </p>
                <p>
                  What started as a small online boutique has grown into a community of over 10,000 
                  satisfied customers. We've remained true to our core mission of providing exceptional 
                  quality, personalized service, and styles that celebrate the diversity and beauty 
                  of all women.
                </p>
                <p>
                  Today, we continue to evolve, always listening to our community and staying ahead 
                  of trends while maintaining the timeless elegance that defines the Moonbeam aesthetic.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=450&fit=crop"
                  alt="Moonbeam fashion studio"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do and every decision we make.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center h-full">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <div className="inline-flex p-3 bg-primary/10 rounded-full">
                      <value.icon className="size-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">By the Numbers</h2>
            <p className="text-muted-foreground">
              Our growth reflects the trust our customers place in us.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The passionate people behind Moonbeam who work every day to bring you exceptional fashion and service.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                    <p className="text-primary font-medium mb-3">{member.role}</p>
                    <p className="text-muted-foreground text-sm">{member.bio}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Moonbeam?</h2>
            <p className="text-muted-foreground">
              We're committed to providing you with the best shopping experience possible.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 bg-gradient-to-br from-pink-50/50 to-purple-50/50 dark:from-gray-800 dark:to-gray-900">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-primary/10 rounded-lg flex-shrink-0">
                      <feature.icon className="size-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Discover Your Style?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of women who have found their perfect style with Moonbeam. 
            Start exploring our collection today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/products">Shop Now</Link>
            </Button>
            <Button size="lg" variant="ghost" className="border border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}