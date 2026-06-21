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
  Divider,
  Card,
  CardContent,
  MenuItem,
} from '@mui/material';
import { Trophy as TournamentIcon, Plus as CreateIcon, XCircle as CancelIcon, Play as StartIcon } from 'lucide-react';
import { getTournaments, createTournament, startTournament, cancelTournament } from '../../services/admin.service';
import { toast } from 'react-toastify';

function AdminTournaments() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Creation form states
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    type: '16_players',
    maxPlayers: 16,
    entryFee: 0,
    winningPrize: 0,
    registrationStartDate: '',
    registrationEndDate: '',
    startDate: '',
  });

  // Rejection/Cancellation states
  const [cancelId, setCancelId] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelOpen, setCancelOpen] = useState(false);

  const fetchTournaments = async () => {
    setLoading(true);
    try {
      const data = await getTournaments();
      setTournaments(data?.tournaments || data || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load tournaments list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      // Basic validate
      if (!form.name.trim() || !form.registrationStartDate || !form.registrationEndDate || !form.startDate) {
        toast.warn('Please fill in all required fields');
        return;
      }
      
      const payload = {
        ...form,
        maxPlayers: parseInt(form.maxPlayers),
        entryFee: parseInt(form.entryFee),
        winningPrize: parseInt(form.winningPrize) || 0,
        registrationStartDate: new Date(form.registrationStartDate).toISOString(),
        registrationEndDate: new Date(form.registrationEndDate).toISOString(),
        startDate: new Date(form.startDate).toISOString(),
      };

      const res = await createTournament(payload);
      if (res.success) {
        toast.success('Tournament created successfully');
        setCreateOpen(false);
        setForm({
          name: '',
          type: '16_players',
          maxPlayers: 16,
          entryFee: 0,
          winningPrize: 0,
          registrationStartDate: '',
          registrationEndDate: '',
          startDate: '',
        });
        fetchTournaments();
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || 'Failed to create tournament');
    }
  };

  const handleStart = async (tournamentId) => {
    try {
      const res = await startTournament(tournamentId);
      if (res.success) {
        toast.success('Tournament bracket matches successfully initialized');
        fetchTournaments();
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || 'Failed to start tournament');
    }
  };

  const handleCancelClick = (tournamentId) => {
    setCancelId(tournamentId);
    setCancelReason('');
    setCancelOpen(true);
  };

  const handleCancelConfirm = async () => {
    try {
      const res = await cancelTournament(cancelId, cancelReason);
      if (res.success) {
        toast.success('Tournament cancelled and entry fees refunded');
        setCancelOpen(false);
        fetchTournaments();
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || 'Failed to cancel tournament');
    }
  };

  const handleTypeChange = (e) => {
    const type = e.target.value;
    const sizes = {
      '16_players': 16,
      '32_players': 32,
      '64_players': 64,
      '512_players': 512,
      '1024_players': 1024
    };
    setForm({
      ...form,
      type,
      maxPlayers: sizes[type] || 16
    });
  };

  const activeTourneys = tournaments.filter(t => t.status === 'in_progress');
  const upcomingTourneys = tournaments.filter(t => t.status === 'registration' || t.status === 'upcoming');
  const pastTourneys = tournaments.filter(t => t.status === 'completed' || t.status === 'cancelled');

  return (
    <Box sx={{ p: 3, backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#1f2937' }}>
            Tournament Organizer
          </Typography>
          <Typography variant="body2" sx={{ color: '#6b7280', mt: 0.5 }}>
            Schedule matches, track player registration limits, and manage brackets
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<CreateIcon size={18} />}
          onClick={() => setCreateOpen(true)}
          sx={{ textTransform: 'none', borderRadius: 2 }}
        >
          Create Tournament
        </Button>
      </Box>

      {/* Main Grid */}
      <Grid container spacing={4}>
        {/* Active and Upcoming */}
        <Grid item xs={12} md={8}>
          {/* Active Bracket */}
          <Paper sx={{ p: 3, borderRadius: 4, mb: 4, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <TournamentIcon size={20} className="text-amber-500" /> Active Tournaments ({activeTourneys.length})
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Tournament</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Players Pool</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Entry Fee</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 3, color: '#9ca3af' }}>
                        Loading brackets...
                      </TableCell>
                    </TableRow>
                  ) : activeTourneys.length > 0 ? (
                    activeTourneys.map((t) => (
                      <TableRow key={t._id} hover>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t.name}</TableCell>
                        <TableCell sx={{ textTransform: 'capitalize' }}>{t.type?.replace('_', ' ')}</TableCell>
                        <TableCell>{t.registeredPlayers?.length} / {t.maxPlayers}</TableCell>
                        <TableCell>{t.entryFee} Coins</TableCell>
                        <TableCell align="center">
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => handleCancelClick(t._id)}
                            startIcon={<CancelIcon size={14} />}
                            sx={{ textTransform: 'none', borderRadius: 2 }}
                          >
                            Cancel
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 3, color: '#9ca3af' }}>
                        No active tournaments running.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Upcoming Bracket */}
          <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <TournamentIcon size={20} className="text-blue-500" /> Upcoming / Registration ({upcomingTourneys.length})
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Tournament</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Entry Fee</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Joined Pool</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Starts At</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 3, color: '#9ca3af' }}>
                        Loading brackets...
                      </TableCell>
                    </TableRow>
                  ) : upcomingTourneys.length > 0 ? (
                    upcomingTourneys.map((t) => (
                      <TableRow key={t._id} hover>
                        <TableCell sx={{ fontWeight: 'bold' }}>{t.name}</TableCell>
                        <TableCell>{t.entryFee} Coins</TableCell>
                        <TableCell>{t.registeredPlayers?.length} / {t.maxPlayers}</TableCell>
                        <TableCell>{new Date(t.startDate).toLocaleString()}</TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              onClick={() => handleStart(t._id)}
                              startIcon={<StartIcon size={14} />}
                              sx={{ textTransform: 'none', borderRadius: 2 }}
                            >
                              Start Matches
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              onClick={() => handleCancelClick(t._id)}
                              sx={{ textTransform: 'none', borderRadius: 2 }}
                            >
                              Cancel
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 3, color: '#9ca3af' }}>
                        No upcoming tournaments scheduled.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Sidebar Past History */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', minHeight: '400px' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#374151' }}>
              Past & Closed Tournaments
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {loading ? (
              <Typography variant="body2" sx={{ color: '#9ca3af', textAlign: 'center', py: 4 }}>
                Loading...
              </Typography>
            ) : pastTourneys.length > 0 ? (
              pastTourneys.map((t) => (
                <Card variant="outlined" key={t._id} sx={{ mb: 2, borderRadius: 3 }}>
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{t.name}</Typography>
                      <Chip
                        label={t.status}
                        size="small"
                        color={t.status === 'completed' ? 'success' : 'error'}
                      />
                    </Box>
                    <Typography variant="caption" sx={{ color: '#6b7280', display: 'block' }}>
                      Pool Size: {t.maxPlayers} Players
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#6b7280', display: 'block' }}>
                      Entry Fee: {t.entryFee} Coins
                    </Typography>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography variant="body2" sx={{ color: '#9ca3af', textAlign: 'center', py: 4 }}>
                No completed history recorded yet.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Creation Modal */}
      <Dialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
      >
        <Paper component="form" onSubmit={handleCreateSubmit} elevation={0}>
          <DialogTitle sx={{ fontWeight: 'bold' }}>Create New Tournament</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  label="Tournament Name"
                  fullWidth
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  select
                  label="Size/Bracket Type"
                  fullWidth
                  value={form.type}
                  onChange={handleTypeChange}
                  required
                >
                  <MenuItem value="16_players">16 Players</MenuItem>
                  <MenuItem value="32_players">32 Players</MenuItem>
                  <MenuItem value="64_players">64 Players</MenuItem>
                  <MenuItem value="512_players">512 Players</MenuItem>
                  <MenuItem value="1024_players">1024 Players</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Entry Fee (Coins)"
                  type="number"
                  fullWidth
                  value={form.entryFee}
                  onChange={(e) => setForm({ ...form, entryFee: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Winning Prize (Total Coins)"
                  type="number"
                  fullWidth
                  value={form.winningPrize}
                  onChange={(e) => setForm({ ...form, winningPrize: e.target.value })}
                  helperText="Split: 1st 50% | 2nd 25% | 3rd 15% | 4th 10%"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Registration Start Date"
                  type="datetime-local"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={form.registrationStartDate}
                  onChange={(e) => setForm({ ...form, registrationStartDate: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Registration End Date"
                  type="datetime-local"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={form.registrationEndDate}
                  onChange={(e) => setForm({ ...form, registrationEndDate: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Matches Start Date"
                  type="datetime-local"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  required
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              Build Tournament
            </Button>
          </DialogActions>
        </Paper>
      </Dialog>

      {/* Cancellation Modal */}
      <Dialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 'bold' }}>Cancel Tournament</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: '#4b5563', mb: 2 }}>
            Provide a reason for cancellation. All registered players will have their entry fee coins fully refunded to their wallets.
          </Typography>
          <TextField
            label="Cancellation Reason"
            fullWidth
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelOpen(false)}>Back</Button>
          <Button onClick={handleCancelConfirm} variant="contained" color="error">
            Confirm Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdminTournaments;
