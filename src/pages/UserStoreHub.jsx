import React, { useState, useEffect } from "react";
import { useApi } from "../context/contextApi";
import { toast } from "react-toastify";
import { 
  ShoppingBag, 
  Tag, 
  History, 
  Coins, 
  MapPin, 
  Phone,
  User as UserIcon,
  Loader2,
  CheckCircle,
  Truck,
  PackageCheck,
  XCircle
} from "lucide-react";
import { 
  getAllProductsAPI, 
  createOrderAPI, 
  getUserOrdersAPI 
} from "../services/rewards.service";

function UserStoreHub() {
  const { checkAuth, theme } = useApi();
  const [activeTab, setActiveTab] = useState("catalog"); // catalog, orders
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Buy Dialog State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [shippingForm, setShippingForm] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: ""
  });

  const fetchCatalog = async () => {
    setLoading(true);
    try {
      const res = await getAllProductsAPI(1, 40);
      const productsList = res?.data?.products || res?.products || [];
      setProducts(productsList.filter(p => p.isActive));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await getUserOrdersAPI(1, 20);
      setOrders(res?.data || res?.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  useEffect(() => {
    if (activeTab === "orders") {
      fetchOrders();
    }
  }, [activeTab]);

  const handleBuyClick = (product) => {
    if (product.stock <= 0) {
      toast.error("This item is currently out of stock!");
      return;
    }
    setSelectedProduct(product);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!shippingForm.name || !shippingForm.phone || !shippingForm.street || !shippingForm.city || !shippingForm.state || !shippingForm.pincode) {
      toast.error("Please fill in all shipping fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await createOrderAPI({
        items: [{ productId: selectedProduct._id, quantity: 1 }],
        shippingAddress: {
          name: shippingForm.name,
          phone: shippingForm.phone,
          address: {
            street: shippingForm.street,
            city: shippingForm.city,
            state: shippingForm.state,
            pincode: shippingForm.pincode,
            country: "India"
          }
        }
      });

      if (res?.success) {
        toast.success("Order placed successfully! 🎁");
        setSelectedProduct(null);
        setShippingForm({ name: "", phone: "", street: "", city: "", state: "", pincode: "" });
        fetchCatalog();
        checkAuth();
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Order placement failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      
      {/* Top Tabs */}
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-px text-left">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab("catalog")}
            className={`pb-3 text-sm font-extrabold transition-all border-b-2 cursor-pointer ${activeTab === "catalog" ? "border-primary text-primary" : "border-transparent text-slate-450 hover:text-slate-700 dark:hover:text-slate-200"}`}
          >
            <span className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" /> Rewards Catalog
            </span>
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-3 text-sm font-extrabold transition-all border-b-2 cursor-pointer ${activeTab === "orders" ? "border-primary text-primary" : "border-transparent text-slate-450 hover:text-slate-700 dark:hover:text-slate-200"}`}
          >
            <span className="flex items-center gap-2">
              <History className="w-4 h-4" /> My Orders
            </span>
          </button>
        </div>
      </div>

      {/* View Switch */}
      {activeTab === "catalog" ? (
        loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div 
                key={product._id} 
                className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all duration-300 group"
              >
                {/* Product Image Panel */}
                <div className="aspect-video bg-slate-50 dark:bg-slate-950 flex items-center justify-center relative border-b border-slate-100 dark:border-slate-800/50">
                  {product.images?.[0]?.url ? (
                    <img 
                      src={product.images[0].url} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <ShoppingBag className="w-8 h-8 text-slate-350 dark:text-slate-600" />
                  )}
                  {product.stock <= 5 && product.stock > 0 && (
                    <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 font-bold text-[9px] px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                      Low Stock
                    </span>
                  )}
                  {product.stock === 0 && (
                    <span className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center font-extrabold text-xs text-rose-400 uppercase tracking-widest">
                      Out of stock
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="p-5 flex flex-col gap-2 text-left">
                  <span className="text-[10px] text-primary dark:text-indigo-400 uppercase font-extrabold tracking-wider">{product.category}</span>
                  <h4 className="font-extrabold text-slate-800 dark:text-slate-100 line-clamp-1 group-hover:text-primary dark:group-hover:text-white transition-colors">{product.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 min-h-[32px] mt-1 leading-relaxed">{product.description}</p>
                  
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/50">
                    <div className="flex items-center gap-1.5">
                      <Coins className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                      <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">{product.coinPrice}</span>
                      <span className="text-[9px] text-slate-400 font-bold uppercase">REWARD</span>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-455 dark:text-slate-500">{product.stock} left</span>
                  </div>
                </div>

                <div className="px-5 pb-5">
                  <button 
                    onClick={() => handleBuyClick(product)}
                    disabled={product.stock <= 0}
                    className="w-full bg-slate-100 hover:bg-emerald-550 hover:text-slate-900 dark:bg-slate-800 dark:hover:bg-emerald-500 dark:hover:text-slate-950 disabled:opacity-30 text-slate-700 dark:text-slate-200 font-extrabold text-xs py-2.5 rounded-xl transition-all cursor-pointer border border-transparent"
                  >
                    Redeem Reward
                  </button>
                </div>
              </div>
            ))}

            {products.length === 0 && (
              <div className="col-span-full text-center py-20 text-slate-450 font-bold text-xs uppercase tracking-wide">
                No active rewards in catalog
              </div>
            )}
          </div>
        )
      ) : (
        ordersLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col gap-4 text-left">
            {orders.map((order) => (
              <div 
                key={order._id} 
                className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xs"
              >
                <div className="flex gap-4 items-start">
                  <div className="w-11 h-11 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-center text-slate-400">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-805 dark:text-slate-200">{order.items?.[0]?.productName || order.items?.[0]?.productId?.name || "Reward Item"}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Qty: {order.items?.[0]?.quantity || 1} | Price Paid: <span className="font-bold text-emerald-555">{order.totalCoins} Reward Coins</span>
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">Order ID: {order._id}</p>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="flex flex-col items-start md:items-end gap-2.5">
                  {order.status === "pending" ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full uppercase">
                      <Loader2 className="w-3 h-3 animate-spin" /> Processing
                    </span>
                  ) : order.status === "shipped" ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-550 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full uppercase">
                      <Truck className="w-3.5 h-3.5" /> Shipped
                    </span>
                  ) : order.status === "delivered" ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full uppercase">
                      <CheckCircle className="w-3.5 h-3.5" /> Delivered
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-500 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-full uppercase">
                      <XCircle className="w-3.5 h-3.5" /> {order.status}
                    </span>
                  )}

                  {order.trackingNumber && (
                    <span className="text-xs text-primary dark:text-indigo-400 font-bold bg-primary/5 px-2.5 py-1 rounded-lg border border-primary/10 mt-1">
                      Tracking ID: {order.trackingNumber}
                    </span>
                  )}
                </div>
              </div>
            ))}

            {orders.length === 0 && (
              <div className="text-center py-20 text-slate-450 font-bold text-xs uppercase tracking-wide">
                No orders placed yet
              </div>
            )}
          </div>
        )
      )}

      {/* Checkout Shipping Modal */}
      {selectedProduct && (
        <>
          <div 
            onClick={() => setSelectedProduct(null)} 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          >
            <div 
              onClick={(e) => e.stopPropagation()} 
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl text-slate-800 dark:text-slate-100 flex flex-col gap-6 text-left max-h-[90vh] overflow-y-auto"
            >
              <div>
                <h3 className="font-black text-xl text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Redemption Checkout
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  You are purchasing <span className="text-primary font-bold">{selectedProduct.name}</span> for <span className="text-emerald-600 dark:text-emerald-400 font-black">{selectedProduct.coinPrice} Reward Coins</span>.
                </p>
              </div>

              <form onSubmit={handlePlaceOrder} className="flex flex-col gap-4">
                
                {/* Shipping Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Name */}
                  <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-805 rounded-xl p-4 flex items-center gap-3">
                    <UserIcon className="w-4.5 h-4.5 text-slate-400" />
                    <div className="flex-1">
                      <label htmlFor="receiverName" className="block text-[9px] uppercase font-bold text-slate-450 dark:text-slate-500 tracking-wider">Receiver Name</label>
                      <input 
                        type="text" 
                        id="receiverName"
                        placeholder="John Doe"
                        value={shippingForm.name}
                        onChange={(e) => setShippingForm(prev => ({ ...prev, name: e.target.value }))}
                        className="bg-transparent text-sm text-slate-800 dark:text-slate-100 focus:outline-none w-full mt-0.5"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-805 rounded-xl p-4 flex items-center gap-3">
                    <Phone className="w-4.5 h-4.5 text-slate-400" />
                    <div className="flex-1">
                      <label htmlFor="contactPhone" className="block text-[9px] uppercase font-bold text-slate-450 dark:text-slate-500 tracking-wider">Contact Phone</label>
                      <input 
                        type="tel" 
                        id="contactPhone"
                        placeholder="e.g. +91 9876543210"
                        value={shippingForm.phone}
                        onChange={(e) => setShippingForm(prev => ({ ...prev, phone: e.target.value }))}
                        className="bg-transparent text-sm text-slate-800 dark:text-slate-100 focus:outline-none w-full mt-0.5"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Street Address */}
                <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-805 rounded-xl p-4 flex items-start gap-3">
                  <MapPin className="w-4.5 h-4.5 text-slate-400 mt-1" />
                  <div className="flex-1">
                    <label htmlFor="streetAddress" className="block text-[9px] uppercase font-bold text-slate-450 dark:text-slate-500 tracking-wider">Street / Apartment Address</label>
                    <input 
                      type="text" 
                      id="streetAddress"
                      placeholder="e.g. Flat 104, Sunrise Residency"
                      value={shippingForm.street}
                      onChange={(e) => setShippingForm(prev => ({ ...prev, street: e.target.value }))}
                      className="bg-transparent text-sm text-slate-800 dark:text-slate-100 focus:outline-none w-full mt-0.5"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {/* City */}
                  <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-805 rounded-xl p-4">
                    <label htmlFor="city" className="block text-[9px] uppercase font-bold text-slate-450 dark:text-slate-500 tracking-wider">City</label>
                    <input 
                      type="text" 
                      id="city"
                      placeholder="e.g. Pune"
                      value={shippingForm.city}
                      onChange={(e) => setShippingForm(prev => ({ ...prev, city: e.target.value }))}
                      className="bg-transparent text-sm text-slate-800 dark:text-slate-100 focus:outline-none w-full mt-0.5"
                      required
                    />
                  </div>

                  {/* State */}
                  <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-805 rounded-xl p-4">
                    <label htmlFor="state" className="block text-[9px] uppercase font-bold text-slate-450 dark:text-slate-500 tracking-wider">State</label>
                    <input 
                      type="text" 
                      id="state"
                      placeholder="e.g. MH"
                      value={shippingForm.state}
                      onChange={(e) => setShippingForm(prev => ({ ...prev, state: e.target.value }))}
                      className="bg-transparent text-sm text-slate-800 dark:text-slate-100 focus:outline-none w-full mt-0.5"
                      required
                    />
                  </div>

                  {/* Pincode */}
                  <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-805 rounded-xl p-4">
                    <label htmlFor="pincode" className="block text-[9px] uppercase font-bold text-slate-450 dark:text-slate-500 tracking-wider">Pincode</label>
                    <input 
                      type="text" 
                      id="pincode"
                      placeholder="e.g. 411001"
                      value={shippingForm.pincode}
                      onChange={(e) => setShippingForm(prev => ({ ...prev, pincode: e.target.value }))}
                      className="bg-transparent text-sm text-slate-800 dark:text-slate-100 focus:outline-none w-full mt-0.5"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button 
                    type="button"
                    onClick={() => setSelectedProduct(null)} 
                    className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="bg-emerald-555 hover:bg-emerald-600 disabled:opacity-40 text-slate-900 text-xs font-bold px-6 py-2.5 rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Confirm Order"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default UserStoreHub;
