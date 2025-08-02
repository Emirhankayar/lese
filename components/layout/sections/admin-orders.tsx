'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Edit, Plus, Search, Package, User, DollarSign, Calendar } from 'lucide-react';
import { createClient } from '@/lib/sbClient';

interface OrderView {
  id: string;
  order_id: string;
  user_id: string;
  user_email: string;
  user_full_name: string | null;
  product_id: string;
  product_title: string;
  product_image: string | null;
  product_category: string[] | null;
  quantity: number;
  selected_price: number;
  selected_size: string | null;
  selected_weight: string | null;
  subtotal: number;
  tax_rate: number | null;
  tax_amount: number;
  total_with_tax: number;
  order_status: string;
  order_timestamp: string;
  created_at: string;
  updated_at: string;
}

interface OrderFormData {
  user_email: string;
  product_title: string;
  quantity: number;
  selected_price: number;
  selected_size: string;
  selected_weight: string;
  order_status: string;
}

const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const AdminOrders = () => {
  const [orders, setOrders] = useState<OrderView[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingOrder, setEditingOrder] = useState<OrderView | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [formData, setFormData] = useState<OrderFormData>({
    user_email: '',
    product_title: '',
    quantity: 1,
    selected_price: 0,
    selected_size: '',
    selected_weight: '',
    order_status: 'pending'
  });

  const supabase = createClient();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        setIsAdmin(false);
        return;
      }

      const { data: adminData, error } = await supabase
        .from('admins')
        .select('user_id')
        .eq('user_id', session.user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        return;
      }

      const userIsAdmin = !!adminData;
      setIsAdmin(userIsAdmin);
      
      if (userIsAdmin) {
        loadOrders();
      }
    } catch (error) {
      console.error('Admin check failed:', error);
      setIsAdmin(false);
    }
  };

  const loadOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('order_views')
        .select('*')
        .order('order_timestamp', { ascending: false });
      
      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error loading orders:', error);
      alert('Error loading orders');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      user_email: '',
      product_title: '',
      quantity: 1,
      selected_price: 0,
      selected_size: '',
      selected_weight: '',
      order_status: 'pending'
    });
    setEditingOrder(null);
  };

  const openEditDialog = (order: OrderView) => {
    setEditingOrder(order);
    setFormData({
      user_email: order.user_email,
      product_title: order.product_title,
      quantity: order.quantity,
      selected_price: order.selected_price,
      selected_size: order.selected_size || '',
      selected_weight: order.selected_weight || '',
      order_status: order.order_status
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);
      
      if (error) throw error;
      
      // Reload orders to get updated data
      await loadOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error updating order status');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.user_email || !formData.product_title) {
      alert('User email and product title are required');
      return;
    }

    setLoading(true);
    
    try {
      if (editingOrder) {
        // Update existing order status only (most common use case)
        const { error } = await supabase
          .from('orders')
          .update({ status: formData.order_status })
          .eq('id', editingOrder.order_id);
        
        if (error) throw error;
      } else {
        // For creating new orders, you might want to implement additional logic
        // to find user_id and product_id based on email and title
        alert('Creating new orders requires additional implementation for user/product lookup');
        return;
      }

      await loadOrders();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving order:', error);
      alert('Error saving order');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (orderId: string) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);
      
      if (error) throw error;
      await loadOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Error deleting order');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.user_full_name && order.user_full_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || order.order_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Show loading while checking admin status
  if (isAdmin === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Checking access permissions...</p>
        </div>
      </div>
    );
  }

  // Show access denied if not admin
  if (isAdmin === false) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You do not have permission to access this admin panel.</p>
          <Button onClick={() => window.location.href = '/'}>
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-4">Admin Orders</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="border rounded-md p-4">
            <div className="flex items-center">
              <Package className="w-8 h-8 mr-3" />
              <div>
                <p className="text-sm">Total Orders</p>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
            </div>
          </div>
          <div className="border rounded-md p-4">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 mr-3" />
              <div>
                <p className="text-sm">Total Revenue</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(orders.reduce((sum, order) => sum + order.total_with_tax, 0))}
                </p>
              </div>
            </div>
          </div>
          <div className="border rounded-md p-4">
            <div className="flex items-center">
              <User className="w-8 h-8 mr-3" />
              <div>
                <p className="text-sm">Unique Customers</p>
                <p className="text-2xl font-bold">
                  {new Set(orders.map(order => order.user_email)).size}
                </p>
              </div>
            </div>
          </div>
          <div className="border rounded-md p-4">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 mr-3" />
              <div>
                <p className="text-sm">Pending Orders</p>
                <p className="text-2xl font-bold">
                  {orders.filter(order => order.order_status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <Button onClick={openCreateDialog} size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Add Order
            </Button>
            <Button onClick={loadOrders} variant="outline" size="sm" disabled={loading}>
              Refresh
            </Button>
          </div>
          
          <div className="flex items-center gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32 h-8">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {ORDER_STATUSES.map(status => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="relative w-64">
              <Search className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-8"
              />
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="border rounded-md">
          <Table>
                <TableHeader>
              <TableRow>
                <TableHead className="text-left p-3 font-medium text-sm">Order ID</TableHead>
                <TableHead className="text-left p-3 font-medium text-sm">Customer</TableHead>
                <TableHead className="text-left p-3 font-medium text-sm">Product</TableHead>
                <TableHead className="text-left p-3 font-medium text-sm">Quantity</TableHead>
                <TableHead className="text-left p-3 font-medium text-sm">Price</TableHead>
                <TableHead className="text-left p-3 font-medium text-sm">Total</TableHead>
                <TableHead className="text-left p-3 font-medium text-sm">Status</TableHead>
                <TableHead className="text-left p-3 font-medium text-sm">Date</TableHead>
                <TableHead className="text-left p-3 font-medium text-sm">Actions</TableHead>
              </TableRow>
            </TableHeader>
                <TableBody>
              {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        Loading...
                      </TableCell>
                    </TableRow>
              ) : filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        No orders found
                      </TableCell>
                    </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="p-3 font-mono text-sm">
                      {order.order_id.slice(0, 8)}...
                    </TableCell>
                    <TableCell className="p-3">
                      <div>
                        <div className="font-medium">{order.user_full_name || 'N/A'}</div>
                        <div className="text-sm ">{order.user_email}</div>
                      </div>
                    </TableCell>
                    <TableCell className="p-3">
                      <div className="max-w-48">
                        <div className="font-medium truncate">{order.product_title}</div>
                        {order.selected_size && (
                          <div className="text-sm ">Size: {order.selected_size}</div>
                        )}
                        {order.selected_weight && (
                          <div className="text-sm ">Weight: {order.selected_weight}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="p-3">{order.quantity}</TableCell>
                    <TableCell className="p-3">{formatCurrency(order.selected_price)}</TableCell>
                    <TableCell className="p-3 font-semibold">
                      {formatCurrency(order.total_with_tax)}
                    </TableCell>
                    <TableCell className="p-3">
                      <Select
                        value={order.order_status}
                        onValueChange={(newStatus) => handleUpdateStatus(order.order_id, newStatus)}
                      >
                        <SelectTrigger className={`w-28 h-6 text-xs ${getStatusColor(order.order_status)}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ORDER_STATUSES.map(status => (
                            <SelectItem key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="p-3 text-sm">
                      {formatDate(order.order_timestamp)}
                    </TableCell>
                    <TableCell className="p-3">
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(order)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(order.order_id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingOrder ? 'Edit Order' : 'Add Order'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="text-sm">Customer Email</Label>
              <Input
                value={formData.user_email}
                onChange={(e) => setFormData(prev => ({ ...prev, user_email: e.target.value }))}
                placeholder="customer@example.com"
                disabled={!!editingOrder}
                className="h-8"
              />
            </div>

            <div>
              <Label className="text-sm">Product Title</Label>
              <Input
                value={formData.product_title}
                onChange={(e) => setFormData(prev => ({ ...prev, product_title: e.target.value }))}
                placeholder="Product name"
                disabled={!!editingOrder}
                className="h-8"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-sm">Quantity</Label>
                <Input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                  disabled={!!editingOrder}
                  className="h-8"
                />
              </div>
              <div>
                <Label className="text-sm">Price</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.selected_price}
                  onChange={(e) => setFormData(prev => ({ ...prev, selected_price: parseFloat(e.target.value) || 0 }))}
                  disabled={!!editingOrder}
                  className="h-8"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-sm">Size</Label>
                <Input
                  value={formData.selected_size}
                  onChange={(e) => setFormData(prev => ({ ...prev, selected_size: e.target.value }))}
                  disabled={!!editingOrder}
                  className="h-8"
                />
              </div>
              <div>
                <Label className="text-sm">Weight</Label>
                <Input
                  value={formData.selected_weight}
                  onChange={(e) => setFormData(prev => ({ ...prev, selected_weight: e.target.value }))}
                  disabled={!!editingOrder}
                  className="h-8"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm">Status</Label>
              <Select value={formData.order_status} onValueChange={(value) => setFormData(prev => ({ ...prev, order_status: value }))}>
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ORDER_STATUSES.map(status => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} size="sm">
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading} size="sm">
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrders;