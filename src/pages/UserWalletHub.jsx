import React, { useState, useEffect } from "react";
import { useApi } from "../context/contextApi";
import { toast } from "react-toastify";
import { 
  Wallet, 
  Coins, 
  ArrowRightLeft, 
  ArrowDownToLine, 
  Receipt,
  Loader2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  PiggyBank
} from "lucide-react";
import { 
  getWalletBalanceAPI, 
  getTransactionHistoryAPI, 
  convertCoinsAPI, 
  requestWithdrawalAPI 
} from "../services/wallet.service";

function UserWalletHub() {
  const { checkAuth, theme } = useApi();
  const [balances, setBalances] = useState({ adCoins: 0, rewardCoins: 0, pendingAdCoins: 0, totalEarnings: 0 });
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  
  const [loading, setLoading] = useState(false);
  const [ledgerLoading, setLedgerLoading] = useState(false);

  // Conversion state
  const [convertAmount, setConvertAmount] = useState("");
  const [conversionPreview, setConversionPreview] = useState(0);

  // Withdrawal state
  const [withdrawMethod, setWithdrawMethod] = useState("upi");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [upiId, setUpiId] = useState("");
  const [bankDetails, setBankDetails] = useState({ accountNumber: "", ifscCode: "", accountHolderName: "" });

  const loadData = async () => {
    try {
      const bal = await getWalletBalanceAPI();
      setBalances(bal);
    } catch (err) {
      console.error(err);
    }
  };

  const loadTransactions = async (pageNo = 1) => {
    setLedgerLoading(true);
    try {
      const res = await getTransactionHistoryAPI(pageNo, pagination.limit);
      if (res?.transactions) {
        setTransactions(res.transactions);
        if (res.pagination) setPagination(res.pagination);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLedgerLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    loadTransactions(1);
  }, []);

  // Update conversion preview dynamically
  useEffect(() => {
    const amt = parseInt(convertAmount) || 0;
    setConversionPreview(Math.floor(amt * 0.1)); // 10:1 rate
  }, [convertAmount]);

  const handleConvert = async (e) => {
    e.preventDefault();
    const amt = parseInt(convertAmount);
    if (isNaN(amt) || amt <= 0) {
      toast.error("Please enter a valid amount to convert.");
      return;
    }
    if (amt > balances.adCoins) {
      toast.error("Insufficient Ad Coins balance.");
      return;
    }

    setLoading(true);
    try {
      const res = await convertCoinsAPI({ adCoinsToConvert: amt });
      if (res?.success) {
        toast.success(`Successfully converted ${amt} Ad Coins!`);
        setConvertAmount("");
        loadData();
        loadTransactions(1);
        checkAuth();
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Conversion failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawal = async (e) => {
    e.preventDefault();
    const amt = parseFloat(withdrawAmount);
    if (isNaN(amt) || amt <= 0) {
      toast.error("Please enter a valid withdrawal amount.");
      return;
    }
    if (amt > balances.rewardCoins) {
      toast.error("Insufficient Reward Coins balance.");
      return;
    }

    if (withdrawMethod === "upi" && !upiId) {
      toast.error("Please enter a valid UPI ID.");
      return;
    }
    if (withdrawMethod === "bank" && (!bankDetails.accountNumber || !bankDetails.ifscCode || !bankDetails.accountHolderName)) {
      toast.error("Please fill in all bank details.");
      return;
    }

    setLoading(true);
    try {
      const res = await requestWithdrawalAPI({
        amount: amt,
        method: withdrawMethod,
        upiId: withdrawMethod === "upi" ? upiId : undefined,
        bankDetails: withdrawMethod === "bank" ? bankDetails : undefined
      });

      if (res?.success) {
        toast.success("Withdrawal request submitted successfully!");
        setWithdrawAmount("");
        setUpiId("");
        setBankDetails({ accountNumber: "", ifscCode: "", accountHolderName: "" });
        loadData();
        loadTransactions(1);
        checkAuth();
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Withdrawal request failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      
      {/* Balances Widgets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Ad Coins Balance */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-5 flex items-center justify-between shadow-xs">
          <div className="text-left">
            <span className="text-[10px] uppercase font-bold text-amber-500 tracking-wider">Ad Coins</span>
            <h3 className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">{balances.adCoins}</h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-400 mt-1">Earned watching ads</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
            <Coins className="w-5 h-5" />
          </div>
        </div>

        {/* Pending Ad Coins */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-5 flex items-center justify-between shadow-xs">
          <div className="text-left">
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-450 tracking-wider">Pending Coins</span>
            <h3 className="text-2xl font-black text-slate-500 dark:text-slate-300 mt-1">{balances.pendingAdCoins}</h3>
            <p className="text-[10px] text-slate-405 dark:text-slate-400 mt-1">Undergoing audit</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
            <HelpCircle className="w-5 h-5" />
          </div>
        </div>

        {/* Reward Coins Balance */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-5 flex items-center justify-between shadow-xs">
          <div className="text-left">
            <span className="text-[10px] uppercase font-bold text-emerald-555 tracking-wider">Reward Coins</span>
            <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{balances.rewardCoins}</h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-400 mt-1">Ready to cashout</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-550">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        {/* Total Earnings */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-5 flex items-center justify-between shadow-xs">
          <div className="text-left">
            <span className="text-[10px] uppercase font-bold text-purple-500 tracking-wider">Total Earnings</span>
            <h3 className="text-2xl font-black text-purple-650 dark:text-purple-400 mt-1">{balances.totalEarnings}</h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-400 mt-1">Lifetime rewards</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
            <PiggyBank className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Grid Layout: Convert & Cashout columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Coin Conversion Station */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 flex flex-col gap-6 shadow-xs text-left">
          <h2 className="font-extrabold text-lg tracking-wide flex items-center gap-2 text-slate-800 dark:text-slate-100">
            <ArrowRightLeft className="w-5 h-5 text-amber-500" />
            Conversion Station
          </h2>

          <form onSubmit={handleConvert} className="flex flex-col gap-4">
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-805 rounded-2xl p-4 flex flex-col gap-1.5">
              <label htmlFor="convertAmount" className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Convert Ad Coins
              </label>
              <div className="flex items-center justify-between gap-4">
                <input 
                  type="number"
                  name="convertAmount"
                  id="convertAmount"
                  placeholder="e.g. 500"
                  value={convertAmount}
                  onChange={(e) => setConvertAmount(e.target.value)}
                  className="bg-transparent text-xl font-bold text-slate-850 dark:text-slate-100 focus:outline-none w-full"
                />
                <span className="text-xs font-bold text-amber-500 uppercase">AD</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 py-1 text-slate-500 dark:text-slate-400 text-xs text-center leading-relaxed">
              <span>💱 Conversion Rate: 10 Ad Coins = 1 Reward Coin</span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-4 flex justify-between items-center">
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">You Will Receive</span>
                <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{conversionPreview}</h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
                REWARD
              </span>
            </div>

            <button 
              type="submit"
              disabled={loading || !convertAmount}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-slate-900 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-sm shadow-xs"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Convert Coins"}
            </button>
          </form>
        </div>

        {/* Withdrawal Request */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 flex flex-col gap-6 shadow-xs text-left">
          <h2 className="font-extrabold text-lg tracking-wide flex items-center gap-2 text-slate-800 dark:text-slate-100">
            <ArrowDownToLine className="w-5 h-5 text-emerald-555" />
            Withdrawal Request
          </h2>

          <div className="flex gap-2 p-1 bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl">
            {["upi", "bank"].map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => setWithdrawMethod(method)}
                className={`w-full py-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${withdrawMethod === method ? "bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-xs" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}
              >
                {method.toUpperCase()}
              </button>
            ))}
          </div>

          <form onSubmit={handleWithdrawal} className="flex flex-col gap-4">
            {/* Amount */}
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-805 rounded-2xl p-4 flex flex-col gap-1.5">
              <label htmlFor="withdrawAmount" className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Withdrawal Amount
              </label>
              <div className="flex items-center justify-between gap-4">
                <input 
                  type="number"
                  name="withdrawAmount"
                  id="withdrawAmount"
                  placeholder="e.g. 100"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="bg-transparent text-xl font-bold text-slate-850 dark:text-slate-100 focus:outline-none w-full"
                />
                <span className="text-xs font-bold text-emerald-550 uppercase">REWARD</span>
              </div>
            </div>

            {withdrawMethod === "upi" ? (
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-805 rounded-2xl p-4 flex flex-col gap-1.5">
                <label htmlFor="upiId" className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  UPI ID / Virtual Payment Address
                </label>
                <input 
                  type="text"
                  name="upiId"
                  id="upiId"
                  placeholder="e.g. username@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="bg-transparent text-sm text-slate-800 dark:text-slate-100 focus:outline-none w-full"
                />
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-805 rounded-2xl p-4 flex flex-col gap-1.5">
                  <label htmlFor="bankAccountNumber" className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Bank Account Number
                  </label>
                  <input 
                    type="text"
                    id="bankAccountNumber"
                    placeholder="Enter Account Number"
                    value={bankDetails.accountNumber}
                    onChange={(e) => setBankDetails(prev => ({ ...prev, accountNumber: e.target.value }))}
                    className="bg-transparent text-sm text-slate-800 dark:text-slate-100 focus:outline-none w-full"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-805 rounded-2xl p-4 flex flex-col gap-1.5">
                    <label htmlFor="bankIfsc" className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      IFSC Code
                    </label>
                    <input 
                      type="text"
                      id="bankIfsc"
                      placeholder="e.g. HDFC0000240"
                      value={bankDetails.ifscCode}
                      onChange={(e) => setBankDetails(prev => ({ ...prev, ifscCode: e.target.value }))}
                      className="bg-transparent text-sm text-slate-800 dark:text-slate-100 focus:outline-none w-full"
                    />
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-805 rounded-2xl p-4 flex flex-col gap-1.5">
                    <label htmlFor="bankHolderName" className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Account Holder Name
                    </label>
                    <input 
                      type="text"
                      id="bankHolderName"
                      placeholder="e.g. John Doe"
                      value={bankDetails.accountHolderName}
                      onChange={(e) => setBankDetails(prev => ({ ...prev, accountHolderName: e.target.value }))}
                      className="bg-transparent text-sm text-slate-800 dark:text-slate-100 focus:outline-none w-full"
                    />
                  </div>
                </div>
              </div>
            )}

            <button 
              type="submit"
              disabled={loading || !withdrawAmount}
              className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-slate-900 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-sm shadow-xs"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Request Payout"}
            </button>
          </form>
        </div>
      </div>

      {/* Transaction History Log */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 flex flex-col gap-6 shadow-xs text-left">
        <h2 className="font-extrabold text-lg tracking-wide flex items-center gap-2.5 text-slate-800 dark:text-slate-100">
          <Receipt className="w-5 h-5 text-primary" />
          Transactions Log
        </h2>

        {ledgerLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-450 dark:text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-4 text-left">Type</th>
                  <th className="py-4 px-4 text-left">Amount</th>
                  <th className="py-4 px-4 text-left">Currency</th>
                  <th className="py-4 px-4 text-left">Date</th>
                  <th className="py-4 px-4 text-left">Description</th>
                  <th className="py-4 px-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-slate-700 dark:text-slate-200 text-sm">
                {transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="py-4 px-4 capitalize font-semibold text-xs tracking-wide">{tx.type?.replace("_", " ")}</td>
                    <td className={`py-4 px-4 font-extrabold ${tx.amount < 0 ? "text-rose-500" : "text-emerald-555"}`}>
                      {tx.amount < 0 ? "" : "+"}{tx.amount}
                    </td>
                    <td className="py-4 px-4 uppercase text-[10px] font-bold text-slate-450 dark:text-slate-500">{tx.currency}</td>
                    <td className="py-4 px-4 text-xs text-slate-400">
                      {new Date(tx.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="py-4 px-4 text-slate-500 dark:text-slate-400 text-xs max-w-xs truncate">{tx.description}</td>
                    <td className="py-4 px-4">
                      {tx.status === "completed" ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-650 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-full uppercase">
                          <CheckCircle2 className="w-3 h-3" /> Completed
                        </span>
                      ) : tx.status === "pending" ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-full uppercase">
                          <Loader2 className="w-3 h-3 animate-spin" /> Pending
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-500 bg-rose-500/10 border border-rose-500/20 px-2 py-1 rounded-full uppercase">
                          <XCircle className="w-3 h-3" /> {tx.status || "Failed"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}

                {transactions.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-405 font-bold text-xs uppercase tracking-wide">
                      No transactions recorded
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination controls */}
        {pagination.pages > 1 && (
          <div className="flex justify-between items-center border-t border-slate-200 dark:border-slate-800 pt-4 mt-2">
            <button
              onClick={() => loadTransactions(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="px-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 disabled:opacity-40 transition-all cursor-pointer"
            >
              Previous
            </button>
            <span className="text-xs text-slate-405 dark:text-slate-400">
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              onClick={() => loadTransactions(pagination.page + 1)}
              disabled={pagination.page >= pagination.pages}
              className="px-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 disabled:opacity-40 transition-all cursor-pointer"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserWalletHub;
