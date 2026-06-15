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
  const { checkAuth } = useApi();
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
    <div className="flex flex-col gap-6">
      
      {/* Top Tabs */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("catalog")}
            className={`pb-2 text-sm font-extrabold transition-all border-b-2 cursor-pointer ${activeTab === "catalog" ? "border-indigo-500 text-white" : "border-transparent text-slate-450 hover:text-slate-200"}`}
          >
            <span className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" /> Rewards Catalog
            </span>
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-2 text-sm font-extrabold transition-all border-b-2 cursor-pointer ${activeTab === "orders" ? "border-indigo-500 text-white" : "border-transparent text-slate-450 hover:text-slate-200"}`}
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
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div 
                key={product._id} 
                className="bg-slate-800/80 border border-slate-700/50 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-slate-500 transition-all hover:scale-[1.02] group"
              >
                {/* Product Image placeholder */}
                <div className="aspect-video bg-slate-900 flex items-center justify-center relative border-b border-slate-800">
                  {product.images?.[0]?.url ? (
                    <img 
                      src={product.images[0].url} 
                      alt={product.name} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <ShoppingBag className="w-10 h-10 text-slate-700" />
                  )}
                  {product.stock <= 5 && product.stock > 0 && (
                    <span className="absolute top-2 left-2 bg-amber-500/90 text-slate-950 font-bold text-[9px] px-2 py-0.5 rounded-md uppercase">
                      Low Stock
                    </span>
                  )}
                  {product.stock === 0 && (
                    <span className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center font-extrabold text-xs text-rose-450 uppercase tracking-widest">
                      Out of stock
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="p-4 flex flex-col gap-2">
                  <span className="text-[10px] text-indigo-400 uppercase font-extrabold tracking-wider">{product.category}</span>
                  <h4 className="font-extrabold text-slate-200 group-hover:text-white transition-colors line-clamp-1">{product.name}</h4>
                  <p className="text-xs text-slate-450 line-clamp-2 min-h-[32px]">{product.description}</p>
                  
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800">
                    <div className="flex items-center gap-1">
                      <Coins className="w-4 h-4 text-emerald-400" />
                      <span className="font-black text-emerald-400 text-sm">{product.coinPrice}</span>
                      <span className="text-[9px] text-slate-500 font-semibold uppercase">REWARD</span>
                    </div>
                    <span className="text-[10px] text-slate-450 font-bold">{product.stock} left</span>
                  </div>
                </div>

                <div className="px-4 pb-4">
                  <button 
                    onClick={() => handleBuyClick(product)}
                    disabled={product.stock <= 0}
                    className="w-full bg-slate-700 hover:bg-emerald-500 hover:text-slate-950 disabled:opacity-30 text-white font-extrabold text-xs py-2 rounded-xl transition-all cursor-pointer"
                  >
                    Redeem Reward
                  </button>
                </div>
              </div>
            ))}

            {products.length === 0 && (
              <div className="col-span-full text-center py-20 text-slate-500 font-bold text-xs uppercase tracking-wide">
                No active rewards in catalog
              </div>
            )}
          </div>
        )
      ) : (
        ordersLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <div 
                key={order._id} 
                className="bg-slate-800/80 border border-slate-700/50 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-slate-650 transition-colors"
              >
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-200">{order.items?.[0]?.productName || order.items?.[0]?.productId?.name || "Reward Item"}</h4>
                    <p className="text-xs text-slate-450 mt-1">
                      Qty: {order.items?.[0]?.quantity || 1} | Total Price: <span className="font-bold text-emerald-400">{order.totalCoins} Coins</span>
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Order ID: {order._id}</p>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="flex flex-col items-start md:items-end gap-2">
                  {order.status === "pending" ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1 rounded-full uppercase">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Processing
                    </span>
                  ) : order.status === "shipped" ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-450 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full uppercase">
                      <Truck className="w-3.5 h-3.5" /> Shipped
                    </span>
                  ) : order.status === "delivered" ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full uppercase">
                      <CheckCircle className="w-3.5 h-3.5" /> Delivered
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-450 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-full uppercase">
                      <XCircle className="w-3.5 h-3.5" /> {order.status}
                    </span>
                  )}

                  {order.trackingNumber && (
                    <span className="text-xs text-indigo-400 font-bold bg-indigo-500/5 px-2.5 py-1 rounded-lg border border-indigo-500/10 mt-1">
                      Tracking: {order.trackingNumber}
                    </span>
                  )}
                </div>
              </div>
            ))}

            {orders.length === 0 && (
              <div className="text-center py-20 text-slate-500 font-bold text-xs uppercase tracking-wide">
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
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center"
          >
            <div 
              onClick={(e) => e.stopPropagation()} 
              className="bg-slate-850 border border-slate-750 w-[95vw] max-w-lg rounded-3xl p-6 shadow-2xl text-white flex flex-col gap-5 max-h-[90vh] overflow-y-auto"
            >
              <div>
                <h3 className="font-black text-2xl text-slate-100 flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-indigo-400" />
                  Redeem Reward Checkout
                </h3>
                <p className="text-xs text-slate-450 mt-1">
                  You are purchasing <span className="text-indigo-400 font-bold">{selectedProduct.name}</span> for <span className="text-emerald-400 font-bold">{selectedProduct.coinPrice} Reward Coins</span>.
                </p>
              </div>

              <form onSubmit={handlePlaceOrder} className="flex flex-col gap-4">
                
                {/* Shipping Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Name */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
                    <UserIcon className="w-5 h-5 text-slate-500" />
                    <div className="flex-1">
                      <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">Receiver Name</label>
                      <input 
                        type="text" 
                        placeholder="John Doe"
                        value={shippingForm.name}
                        onChange={(e) => setShippingForm(prev => ({ ...prev, name: e.target.value }))}
                        className="bg-transparent text-sm text-white focus:outline-none w-full mt-0.5"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
                    <Phone className="w-5 h-5 text-slate-500" />
                    <div className="flex-1">
                      <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">Contact Phone</label>
                      <input 
                        type="tel" 
                        placeholder="+91 9999999999"
                        value={shippingForm.phone}
                        onChange={(e) => setShippingForm(prev => ({ ...prev, phone: e.target.value }))}
                        className="bg-transparent text-sm text-white focus:outline-none w-full mt-0.5"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Street Address */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-slate-500 mt-0.5" />
                  <div className="flex-1">
                    <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">Street / Apartment Address</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Flat 101, Central Street"
                      value={shippingForm.street}
                      onChange={(e) => setShippingForm(prev => ({ ...prev, street: e.target.value }))}
                      className="bg-transparent text-sm text-white focus:outline-none w-full mt-0.5"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {/* City */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                    <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">City</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Mumbai"
                      value={shippingForm.city}
                      onChange={(e) => setShippingForm(prev => ({ ...prev, city: e.target.value }))}
                      className="bg-transparent text-sm text-white focus:outline-none w-full mt-0.5"
                      required
                    />
                  </div>

                  {/* State */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                    <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">State</label>
                    <input 
                      type="text" 
                      placeholder="e.g. MH"
                      value={shippingForm.state}
                      onChange={(e) => setShippingForm(prev => ({ ...prev, state: e.target.value }))}
                      className="bg-transparent text-sm text-white focus:outline-none w-full mt-0.5"
                      required
                    />
                  </div>

                  {/* Pincode */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                    <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">Pincode</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 400001"
                      value={shippingForm.pincode}
                      onChange={(e) => setShippingForm(prev => ({ ...prev, pincode: e.target.value }))}
                      className="bg-transparent text-sm text-white focus:outline-none w-full mt-0.5"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button 
                    type="button"
                    onClick={() => setSelectedProduct(null)} 
                    className="bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-700/50"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-slate-950 text-xs font-black px-6 py-2.5 rounded-xl flex items-center gap-1.5 shadow-lg shadow-emerald-500/10 cursor-pointer"
                  >
                    {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Confirm & Pay"}
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
