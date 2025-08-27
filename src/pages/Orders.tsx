import { usePaginatedQuery } from "convex/react";
import { Package, Truck, CheckCircle, XCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";

import Layout from "@/components/Layout.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { EmptyState } from "@/components/ui/empty-state.tsx";
import { useAuth } from "@/hooks/use-auth.ts";
import { api } from "@/convex/_generated/api";

export default function Orders() {
  const { isAuthenticated } = useAuth();
  
  const {
    results: orders,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.orders.getUserOrders,
    {},
    { initialNumItems: 10 }
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="size-4 text-orange-500" />;
      case "processing":
        return <Package className="size-4 text-blue-500" />;
      case "shipped":
        return <Truck className="size-4 text-purple-500" />;
      case "delivered":
        return <CheckCircle className="size-4 text-green-500" />;
      case "cancelled":
        return <XCircle className="size-4 text-red-500" />;
      default:
        return <Clock className="size-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "shipped":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <EmptyState
            icon={Package}
            title="Sign in to view your orders"
            description="Please sign in to see your order history and track your purchases."
          />
        </div>
      </Layout>
    );
  }

  if (!orders) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <Skeleton className="h-6 w-32" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                        <Skeleton className="h-6 w-20" />
                      </div>
                      <Separator />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {Array.from({ length: 2 }).map((_, j) => (
                          <div key={j} className="flex space-x-3">
                            <Skeleton className="size-16 rounded" />
                            <div className="space-y-2 flex-1">
                              <Skeleton className="h-4 w-full" />
                              <Skeleton className="h-3 w-16" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (orders.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <EmptyState
            icon={Package}
            title="No orders yet"
            description="You haven't placed any orders yet. Start shopping to see your order history here!"
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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Your Orders</h1>
            <p className="text-muted-foreground">
              Track and manage your orders
            </p>
          </div>

          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order._id}>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg">
                        Order #{order.orderNumber}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Placed on {new Date(order._creationTime).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <Badge className={getStatusColor(order.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(order.status)}
                          <span className="capitalize">{order.status}</span>
                        </div>
                      </Badge>
                      <div className="text-right">
                        <p className="font-bold text-lg">${order.total.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.items.length} {order.items.length === 1 ? "item" : "items"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {/* Order Items */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {order.items.slice(0, 3).map((item, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="size-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm line-clamp-2">
                              {item.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Qty: {item.quantity} × ${item.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                      
                      {order.items.length > 3 && (
                        <div className="flex items-center justify-center text-sm text-muted-foreground">
                          +{order.items.length - 3} more items
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* Order Details */}
                    <div className="flex flex-col md:flex-row gap-6 text-sm">
                      <div>
                        <h5 className="font-medium mb-2">Shipping Address</h5>
                        <div className="text-muted-foreground space-y-1">
                          <p>{order.shippingAddress.name}</p>
                          <p>{order.shippingAddress.address}</p>
                          <p>{order.shippingAddress.city}, {order.shippingAddress.zipCode}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-medium mb-2">Payment Method</h5>
                        <p className="text-muted-foreground capitalize">
                          {order.paymentMethod}
                        </p>
                      </div>
                      
                      <div className="md:ml-auto">
                        <h5 className="font-medium mb-2">Order Total</h5>
                        <div className="text-muted-foreground space-y-1">
                          <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>${order.subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Shipping:</span>
                            <span>${order.shipping.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tax:</span>
                            <span>${order.tax.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-bold text-foreground border-t pt-1">
                            <span>Total:</span>
                            <span>${order.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      {order.status === "delivered" && (
                        <Button variant="outline" size="sm">
                          Leave Review
                        </Button>
                      )}
                      {(order.status === "pending" || order.status === "processing") && (
                        <Button variant="outline" size="sm">
                          Cancel Order
                        </Button>
                      )}
                      {order.status === "shipped" && (
                        <Button variant="outline" size="sm">
                          Track Package
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More */}
          {status === "CanLoadMore" && (
            <div className="text-center mt-8">
              <Button 
                variant="outline" 
                onClick={() => loadMore(10)}
                size="lg"
              >
                Load More Orders
              </Button>
            </div>
          )}

          {status === "LoadingMore" && (
            <div className="text-center mt-8">
              <p className="text-muted-foreground">Loading more orders...</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}