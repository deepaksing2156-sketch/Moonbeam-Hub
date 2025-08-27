import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { Navigate } from "react-router-dom";
import { CreditCard, Lock, ArrowLeft, Check } from "lucide-react";
import { toast } from "sonner";

import Layout from "@/components/Layout.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { useAuth } from "@/hooks/use-auth.ts";
import { api } from "@/convex/_generated/api";
import { Link } from "react-router-dom";

export default function Checkout() {
  const { isAuthenticated } = useAuth();
  const cartItems = useQuery(api.cart.getCartItems);
  const createOrder = useMutation(api.orders.createOrder);

  const [step, setStep] = useState<"shipping" | "payment" | "review">("shipping");
  const [isLoading, setIsLoading] = useState(false);
  
  const [shippingData, setShippingData] = useState({
    name: "",
    address: "",
    city: "",
    zipCode: "",
    phone: "",
  });

  const [paymentData, setPaymentData] = useState({
    method: "card",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
  });

  const [billingAddressSame, setBillingAddressSame] = useState(true);

  if (!isAuthenticated) {
    return <Navigate to="/cart" replace />;
  }

  if (!cartItems || cartItems.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  const tax = subtotal * 0.08;
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("payment");
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("review");
  };

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    try {
      const orderItems = cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      const result = await createOrder({
        items: orderItems,
        shippingAddress: shippingData,
        paymentMethod: paymentData.method,
      });

      toast.success("Order placed successfully!");
      // Redirect to order confirmation
      window.location.href = `/orders/${result.orderNumber}`;
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { id: "shipping", title: "Shipping", completed: step !== "shipping" },
    { id: "payment", title: "Payment", completed: false },
    { id: "review", title: "Review", completed: false },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Button variant="ghost" asChild className="mb-4">
              <Link to="/cart">
                <ArrowLeft className="size-4 mr-2" />
                Back to Cart
              </Link>
            </Button>
            <h1 className="text-3xl font-bold mb-4">Checkout</h1>
            
            {/* Progress Steps */}
            <div className="flex items-center space-x-4 mb-8">
              {steps.map((stepItem, index) => (
                <div key={stepItem.id} className="flex items-center">
                  <div className={`flex items-center justify-center size-8 rounded-full border-2 ${
                    step === stepItem.id 
                      ? "border-primary bg-primary text-primary-foreground" 
                      : stepItem.completed 
                      ? "border-green-500 bg-green-500 text-white"
                      : "border-muted-foreground text-muted-foreground"
                  }`}>
                    {stepItem.completed ? (
                      <Check className="size-4" />
                    ) : (
                      <span className="text-sm">{index + 1}</span>
                    )}
                  </div>
                  <span className={`ml-2 ${
                    step === stepItem.id ? "text-primary font-medium" : "text-muted-foreground"
                  }`}>
                    {stepItem.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div className="w-16 h-px bg-muted-foreground mx-4" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {step === "shipping" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleShippingSubmit} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            value={shippingData.name}
                            onChange={(e) => setShippingData({...shippingData, name: e.target.value})}
                            placeholder="John Smith"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input
                            id="phone"
                            value={shippingData.phone}
                            onChange={(e) => setShippingData({...shippingData, phone: e.target.value})}
                            placeholder="(555) 123-4567"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Address *</Label>
                        <Input
                          id="address"
                          value={shippingData.address}
                          onChange={(e) => setShippingData({...shippingData, address: e.target.value})}
                          placeholder="123 Main Street"
                          required
                        />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">City *</Label>
                          <Input
                            id="city"
                            value={shippingData.city}
                            onChange={(e) => setShippingData({...shippingData, city: e.target.value})}
                            placeholder="New York"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zipCode">ZIP Code *</Label>
                          <Input
                            id="zipCode"
                            value={shippingData.zipCode}
                            onChange={(e) => setShippingData({...shippingData, zipCode: e.target.value})}
                            placeholder="10001"
                            required
                          />
                        </div>
                      </div>

                      <Button type="submit" className="w-full" size="lg">
                        Continue to Payment
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}

              {step === "payment" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="size-5" />
                      Payment Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePaymentSubmit} className="space-y-6">
                      <RadioGroup value={paymentData.method} onValueChange={(value) => setPaymentData({...paymentData, method: value})}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="card" id="card" />
                          <Label htmlFor="card">Credit/Debit Card</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="paypal" id="paypal" />
                          <Label htmlFor="paypal">PayPal</Label>
                        </div>
                      </RadioGroup>

                      {paymentData.method === "card" && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="cardNumber">Card Number *</Label>
                            <Input
                              id="cardNumber"
                              value={paymentData.cardNumber}
                              onChange={(e) => setPaymentData({...paymentData, cardNumber: e.target.value})}
                              placeholder="1234 5678 9012 3456"
                              required
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="expiryDate">Expiry Date *</Label>
                              <Input
                                id="expiryDate"
                                value={paymentData.expiryDate}
                                onChange={(e) => setPaymentData({...paymentData, expiryDate: e.target.value})}
                                placeholder="MM/YY"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="cvv">CVV *</Label>
                              <Input
                                id="cvv"
                                value={paymentData.cvv}
                                onChange={(e) => setPaymentData({...paymentData, cvv: e.target.value})}
                                placeholder="123"
                                required
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="nameOnCard">Name on Card *</Label>
                            <Input
                              id="nameOnCard"
                              value={paymentData.nameOnCard}
                              onChange={(e) => setPaymentData({...paymentData, nameOnCard: e.target.value})}
                              placeholder="John Smith"
                              required
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="billingAddress" 
                          checked={billingAddressSame}
                          onCheckedChange={setBillingAddressSame}
                        />
                        <Label htmlFor="billingAddress" className="text-sm">
                          Billing address same as shipping address
                        </Label>
                      </div>

                      <div className="flex gap-4">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setStep("shipping")}
                          className="flex-1"
                        >
                          Back
                        </Button>
                        <Button type="submit" className="flex-1">
                          Review Order
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              {step === "review" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Review Your Order</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Order Items */}
                    <div>
                      <h4 className="font-semibold mb-4">Order Items</h4>
                      <div className="space-y-4">
                        {cartItems.map((item) => (
                          <div key={item._id} className="flex items-center space-x-4">
                            <img
                              src={item.product?.imageUrl}
                              alt={item.product?.name}
                              className="size-16 rounded object-cover"
                            />
                            <div className="flex-1">
                              <h5 className="font-medium">{item.product?.name}</h5>
                              <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">
                                ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Shipping Info */}
                    <div>
                      <h4 className="font-semibold mb-2">Shipping Address</h4>
                      <div className="text-sm text-muted-foreground">
                        <p>{shippingData.name}</p>
                        <p>{shippingData.address}</p>
                        <p>{shippingData.city}, {shippingData.zipCode}</p>
                        <p>{shippingData.phone}</p>
                      </div>
                    </div>

                    <Separator />

                    {/* Payment Info */}
                    <div>
                      <h4 className="font-semibold mb-2">Payment Method</h4>
                      <p className="text-sm text-muted-foreground capitalize">
                        {paymentData.method === "card" ? "Credit/Debit Card" : "PayPal"}
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setStep("payment")}
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button 
                        onClick={handlePlaceOrder}
                        disabled={isLoading}
                        className="flex-1"
                      >
                        <Lock className="size-4 mr-2" />
                        {isLoading ? "Placing Order..." : "Place Order"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
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
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-muted-foreground pt-4">
                    <Lock className="size-4" />
                    <span>Your information is secure and encrypted</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}