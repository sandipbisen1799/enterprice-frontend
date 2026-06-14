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
  Chip,
  Grid,
  Divider,
} from '@mui/material';
import { ShieldAlert as AlertIcon, AlertTriangle as WarningIcon, User as UserIcon } from 'lucide-react';
import { getFraudReport } from '../../services/admin.service';
import { toast } from 'react-toastify';

function AdminFraudReport() {
  const [report, setReport] = useState({ flaggedUsers: [], suspiciousUsers: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await getFraudReport();
        setReport(data || { flaggedUsers: [], suspiciousUsers: [] });
      } catch (error) {
        console.error(error);
        toast.error('Failed to load fraud detection reports');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  return (
    <Box sx={{ p: 3, backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ fontWeight: 800, color: '#1f2937', mb: 3 }}>
        Security & Fraud Reports
      </Typography>

      <Grid container spacing={4}>
        {/* Flagged Accounts */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', minHeight: 400 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center', gap: 1, color: '#dc2626' }}>
              <AlertIcon size={20} /> Flagged Players List
            </Typography>
            <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mb: 2 }}>
              Players flagged for malicious actions, multi-accounting, or manually suspended
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Player</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Device ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Flag Reasons</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ py: 3, color: '#9ca3af' }}>
                        Scanning database...
                      </TableCell>
                    </TableRow>
                  ) : report.flaggedUsers?.length > 0 ? (
                    report.flaggedUsers.map((user) => (
                      <TableRow key={user._id} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{user.name}</Typography>
                          <Typography variant="caption" sx={{ color: '#6b7280' }}>{user.phone}</Typography>
                        </TableCell>
                        <TableCell sx={{ fontFamily: 'monospace', fontSize: '11px' }}>
                          {user.deviceFingerprint || 'Unknown'}
                        </TableCell>
                        <TableCell>
                          {user.fraudFlags?.map((flag, idx) => (
                            <Chip
                              key={idx}
                              label={flag.reason || 'Flagged'}
                              size="small"
                              color="error"
                              variant="outlined"
                              sx={{ mr: 0.5, mb: 0.5, fontSize: '10px' }}
                            />
                          ))}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ py: 3, color: '#9ca3af' }}>
                        ✓ Zero security flags triggered.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Suspicious Ad Impression Counts */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', minHeight: 400 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center', gap: 1, color: '#d97706' }}>
              <WarningIcon size={20} /> High Ad Watch Activity
            </Typography>
            <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mb: 2 }}>
              Players watching more than 50 ads total or more than 10 ads in the last 24 hours
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Player</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="right">24h Watch Count</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="right">Total Watched</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ py: 3, color: '#9ca3af' }}>
                        Scanning database...
                      </TableCell>
                    </TableRow>
                  ) : report.suspiciousUsers?.length > 0 ? (
                    report.suspiciousUsers.map((user) => (
                      <TableRow key={user._id} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{user.name}</Typography>
                          <Typography variant="caption" sx={{ color: '#6b7280' }}>{user.email}</Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', color: user.recentAds > 10 ? '#ef4444' : '#4b5563' }}>
                          {user.recentAds} ads
                        </TableCell>
                        <TableCell align="right">{user.adCount} impressions</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ py: 3, color: '#9ca3af' }}>
                        ✓ No players with high watch counts today.
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

export default AdminFraudReport;
