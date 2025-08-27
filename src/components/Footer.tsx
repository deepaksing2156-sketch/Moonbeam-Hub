import { Link } from "react-router-dom";
import { Moon, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { useMutation } from "convex/react";

import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";

export default function Footer() {
  const [email, setEmail] = useState("");
  const subscribeNewsletter = useMutation(api.contact.subscribeNewsletter);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      await subscribeNewsletter({ email });
      toast.success("Successfully subscribed to newsletter!");
      setEmail("");
    } catch (error) {
      toast.error("Failed to subscribe. Please try again.");
    }
  };

  const footerLinks = {
    "Quick Links": [
      { name: "Home", href: "/" },
      { name: "Products", href: "/products" },
      { name: "About Us", href: "/about" },
      { name: "Contact", href: "/contact" },
    ],
    "Customer Service": [
      { name: "My Account", href: "/profile" },
      { name: "Order History", href: "/orders" },
      { name: "Shipping Info", href: "/about" },
      { name: "Returns", href: "/contact" },
    ],
    "Categories": [
      { name: "Dresses", href: "/products?category=Dresses" },
      { name: "Tops", href: "/products?category=Tops" },
      { name: "Accessories", href: "/products?category=Accessories" },
      { name: "Activewear", href: "/products?category=Activewear" },
    ],
  };

  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Moon className="size-8 text-primary" />
              <span className="text-2xl font-bold text-primary">Moonbeam</span>
            </Link>
            <p className="text-muted-foreground mb-4 max-w-md">
              Discover a seamless online experience for ladies' products. Join our community of empowered women and explore curated selections tailored just for you.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <MapPin className="size-4" />
                <span>123 Fashion Street, Style City, SC 12345</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="size-4" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="size-4" />
                <span>hello@moonbeam.com</span>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold mb-4">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        {/* Newsletter & Social */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
            <span className="text-sm font-medium">Stay updated with our newsletter:</span>
            <form onSubmit={handleNewsletterSubmit} className="flex space-x-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-64"
                required
              />
              <Button type="submit" size="sm">
                Subscribe
              </Button>
            </form>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">Follow us:</span>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" className="size-8">
                <Facebook className="size-4" />
              </Button>
              <Button variant="ghost" size="icon" className="size-8">
                <Instagram className="size-4" />
              </Button>
              <Button variant="ghost" size="icon" className="size-8">
                <Twitter className="size-4" />
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Copyright */}
        <div className="text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Moonbeam. All rights reserved. | Privacy Policy | Terms of Service</p>
        </div>
      </div>
    </footer>
  );
}