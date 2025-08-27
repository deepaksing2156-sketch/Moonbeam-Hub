import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { User, Settings, Package, Heart, Bell, CreditCard, MapPin } from "lucide-react";
import { toast } from "sonner";

import Layout from "@/components/Layout.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx";
import { Switch } from "@/components/ui/switch.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { EmptyState } from "@/components/ui/empty-state.tsx";
import { useAuth, useUser } from "@/hooks/use-auth.ts";
import { api } from "@/convex/_generated/api";

export default function Profile() {
  const { isAuthenticated } = useAuth();
  const { name, email, avatar } = useUser();
  const userProfile = useQuery(api.users.getCurrentUser);
  const updateProfile = useMutation(api.users.updateProfile);
  const createOrUpdateUser = useMutation(api.users.createOrUpdateUser);

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
  });

  // Initialize form data when user data loads
  useState(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || name || "",
        phone: userProfile.phone || "",
        address: userProfile.address || "",
        city: userProfile.city || "",
        zipCode: userProfile.zipCode || "",
      });
    } else if (name) {
      setFormData(prev => ({ ...prev, name }));
    }
  });

  const handleSave = async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    try {
      if (userProfile) {
        await updateProfile(formData);
      } else {
        await createOrUpdateUser({
          ...formData,
          email: email || "",
        });
      }
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || name || "",
        phone: userProfile.phone || "",
        address: userProfile.address || "",
        city: userProfile.city || "",
        zipCode: userProfile.zipCode || "",
      });
    }
    setIsEditing(false);
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <EmptyState
            icon={User}
            title="Sign in to view your profile"
            description="Please sign in to access your profile and account settings."
          />
        </div>
      </Layout>
    );
  }

  if (!userProfile && isAuthenticated) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-4 gap-8">
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
              <div className="lg:col-span-3 space-y-6">
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="size-20 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-48" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="space-y-2">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-10 w-full" />
                        </div>
                      ))}
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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Account</h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>

          <Tabs defaultValue="profile" className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <TabsList className="flex flex-col h-auto w-full bg-transparent p-0 space-y-2">
                <TabsTrigger 
                  value="profile" 
                  className="w-full justify-start data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <User className="size-4 mr-2" />
                  Profile
                </TabsTrigger>
                <TabsTrigger 
                  value="orders" 
                  className="w-full justify-start data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Package className="size-4 mr-2" />
                  Orders
                </TabsTrigger>
                <TabsTrigger 
                  value="wishlist" 
                  className="w-full justify-start data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Heart className="size-4 mr-2" />
                  Wishlist
                </TabsTrigger>
                <TabsTrigger 
                  value="settings" 
                  className="w-full justify-start data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Settings className="size-4 mr-2" />
                  Settings
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <TabsContent value="profile" className="space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Personal Information</CardTitle>
                    {!isEditing ? (
                      <Button variant="outline" onClick={() => setIsEditing(true)}>
                        Edit Profile
                      </Button>
                    ) : (
                      <div className="space-x-2">
                        <Button variant="outline" onClick={handleCancel}>
                          Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={isLoading}>
                          {isLoading ? "Saving..." : "Save"}
                        </Button>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <Avatar className="size-20">
                        <AvatarImage src={avatar} alt={name || "User"} />
                        <AvatarFallback className="text-lg">
                          {(name || "U").split(" ").map(n => n[0]).join("").toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-semibold">{name}</h3>
                        <p className="text-muted-foreground">{email}</p>
                        {!isEditing && (
                          <Button variant="ghost" size="sm" className="mt-2 p-0 h-auto text-primary">
                            Change Photo
                          </Button>
                        )}
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          value={email || ""}
                          disabled
                          className="bg-muted"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          disabled={!isEditing}
                          placeholder="(555) 123-4567"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={(e) => setFormData({...formData, address: e.target.value})}
                          disabled={!isEditing}
                          placeholder="123 Main Street"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => setFormData({...formData, city: e.target.value})}
                          disabled={!isEditing}
                          placeholder="New York"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          value={formData.zipCode}
                          onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                          disabled={!isEditing}
                          placeholder="10001"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <EmptyState
                      icon={Package}
                      title="No recent orders"
                      description="Your recent orders will appear here. Start shopping to see your order history!"
                      action={
                        <Button asChild>
                          <a href="/products">Start Shopping</a>
                        </Button>
                      }
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="wishlist">
                <Card>
                  <CardHeader>
                    <CardTitle>My Wishlist</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <EmptyState
                      icon={Heart}
                      title="Your wishlist is empty"
                      description="Save items you love to your wishlist to purchase later."
                      action={
                        <Button asChild>
                          <a href="/products">Browse Products</a>
                        </Button>
                      }
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="size-5" />
                      Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Receive order updates and promotional emails
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">SMS Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Get text updates about your orders
                        </p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Newsletter</p>
                        <p className="text-sm text-muted-foreground">
                          Weekly fashion tips and exclusive offers
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="size-5" />
                      Payment Methods
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      No payment methods saved yet. Add a payment method during checkout to save it for future orders.
                    </p>
                    <Button variant="outline">
                      Add Payment Method
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="size-5" />
                      Addresses
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {userProfile?.address ? (
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">Default Address</p>
                            <div className="text-sm text-muted-foreground mt-1">
                              <p>{userProfile.address}</p>
                              <p>{userProfile.city}, {userProfile.zipCode}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground mb-4">
                        No addresses saved yet. Add your address in the profile section.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}