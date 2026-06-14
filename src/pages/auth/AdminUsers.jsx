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
  TextField,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Grid,
  Card,
  CardContent,
  Tab,
  Tabs,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  ShieldAlert as SuspendIcon,
  UserCheck as VerifyIcon,
  Coins as BalanceIcon,
  Activity as HistoryIcon,
} from 'lucide-react';
import { getAdminUsers, getAdminUserDetails, updateAdminUser } from '../../services/admin.service';
import { toast } from 'react-toastify';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  
  // Selected user for details modal
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsTab, setDetailsTab] = useState(0);

  // Forms for updating user
  const [suspendReason, setSuspendReason] = useState('');
  const [balanceAdjustment, setBalanceAdjustment] = useState({ amount: '', reason: '' });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAdminUsers(page, 15);
      setUsers(data.users || []);
      setPagination(data.pagination || { page: 1, pages: 1, total: 0 });
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch players list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleOpenDetails = async (userId) => {
    try {
      const data = await getAdminUserDetails(userId);
      setUserDetails(data);
      setSelectedUserId(userId);
      setDetailsOpen(true);
      setDetailsTab(0);
      setSuspendReason('');
      setBalanceAdjustment({ amount: '', reason: '' });
    } catch (error) {
      console.error(error);
      toast.error('Failed to load user details');
    }
  };

  const handleUserAction = async (action, updates = {}) => {
    try {
      const payload = { action, ...updates };
      const res = await updateAdminUser(selectedUserId, payload);
      if (res.success) {
        toast.success(`User updated successfully (${action})`);
        // Refresh details
        const freshDetails = await getAdminUserDetails(selectedUserId);
        setUserDetails(freshDetails);
        fetchUsers();
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update user status');
    }
  };

  const handleAdjustBalance = async (e) => {
    e.preventDefault();
    if (!balanceAdjustment.amount || isNaN(balanceAdjustment.amount)) {
      toast.warn('Please enter a valid amount');
      return;
    }
    await handleUserAction('update_balance', {
      currency: 'rewardCoins',
      amount: parseInt(balanceAdjustment.amount),
      reason: balanceAdjustment.reason || 'Admin balance adjustment'
    });
    setBalanceAdjustment({ amount: '', reason: '' });
  };

  const isUserSuspended = (user) => {
    return user?.fraudFlags?.some(flag => flag.flagged) || false;
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ fontWeight: 800, color: '#1f2937', mb: 3 }}>
        Players Directory
      </Typography>

      <Paper sx={{ p: 2, borderRadius: 4, mb: 4, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <TableContainer>
          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Player</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Phone</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Ad Coins</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Reward Coins</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>KYC Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Account Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4, color: '#9ca3af' }}>
                    Loading players database...
                  </TableCell>
                </TableRow>
              ) : users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user._id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'semibold', color: '#1f2937' }}>
                          {user.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#6b7280' }}>
                          {user.email || 'No email registered'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#4b5563' }}>{user.adCoins}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#10b981' }}>{user.rewardCoins}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.role}
                        size="small"
                        color={user.role === 'superadmin' ? 'secondary' : 'default'}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.kycStatus || 'pending'}
                        size="small"
                        color={
                          user.kycStatus === 'verified'
                            ? 'success'
                            : user.kycStatus === 'rejected'
                            ? 'error'
                            : 'warning'
                        }
                      />
                    </TableCell>
                    <TableCell>
                      {isUserSuspended(user) ? (
                        <Chip label="Suspended" color="error" size="small" />
                      ) : (
                        <Chip label="Active" color="success" size="small" variant="outlined" />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleOpenDetails(user._id)}
                        sx={{ textTransform: 'none', borderRadius: 2 }}
                      >
                        Manage Player
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4, color: '#9ca3af' }}>
                    No players registered.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={pagination.pages}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
          />
        </Box>
      </Paper>

      {/* Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4 } }}
      >
        {userDetails && (
          <>
            <DialogTitle sx={{ fontWeight: 'bold', color: '#1f2937', pb: 1 }}>
              Player Management - {userDetails.user.name}
            </DialogTitle>
            <DialogContent dividers>
              <Tabs
                value={detailsTab}
                onChange={(e, val) => setDetailsTab(val)}
                sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
              >
                <Tab label="Profile & Stats" />
                <Tab label="Administrative Actions" />
                <Tab label="Games History" />
                <Tab label="Wallet Ledger" />
              </Tabs>

              {/* TAB 0: Profile Details & Statistics */}
              {detailsTab === 0 && (
                <Box>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Card variant="outlined" sx={{ borderRadius: 3, p: 1 }}>
                        <CardContent>
                          <Typography variant="subtitle2" color="text.secondary">Balances</Typography>
                          <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 1 }}>
                            Ad Coins: <span className="text-gray-700">{userDetails.user.adCoins}</span>
                          </Typography>
                          <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 1 }}>
                            Reward Coins: <span className="text-emerald-500">{userDetails.user.rewardCoins}</span>
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1, color: '#6b7280' }}>
                            Pending Ad Coins: {userDetails.user.pendingAdCoins}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#6b7280' }}>
                            Lifetime Earnings: {userDetails.user.totalEarnings}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#6b7280' }}>
                            Total Withdrawn: {userDetails.user.totalWithdrawn}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Card variant="outlined" sx={{ borderRadius: 3, p: 1 }}>
                        <CardContent>
                          <Typography variant="subtitle2" color="text.secondary">Game Performance</Typography>
                          <Typography variant="body2" sx={{ mt: 2, fontWeight: 'medium' }}>
                            Games Played: {userDetails.user.totalGamesPlayed || 0}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#10b981' }}>
                            Wins: {userDetails.user.totalWins || 0}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#ef4444' }}>
                            Losses: {userDetails.user.totalLosses || 0}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#3b82f6' }}>
                            Highest Score: {userDetails.user.highestScore || 0}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#8b5cf6' }}>
                            Skill Score: {userDetails.user.skillScore || 0}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 4 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Ad Integration Performance
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={3}>
                      <Grid item xs={4}>
                        <Paper align="center" sx={{ p: 2, bg: '#f9fafb' }}>
                          <Typography variant="caption" color="text.secondary">Total Ads Watched</Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{userDetails.adStats.totalAds}</Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={4}>
                        <Paper align="center" sx={{ p: 2, bg: '#f9fafb' }}>
                          <Typography variant="caption" color="text.secondary">Completed Ads</Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#10b981' }}>{userDetails.adStats.completedAds}</Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={4}>
                        <Paper align="center" sx={{ p: 2, bg: '#f9fafb' }}>
                          <Typography variant="caption" color="text.secondary">Est. Ad Revenue</Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#3b82f6' }}>${parseFloat(userDetails.adStats.totalRevenue).toFixed(3)}</Typography>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              )}

              {/* TAB 1: Administrative Controls */}
              {detailsTab === 1 && (
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Account Status and Integrity Checks
                  </Typography>
                  <Grid container spacing={4} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6}>
                      <Paper sx={{ p: 3, bg: '#fff5f5' }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <SuspendIcon size={18} className="text-red-500" /> Account Security Controls
                        </Typography>
                        {isUserSuspended(userDetails.user) ? (
                          <Button
                            variant="contained"
                            color="success"
                            onClick={() => handleUserAction('unsuspend')}
                            sx={{ mt: 1, textTransform: 'none' }}
                          >
                            Unsuspend Player
                          </Button>
                        ) : (
                          <Box>
                            <TextField
                              label="Reason for suspension"
                              size="small"
                              fullWidth
                              value={suspendReason}
                              onChange={(e) => setSuspendReason(e.target.value)}
                              sx={{ mt: 1, mb: 1.5 }}
                            />
                            <Button
                              variant="contained"
                              color="error"
                              onClick={() => handleUserAction('suspend', { reason: suspendReason })}
                              sx={{ textTransform: 'none' }}
                            >
                              Suspend Player
                            </Button>
                          </Box>
                        )}
                      </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Paper sx={{ p: 3, bg: '#f0fdf4' }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <VerifyIcon size={18} className="text-green-500" /> KYC Verification Control
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#4b5563', display: 'block', mb: 1.5 }}>
                          PAN Number: {userDetails.user.kycDetails?.panNumber || 'N/A'}<br />
                          Aadhaar Number: {userDetails.user.kycDetails?.aadhaarNumber || 'N/A'}
                        </Typography>
                        {userDetails.user.kycStatus !== 'verified' ? (
                          <Button
                            variant="contained"
                            color="success"
                            onClick={() => handleUserAction('verify')}
                            sx={{ textTransform: 'none' }}
                          >
                            Approve KYC Verification
                          </Button>
                        ) : (
                          <Typography variant="body2" sx={{ color: '#16a34a', fontWeight: 'bold' }}>
                            ✓ Player KYC is Verified
                          </Typography>
                        )}
                      </Paper>
                    </Grid>
                  </Grid>

                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Adjust Balances
                  </Typography>
                  <Paper component="form" onSubmit={handleAdjustBalance} sx={{ p: 3 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={3}>
                        <TextField
                          label="Coins Amount"
                          type="number"
                          size="small"
                          fullWidth
                          value={balanceAdjustment.amount}
                          onChange={(e) => setBalanceAdjustment({ ...balanceAdjustment, amount: e.target.value })}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Adjustment Reason"
                          size="small"
                          fullWidth
                          value={balanceAdjustment.reason}
                          onChange={(e) => setBalanceAdjustment({ ...balanceAdjustment, reason: e.target.value })}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Button
                          variant="contained"
                          type="submit"
                          color="warning"
                          fullWidth
                          startIcon={<BalanceIcon size={16} />}
                          sx={{ textTransform: 'none' }}
                        >
                          Credit Coins
                        </Button>
                      </Grid>
                    </Grid>
                  </Paper>
                </Box>
              )}

              {/* TAB 2: Games History */}
              {detailsTab === 2 && (
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Recent Single/Multiplayer Games
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Game Type</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Opponent</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Winner</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Coins Stake</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                          </TableRow>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {userDetails.games?.length > 0 ? (
                          userDetails.games.map((g, i) => (
                            <TableRow key={i}>
                              <TableCell sx={{ textTransform: 'capitalize' }}>{g.gameType}</TableCell>
                              <TableCell>{g.opponentId ? 'Opponent ID: ' + g.opponentId : 'Practice AI'}</TableCell>
                              <TableCell>{g.winnerId === userDetails.user._id ? 'Player Won' : g.winnerId ? 'Opponent Won' : 'Draw'}</TableCell>
                              <TableCell>{g.coinsStaked}</TableCell>
                              <TableCell>{g.status}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} align="center" sx={{ py: 3, color: '#9ca3af' }}>
                              No recent matches found.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              {/* TAB 3: Wallet Transactions History */}
              {detailsTab === 3 && (
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Recent Wallet Ledger Transactions
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Currency</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {userDetails.transactions?.length > 0 ? (
                          userDetails.transactions.map((tx, i) => (
                            <TableRow key={i}>
                              <TableCell sx={{ textTransform: 'capitalize' }}>{tx.type?.replace(/_/g, ' ')}</TableCell>
                              <TableCell sx={{ fontWeight: 'bold', color: tx.amount > 0 ? '#10b981' : '#ef4444' }}>
                                {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                              </TableCell>
                              <TableCell>{tx.currency}</TableCell>
                              <TableCell>{tx.description}</TableCell>
                              <TableCell>{tx.status}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} align="center" sx={{ py: 3, color: '#9ca3af' }}>
                              No transactions recorded in the ledger yet.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailsOpen(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}

export default AdminUsers;
