import Layout from "@/components/Layout.tsx";
import Hero from "./_components/Hero.tsx";
import FeaturedProducts from "./_components/FeaturedProducts.tsx";
import Categories from "./_components/Categories.tsx";
import Testimonials from "./_components/Testimonials.tsx";
import NewsletterSignup from "./_components/NewsletterSignup.tsx";

export default function Index() {
  return (
    <Layout>
      <Hero />
      <FeaturedProducts />
      <Categories />
      <Testimonials />
      <NewsletterSignup />
    </Layout>
  );
}