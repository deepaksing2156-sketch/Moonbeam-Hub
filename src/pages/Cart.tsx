import { Link } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import Layout from "@/components/Layout.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { EmptyState } from "@/components/ui/empty-state.tsx";
import { useAuth } from "@/hooks/use-auth.ts";
import { api } from "@/convex/_generated/api";

export default function Cart() {
  const { isAuthenticated } = useAuth();
  const cartItems = useQuery(api.cart.getCartItems);
  const updateQuantity = useMutation(api.cart.updateCartItemQuantity);
  const removeFromCart = useMutation(api.cart.removeFromCart);

  const handleQuantityChange = async (cartItemId: string, newQuantity: number) => {
    try {
      await updateQuantity({ cartItemId: cartItemId as any, quantity: newQuantity });
      if (newQuantity === 0) {
        toast.success("Item removed from cart");
      }
    } catch (error) {
      toast.error("Failed to update quantity");
    }
  };

  const handleRemoveItem = async (cartItemId: string, productName: string) => {
    try {
      await removeFromCart({ cartItemId: cartItemId as any });
      toast.success(`${productName} removed from cart`);
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <EmptyState
            icon={ShoppingBag}
            title="Sign in to view your cart"
            description="Please sign in to see items you've added to your cart."
            action={
              <Button asChild>
                <Link to="/products">Continue Shopping</Link>
              </Button>
            }
          />
        </div>
      </Layout>
    );
  }

  if (!cartItems) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex space-x-4">
                      <Skeleton className="size-24 rounded" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-8 w-32" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div>
              <Card>
                <CardContent className="p-4 space-y-4">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <EmptyState
            icon={ShoppingBag}
            title="Your cart is empty"
            description="Looks like you haven't added anything to your cart yet. Discover our amazing products!"
            action={
              <Button asChild>
                <Link to="/products">Start Shopping</Link>
              </Button>
            }
          />
        </div>
      </Layout>
    );
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  const tax = subtotal * 0.08;
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/products">
              <ArrowLeft className="size-4 mr-2" />
              Continue Shopping
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <p className="text-muted-foreground">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              if (!item.product) return null;
              
              return (
                <Card key={item._id}>
                  <CardContent className="p-6">
                    <div className="flex space-x-4">
                      <div className="size-24 rounded-md overflow-hidden bg-muted flex-shrink-0">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-1 line-clamp-2">
                          <Link 
                            to={`/products/${item.product._id}`}
                            className="hover:text-primary transition-colors"
                          >
                            {item.product.name}
                          </Link>
                        </h3>
                        <p className="text-muted-foreground text-sm mb-3">
                          {item.product.category}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="size-8"
                              onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                            >
                              <Minus className="size-3" />
                            </Button>
                            <span className="w-12 text-center font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="size-8"
                              onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                            >
                              <Plus className="size-3" />
                            </Button>
                          </div>
                          
                          <div className="text-right">
                            <p className="font-bold text-lg">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              ${item.product.price.toFixed(2)} each
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive self-start"
                        onClick={() => handleRemoveItem(item._id, item.product?.name || "Item")}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  {shipping === 0 && (
                    <p className="text-sm text-green-600">
                      🎉 You qualify for free shipping!
                    </p>
                  )}
                  {subtotal < 50 && shipping > 0 && (
                    <p className="text-sm text-muted-foreground">
                      Add ${(50 - subtotal).toFixed(2)} more for free shipping
                    </p>
                  )}
                </div>
                
                <Separator />
                
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                
                <Button asChild className="w-full" size="lg">
                  <Link to="/checkout">
                    Proceed to Checkout
                  </Link>
                </Button>
                
                <p className="text-xs text-muted-foreground text-center">
                  Secure checkout with SSL encryption
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}