'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Trash2, Edit, Plus, Upload, X, Save, Search } from 'lucide-react';
import { createClient } from '@/lib/sbClient';

interface Product {
  id: string;
  title: string;
  price: string[];
  description: string | null;
  category: string[];
  images: string[];
  date_published: string | null;
  stock: boolean;
  weight: string[];
  size: string[];
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

interface ProductFormData {
  title: string;
  price: string;
  description: string;
  category: string;
  weight: string;
  size: string;
  stock: boolean;
  featured: boolean;
  sort_order: number;
}

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [activeTab, setActiveTab] = useState('products');
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    price: '',
    description: '',
    category: '',
    weight: '',
    size: '',
    stock: true,
    featured: false,
    sort_order: 0
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

      // Check if user exists in admins table
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
      console.log('User ID:', session.user.id);
      console.log('Email:', session.user.email);
      console.log('Is admin:', userIsAdmin);
      
      setIsAdmin(userIsAdmin);
      
      if (userIsAdmin) {
        loadProducts();
      }
    } catch (error) {
      console.error('Admin check failed:', error);
      setIsAdmin(false);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('sort_order', { ascending: false });
      
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
      alert('Error loading products');
    } finally {
      setLoading(false);
    }
  };

  const uploadImages = async (files: File[], productId: string): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    
    for (const file of files) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${productId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        console.log('Uploading file:', fileName, 'Size:', file.size);
        
        const { data, error } = await supabase.storage
          .from('prdimgs')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });
        
        if (error) {
          console.error('Upload error:', error);
          alert(`Upload failed for ${file.name}: ${error.message}`);
          continue;
        }
        
        console.log('Upload successful:', data);
        
        const { data: urlData } = supabase.storage
          .from('prdimgs')
          .getPublicUrl(fileName);
        
        console.log('Public URL:', urlData.publicUrl);
        uploadedUrls.push(urlData.publicUrl);
      } catch (err) {
        console.error('Error uploading file:', file.name, err);
        alert(`Error uploading ${file.name}`);
      }
    }
    
    console.log('All uploaded URLs:', uploadedUrls);
    return uploadedUrls;
  };

  const resetForm = () => {
    setFormData({
      title: '',
      price: '',
      description: '',
      category: '',
      weight: '',
      size: '',
      stock: true,
      featured: false,
      sort_order: 0
    });
    setSelectedImages([]);
    setEditingProduct(null);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      price: product.price.join(', '),
      description: product.description || '',
      category: product.category.join(', '),
      weight: product.weight.join(', '),
      size: product.size.join(', '),
      stock: product.stock,
      featured: product.featured,
      sort_order: product.sort_order
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedImages(prev => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!formData.title || !formData.price) {
      alert('Title and Price are required');
      return;
    }

    setLoading(true);
    
    try {
      const productData = {
        title: formData.title,
        price: formData.price.split(',').map(p => p.trim()).filter(p => p),
        description: formData.description || null,
        category: formData.category.split(',').map(c => c.trim()).filter(c => c),
        weight: formData.weight.split(',').map(w => w.trim()).filter(w => w),
        size: formData.size.split(',').map(s => s.trim()).filter(s => s),
        stock: formData.stock,
        featured: formData.featured,
        sort_order: formData.sort_order
      };

      let product: Product;

      if (editingProduct) {
        // Update existing product
        const { data, error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id)
          .select()
          .single();
        
        if (error) throw error;
        product = data;
      } else {
        // Create new product
        const { data, error } = await supabase
          .from('products')
          .insert([productData])
          .select()
          .single();
        
        if (error) throw error;
        product = data;
      }

      // Upload images if any
      if (selectedImages.length > 0) {
        console.log('Starting image upload for', selectedImages.length, 'files');
        const uploadedUrls = await uploadImages(selectedImages, product.id);
        
        if (uploadedUrls.length > 0) {
          const existingImages = editingProduct?.images || [];
          const allImages = [...existingImages, ...uploadedUrls];
          
          console.log('Updating product with images:', allImages);
          
          const { error: updateError } = await supabase
            .from('products')
            .update({ images: allImages })
            .eq('id', product.id);
          
          if (updateError) {
            console.error('Error updating product with images:', updateError);
            alert('Product saved but failed to update images');
          } else {
            product.images = allImages;
            console.log('Successfully updated product with images');
          }
        } else {
          console.log('No images were uploaded successfully');
        }
      }

      // Update local state
      if (editingProduct) {
        setProducts(prev => prev.map(p => p.id === product.id ? product : p));
      } else {
        setProducts(prev => [product, ...prev]);
      }
      
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
      
      if (error) throw error;
      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
        <h1 className="text-2xl font-bold mb-4">Admin Products</h1>

            {/* Header */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Button onClick={openCreateDialog} size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Product
                </Button>
                <Button onClick={loadProducts} variant="outline" size="sm" disabled={loading}>
                  Refresh
                </Button>
              </div>
              
              <div className="relative w-64">
                <Search className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 h-8"
                />
              </div>
            </div>

            {/* Products Table */}
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead>Images</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        No products found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.title}</TableCell>
                        <TableCell>
                          {product.price.map((p, i) => (
                            <span key={i} className="text-sm bg-gray-100 px-1 rounded mr-1">
                              ${p}
                            </span>
                          ))}
                        </TableCell>
                        <TableCell>
                          {product.category.slice(0, 2).map((cat, i) => (
                            <span key={i} className="text-sm bg-blue-100 px-1 rounded mr-1">
                              {cat}
                            </span>
                          ))}
                          {product.category.length > 2 && <span className="text-sm text-gray-500">+{product.category.length - 2}</span>}
                        </TableCell>
                        <TableCell>
                          <span className={`text-sm px-2 py-1 rounded ${product.stock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {product.stock ? 'In Stock' : 'Out'}
                          </span>
                        </TableCell>
                        <TableCell>
                          {product.featured && <span className="text-sm bg-yellow-100 px-2 py-1 rounded">Featured</span>}
                        </TableCell>
                        <TableCell>{product.images.length}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditDialog(product)}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(product.id)}
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

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Edit Product' : 'Add Product'}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <Label className="text-sm">Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Product title"
                  className="h-8"
                />
              </div>

              <div>
                <Label className="text-sm">Price (comma-separated) *</Label>
                <Input
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="29.99, 39.99"
                  className="h-8"
                />
              </div>

              <div>
                <Label className="text-sm">Category</Label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="clothing, casual"
                  className="h-8"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-sm">Weight</Label>
                  <Input
                    value={formData.weight}
                    onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                    placeholder="200g"
                    className="h-8"
                  />
                </div>
                <div>
                  <Label className="text-sm">Size</Label>
                  <Input
                    value={formData.size}
                    onChange={(e) => setFormData(prev => ({ ...prev, size: e.target.value }))}
                    placeholder="S, M, L"
                    className="h-8"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm">Sort Order</Label>
                <Input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                  className="h-8"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <Label className="text-sm">Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Product description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.stock}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, stock: checked }))}
                  />
                  <Label className="text-sm">In Stock</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                  />
                  <Label className="text-sm">Featured</Label>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <Label className="text-sm">Images</Label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <Label htmlFor="image-upload" className="cursor-pointer">
                  <div className="border border-dashed border-gray-300 rounded p-3 text-center hover:border-gray-400">
                    <Upload className="w-4 h-4 mx-auto mb-1" />
                    <p className="text-xs">Upload Images</p>
                  </div>
                </Label>

                {selectedImages.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {selectedImages.map((file, index) => (
                      <div key={index} className="flex items-center justify-between text-xs bg-gray-50 p-1 rounded">
                        <span className="truncate">{file.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeImage(index)}
                          className="h-4 w-4 p-0"
                        >
                          <X className="w-2 h-2" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {editingProduct && editingProduct.images.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-600">Current: {editingProduct.images.length} image(s)</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} size="sm">
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading} size="sm">
              <Save className="w-4 h-4 mr-1" />
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProducts;