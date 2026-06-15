import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  MenuItem,
  Tab,
  Tabs,
  IconButton,
} from '@mui/material';
import {
  Plus as CreateIcon,
  Edit as EditIcon,
  Trash as DeleteIcon,
  Package as OrderIcon,
  Truck as TrackingIcon,
} from 'lucide-react';
import {
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAdminOrders,
  updateOrderStatus,
  updateOrderTracking
} from '../../services/admin.service';
import { toast } from 'react-toastify';

function AdminRewardStore() {
  const [activeTab, setActiveTab] = useState(0);
  
  // Product States
  const [products, setProducts] = useState([]);
  const [productLoading, setProductLoading] = useState(true);
  const [productPage, setProductPage] = useState(1);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    category: 'gift_cards',
    imageUrl: '', // We'll wrap it in array [{url}] inside request
    coinPrice: '',
    stock: '',
    requiresKyc: false,
  });

  // Order States
  const [orders, setOrders] = useState([]);
  const [orderLoading, setOrderLoading] = useState(true);
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);

  const [orderForm, setOrderForm] = useState({ status: 'pending', notes: '' });
  const [trackingForm, setTrackingForm] = useState({
    carrier: '',
    trackingNumber: '',
    trackingUrl: '',
    estimatedDelivery: '',
  });

  // Fetch Products
  const fetchProducts = async () => {
    setProductLoading(true);
    try {
      const data = await getAdminProducts(productPage, 20);
      setProducts(data.data?.products || data.products || data.results || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load products');
    } finally {
      setProductLoading(false);
    }
  };

  // Fetch Orders
  const fetchOrders = async () => {
    setOrderLoading(true);
    try {
      const data = await getAdminOrders(orderStatusFilter, 1, 30);
      setOrders(data || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load orders list');
    } finally {
      setOrderLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 0) {
      fetchProducts();
    } else {
      fetchOrders();
    }
  }, [activeTab, productPage, orderStatusFilter]);

  // Product CRUD Handlers
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: productForm.name,
        description: productForm.description,
        category: productForm.category,
        images: [{ url: productForm.imageUrl || 'https://via.placeholder.com/150' }],
        coinPrice: parseInt(productForm.coinPrice),
        stock: parseInt(productForm.stock),
        requiresKyc: !!productForm.requiresKyc,
      };

      if (editingProductId) {
        await updateProduct(editingProductId, payload);
        toast.success('Product updated successfully');
      } else {
        await createProduct(payload);
        toast.success('Product added successfully');
      }

      setProductModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || 'Error processing product');
    }
  };

  const handleEditClick = (product) => {
    setEditingProductId(product._id);
    setProductForm({
      name: product.name,
      description: product.description || '',
      category: product.category,
      imageUrl: product.images?.[0]?.url || '',
      coinPrice: product.coinPrice.toString(),
      stock: product.stock.toString(),
      requiresKyc: !!product.requiresKyc,
    });
    setProductModalOpen(true);
  };

  const handleCreateClick = () => {
    setEditingProductId(null);
    setProductForm({
      name: '',
      description: '',
      category: 'gift_cards',
      imageUrl: '',
      coinPrice: '',
      stock: '',
      requiresKyc: false,
    });
    setProductModalOpen(true);
  };

  const handleDeleteClick = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (error) {
        console.error(error);
        toast.error('Failed to delete product');
      }
    }
  };

  // Order Handlers
  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateOrderStatus(selectedOrder._id, orderForm.status, orderForm.notes);
      toast.success('Order status updated');
      setStatusModalOpen(false);
      fetchOrders();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update status');
    }
  };

  const handleTrackingUpdate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        trackingInfo: {
          carrier: trackingForm.carrier,
          trackingNumber: trackingForm.trackingNumber,
          trackingUrl: trackingForm.trackingUrl || undefined,
          estimatedDelivery: trackingForm.estimatedDelivery ? new Date(trackingForm.estimatedDelivery).toISOString() : undefined,
        }
      };
      await updateOrderTracking(selectedOrder._id, payload);
      toast.success('Tracking details updated successfully');
      setTrackingModalOpen(false);
      fetchOrders();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update tracking info');
    }
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ fontWeight: 800, color: '#1f2937', mb: 3 }}>
        Rewards Store Control
      </Typography>

      <Tabs
        value={activeTab}
        onChange={(e, val) => setActiveTab(val)}
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}
      >
        <Tab label="Products Catalog" />
        <Tab label="Store Orders" />
      </Tabs>

      {/* TAB 0: Products Management */}
      {activeTab === 0 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<CreateIcon size={18} />}
              onClick={handleCreateClick}
              sx={{ textTransform: 'none', borderRadius: 2 }}
            >
              Add Product
            </Button>
          </Box>

          <Paper sx={{ p: 2, borderRadius: 4, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <TableContainer>
              <Table size="medium">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Image</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Product Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Coin Price</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>In Stock</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>KYC Req.</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4, color: '#9ca3af' }}>
                        Loading inventory database...
                      </TableCell>
                    </TableRow>
                  ) : products.length > 0 ? (
                    products.map((p) => (
                      <TableRow key={p._id} hover>
                        <TableCell>
                          <img
                            src={p.images?.[0]?.url || 'https://via.placeholder.com/50'}
                            alt={p.name}
                            style={{ width: '45px', height: '45px', borderRadius: '8px', objectFit: 'cover' }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#1f2937' }}>{p.name}</TableCell>
                        <TableCell sx={{ textTransform: 'capitalize' }}>
                          {p.category?.replace(/_/g, ' ')}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#3b82f6' }}>{p.coinPrice}</TableCell>
                        <TableCell>{p.stock} units</TableCell>
                        <TableCell>
                          <Chip
                            label={p.requiresKyc ? 'KYC Required' : 'No KYC'}
                            size="small"
                            color={p.requiresKyc ? 'warning' : 'default'}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                            <IconButton color="primary" onClick={() => handleEditClick(p)}>
                              <EditIcon size={18} />
                            </IconButton>
                            <IconButton color="error" onClick={() => handleDeleteClick(p._id)}>
                              <DeleteIcon size={18} />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4, color: '#9ca3af' }}>
                        No products inside the catalog.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      )}

      {/* TAB 1: Store Orders */}
      {activeTab === 1 && (
        <Box>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              select
              label="Filter by Status"
              size="small"
              value={orderStatusFilter}
              onChange={(e) => setOrderStatusFilter(e.target.value)}
              sx={{ width: 200 }}
            >
              <MenuItem value="all">All Orders</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="processing">Processing</MenuItem>
              <MenuItem value="shipped">Shipped</MenuItem>
              <MenuItem value="delivered">Delivered</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </TextField>
          </Box>

          <Paper sx={{ p: 2, borderRadius: 4, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <TableContainer>
              <Table size="medium">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Player Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Items Ordered</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Cost</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Shipping Address</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Order Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="center">Manage</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orderLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4, color: '#9ca3af' }}>
                        Loading purchase orders queue...
                      </TableCell>
                    </TableRow>
                  ) : orders.length > 0 ? (
                    orders.map((o) => (
                      <TableRow key={o._id} hover>
                        <TableCell sx={{ fontWeight: 'bold' }}>
                          {o.userId?.name || 'Unknown User'}
                        </TableCell>
                        <TableCell>
                          {o.items?.map((item, idx) => (
                            <div key={idx}>
                              {item.productId?.name || 'Product ID: ' + item.productId} x {item.quantity}
                            </div>
                          ))}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#3b82f6' }}>{o.totalCoins} Coins</TableCell>
                        <TableCell>
                          <Typography variant="body2">{o.shippingAddress?.name} | {o.shippingAddress?.phone}</Typography>
                          <Typography variant="caption" sx={{ color: '#6b7280' }}>
                            {o.shippingAddress?.address?.street}, {o.shippingAddress?.address?.city}, {o.shippingAddress?.address?.state} - {o.shippingAddress?.address?.pincode}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={o.status}
                            size="small"
                            color={
                              o.status === 'delivered'
                                ? 'success'
                                : o.status === 'shipped'
                                ? 'info'
                                : o.status === 'cancelled'
                                ? 'error'
                                : 'warning'
                            }
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => { setSelectedOrder(o); setOrderForm({ status: o.status, notes: '' }); setStatusModalOpen(true); }}
                              startIcon={<OrderIcon size={14} />}
                              sx={{ textTransform: 'none', borderRadius: 2 }}
                            >
                              Status
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => {
                                setSelectedOrder(o);
                                setTrackingForm({
                                  carrier: o.trackingInfo?.carrier || '',
                                  trackingNumber: o.trackingInfo?.trackingNumber || '',
                                  trackingUrl: o.trackingInfo?.trackingUrl || '',
                                  estimatedDelivery: o.trackingInfo?.estimatedDelivery?.split('T')[0] || '',
                                });
                                setTrackingModalOpen(true);
                              }}
                              startIcon={<TrackingIcon size={14} />}
                              sx={{ textTransform: 'none', borderRadius: 2 }}
                            >
                              Track
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4, color: '#9ca3af' }}>
                        No orders recorded matching status.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      )}

      {/* Product Add/Edit Dialog */}
      <Dialog open={productModalOpen} onClose={() => setProductModalOpen(false)} maxWidth="sm" fullWidth>
        <Paper component="form" onSubmit={handleProductSubmit} elevation={0}>
          <DialogTitle sx={{ fontWeight: 'bold' }}>
            {editingProductId ? 'Edit Reward Item' : 'Add Reward Item'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  label="Product Title"
                  fullWidth
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Product Description"
                  fullWidth
                  multiline
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  select
                  label="Category"
                  fullWidth
                  value={productForm.category}
                  onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  required
                >
                  <MenuItem value="gift_cards">Gift Cards</MenuItem>
                  <MenuItem value="mobile_recharge">Mobile Recharge</MenuItem>
                  <MenuItem value="electronics">Electronics</MenuItem>
                  <MenuItem value="clothing">Clothing</MenuItem>
                  <MenuItem value="books">Books</MenuItem>
                  <MenuItem value="home_appliances">Home Appliances</MenuItem>
                  <MenuItem value="sports">Sports</MenuItem>
                  <MenuItem value="toys">Toys</MenuItem>
                  <MenuItem value="beauty">Beauty</MenuItem>
                  <MenuItem value="health">Health</MenuItem>
                  <MenuItem value="food">Food</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Image URL"
                  fullWidth
                  value={productForm.imageUrl}
                  onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Coin Price"
                  type="number"
                  fullWidth
                  value={productForm.coinPrice}
                  onChange={(e) => setProductForm({ ...productForm, coinPrice: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Inventory Stock"
                  type="number"
                  fullWidth
                  value={productForm.stock}
                  onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  SelectProps={{ SelectDisplayProps: { style: { display: 'flex' } } }}
                  label="Requires KYC check?"
                  fullWidth
                  value={productForm.requiresKyc}
                  onChange={(e) => setProductForm({ ...productForm, requiresKyc: e.target.value === 'true' })}
                >
                  <MenuItem value="false">No KYC required</MenuItem>
                  <MenuItem value="true">Must verify KYC to purchase</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setProductModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              Save Item
            </Button>
          </DialogActions>
        </Paper>
      </Dialog>

      {/* Order Status Dialog */}
      <Dialog open={statusModalOpen} onClose={() => setStatusModalOpen(false)}>
        <Paper component="form" onSubmit={handleStatusUpdate} elevation={0}>
          <DialogTitle sx={{ fontWeight: 'bold' }}>Update Order Status</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1, minWidth: 300 }}>
              <Grid item xs={12}>
                <TextField
                  select
                  label="Status"
                  fullWidth
                  value={orderForm.status}
                  onChange={(e) => setOrderForm({ ...orderForm, status: e.target.value })}
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="processing">Processing</MenuItem>
                  <MenuItem value="shipped">Shipped</MenuItem>
                  <MenuItem value="delivered">Delivered</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Status notes / reasons"
                  fullWidth
                  multiline
                  rows={2}
                  value={orderForm.notes}
                  onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setStatusModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              Update Status
            </Button>
          </DialogActions>
        </Paper>
      </Dialog>

      {/* Order Tracking Dialog */}
      <Dialog open={trackingModalOpen} onClose={() => setTrackingModalOpen(false)}>
        <Paper component="form" onSubmit={handleTrackingUpdate} elevation={0}>
          <DialogTitle sx={{ fontWeight: 'bold' }}>Update Shipment Tracking</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1, minWidth: 350 }}>
              <Grid item xs={12}>
                <TextField
                  label="Carrier (e.g. FedEx, BlueDart)"
                  fullWidth
                  value={trackingForm.carrier}
                  onChange={(e) => setTrackingForm({ ...trackingForm, carrier: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Tracking Number"
                  fullWidth
                  value={trackingForm.trackingNumber}
                  onChange={(e) => setTrackingForm({ ...trackingForm, trackingNumber: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Tracking URL"
                  fullWidth
                  value={trackingForm.trackingUrl}
                  onChange={(e) => setTrackingForm({ ...trackingForm, trackingUrl: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Estimated Delivery"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={trackingForm.estimatedDelivery}
                  onChange={(e) => setTrackingForm({ ...trackingForm, estimatedDelivery: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setTrackingModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              Save Details
            </Button>
          </DialogActions>
        </Paper>
      </Dialog>
    </Box>
  );
}
export default AdminRewardStore;
