import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Chip,
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  Users as UsersIcon,
  Tv as AdIcon,
  Trophy as TournamentIcon,
  TrendingUp as GrowthIcon,
  DollarSign as RevenueIcon,
  Activity as ActiveIcon,
  AlertCircle as PendingIcon,
} from 'lucide-react';
import { getAnalytics } from '../../services/admin.service';
import { toast } from 'react-toastify';

function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getAnalytics();
        setAnalytics(data);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load dashboard analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>Loading Analytics...</Typography>
        <LinearProgress color="primary" />
      </Box>
    );
  }

  const { users, ads, games, tournaments, transactions, orders, topUsers } = analytics || {
    users: { total: 0, verified: 0, newToday: 0, growthRate: 0 },
    ads: { total: 0, completed: 0, completionRate: 0, totalRevenue: 0, revenueByNetwork: [] },
    games: { total: 0, today: 0 },
    tournaments: { total: 0, active: 0 },
    transactions: { total: 0, pendingWithdrawals: 0 },
    orders: { total: 0, pending: 0 },
    topUsers: []
  };

  const statCards = [
    {
      title: 'Total Players',
      value: users.total,
      subtitle: `${users.verified} Verified | +${users.newToday} Today`,
      icon: <UsersIcon size={24} />,
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      title: 'Ad Revenue (Est.)',
      value: `$${parseFloat(ads.totalRevenue).toFixed(2)}`,
      subtitle: `${ads.completed} Completed | ${ads.completionRate}% Rate`,
      icon: <RevenueIcon size={24} />,
      color: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    },
    {
      title: 'Games Played',
      value: games.total,
      subtitle: `+${games.today} Matches Today`,
      icon: <ActiveIcon size={24} />,
      color: 'linear-gradient(135deg, #f12711 0%, #f5af19 100%)',
    },
    {
      title: 'Tournaments',
      value: tournaments.total,
      subtitle: `${tournaments.active} Currently Active`,
      icon: <TournamentIcon size={24} />,
      color: 'linear-gradient(135deg, #3a7bd5 0%, #3a6073 100%)',
    },
  ];

  return (
    <Box sx={{ p: 3, backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#1f2937' }}>
            Hand Cricket Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: '#6b7280', mt: 0.5 }}>
            Real-time analytics and application performance monitoring
          </Typography>
        </Box>
        <Chip
          icon={<GrowthIcon size={16} />}
          label={`Growth: ${users.growthRate}%`}
          color="success"
          sx={{ fontWeight: 'bold', px: 1 }}
        />
      </Box>

      {/* Grid Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card
              sx={{
                background: card.color,
                color: '#fff',
                borderRadius: 4,
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: -10,
                  right: -10,
                  opacity: 0.15,
                  transform: 'scale(1.8)',
                }}
              >
                {card.icon}
              </Box>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ opacity: 0.85, fontWeight: 'medium' }}>
                    {card.title}
                  </Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                  {card.value}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  {card.subtitle}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Sub-Alert Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6}>
          <Paper
            sx={{
              p: 2,
              borderRadius: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              borderLeft: '5px solid #ef4444',
            }}
          >
            <PendingIcon size={24} className="text-red-500" />
            <Box>
              <Typography variant="body2" sx={{ color: '#6b7280' }}>
                Pending Coin Withdrawals
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1f2937' }}>
                {transactions.pendingWithdrawals} requests need approval
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper
            sx={{
              p: 2,
              borderRadius: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              borderLeft: '5px solid #3b82f6',
            }}
          >
            <PendingIcon size={24} className="text-blue-500" />
            <Box>
              <Typography variant="body2" sx={{ color: '#6b7280' }}>
                Pending Reward Store Orders
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1f2937' }}>
                {orders.pending} orders pending shipment
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Analytics Tables */}
      <Grid container spacing={4}>
        {/* Revenue by Ad Network */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#374151' }}>
              Ad Network Performance
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Ad Network</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="right">Impressions</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="right">Revenue (USD)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ads.revenueByNetwork?.length > 0 ? (
                    ads.revenueByNetwork.map((net, i) => (
                      <TableRow key={i} hover>
                        <TableCell sx={{ textTransform: 'uppercase', fontWeight: 'bold', color: '#4b5563' }}>
                          {net._id || 'Unknown'}
                        </TableCell>
                        <TableCell align="right">{net.impressions}</TableCell>
                        <TableCell align="right">${parseFloat(net.revenue).toFixed(4)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ py: 3, color: '#9ca3af' }}>
                        No network impressions recorded yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Top Earners Leaderboard */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#374151' }}>
              Top Earners Leaderboard
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Player</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="right">Ad Coins</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="right">Reward Coins</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topUsers?.length > 0 ? (
                    topUsers.map((user, i) => (
                      <TableRow key={i} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 'medium', color: '#1f2937' }}>
                            {user.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                            {user.email}
                          </Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ color: '#4b5563', fontWeight: 'bold' }}>
                          {user.adCoins}
                        </TableCell>
                        <TableCell align="right" sx={{ color: '#10b981', fontWeight: 'bold' }}>
                          {user.rewardCoins}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ py: 3, color: '#9ca3af' }}>
                        No players registered.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AdminDashboard;