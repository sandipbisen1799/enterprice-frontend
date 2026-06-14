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
} from '@mui/material';
import { getPendingWithdrawals, processWithdrawal } from '../../services/admin.service';
import { toast } from 'react-toastify';

function AdminWithdrawals() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Rejection modal states
  const [rejectId, setRejectId] = useState(null);
  const [rejectNotes, setRejectNotes] = useState('');
  const [rejectOpen, setRejectOpen] = useState(false);

  const fetchWithdrawals = async () => {
    setLoading(true);
    try {
      const data = await getPendingWithdrawals();
      setWithdrawals(data || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load pending withdrawals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const handleApprove = async (txId) => {
    try {
      const res = await processWithdrawal(txId, 'approve');
      if (res.success) {
        toast.success('Withdrawal approved successfully');
        fetchWithdrawals();
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to approve withdrawal request');
    }
  };

  const handleRejectClick = (txId) => {
    setRejectId(txId);
    setRejectNotes('');
    setRejectOpen(true);
  };

  const handleRejectConfirm = async () => {
    if (!rejectNotes.trim()) {
      toast.warn('Please provide a reason for rejection');
      return;
    }
    try {
      const res = await processWithdrawal(rejectId, 'reject', rejectNotes);
      if (res.success) {
        toast.success('Withdrawal request rejected and refunded');
        setRejectOpen(false);
        fetchWithdrawals();
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to reject withdrawal request');
    }
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ fontWeight: 800, color: '#1f2937', mb: 3 }}>
        Pending Withdrawals
      </Typography>

      <Paper sx={{ p: 2, borderRadius: 4, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <TableContainer>
          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Player Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Contact Info</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Amount Requested</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Payment Method / Details</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Request Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4, color: '#9ca3af' }}>
                    Fetching pending cashout requests...
                  </TableCell>
                </TableRow>
              ) : withdrawals.length > 0 ? (
                withdrawals.map((tx) => (
                  <TableRow key={tx._id} hover>
                    <TableCell sx={{ fontWeight: 'bold', color: '#1f2937' }}>
                      {tx.userId?.name || 'Unknown User'}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{tx.userId?.phone || 'N/A'}</Typography>
                      <Typography variant="caption" sx={{ color: '#6b7280' }}>
                        {tx.userId?.email || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#ef4444' }}>
                      {tx.amount} Reward Coins
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {tx.metadata?.paymentDetails || tx.description || 'UPI Payout Request'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {new Date(tx.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={() => handleApprove(tx._id)}
                          sx={{ textTransform: 'none', borderRadius: 2 }}
                        >
                          Approve Payout
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleRejectClick(tx._id)}
                          sx={{ textTransform: 'none', borderRadius: 2 }}
                        >
                          Reject
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4, color: '#9ca3af' }}>
                    No pending withdrawals.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Rejection Notes Dialog */}
      <Dialog
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 'bold' }}>Reject Withdrawal Request</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: '#4b5563', mb: 2 }}>
            Provide a reason for rejection. This will be shown to the user in their transaction description, and their coins stake will be fully refunded to their balance.
          </Typography>
          <TextField
            label="Rejection Reason"
            fullWidth
            multiline
            rows={3}
            value={rejectNotes}
            onChange={(e) => setRejectNotes(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectOpen(false)}>Cancel</Button>
          <Button onClick={handleRejectConfirm} variant="contained" color="error">
            Confirm Rejection
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdminWithdrawals;
