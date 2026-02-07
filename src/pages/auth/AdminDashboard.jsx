import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Skeleton,
  Alert,
} from '@mui/material';
import {
  People as PeopleIcon,
  Group as GroupIcon,
  Business as BusinessIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { getAllUsers, getAllProjectAPI, getAllUsersdata } from '../../services/user.service';
import { toast } from 'react-toastify';
import TablePagination from '../../components/ui/TablePagination';
import Table from '../../components/ui/Table';


function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [projectManagers, setProjectManagers] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);
    const [blockedUsers, setBlockedUsers] = useState([]);
   


  const [selectedBox,SetSelectedBox]= useState('Users');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTeamMembers: 0,
    totalProjectManagers: 0,
    totalProjects: 0,
  });
  const [projects, setProjects] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [page, setPage] = useState(1);
  const pageSize = 5; // Items per page
   const fetchUsers = async () => {
      try {
        
        const data = await getAllUsersdata();
        setUsers(data.data.users || []);
        setProjectManagers(data.data.users.filter(user => user.accountType === 'projectManager'));
        setTeamMembers(data.data.users.filter(user => user.accountType === 'teamMember'));
        setBlockedUsers(data.data.users.filter(user => user.active == 'block' ));
        console.log(data);
        
      } catch (error) {
        console.log(error.response?.data || error.message);
      }
    };

    useEffect(() => {
        fetchUsers();
      }, [page]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch all users with large limit to get all
        const usersRes = await getAllUsers(1, 1000);
        const users = usersRes.users || [];

        // Create user map for quick lookup
        const map = {};
        users.forEach(user => {
          map[user._id] = user.userName;
        });
        setUserMap(map);

        // Fetch projects
        const projectsRes = await getAllProjectAPI();
        const projectsData = projectsRes.data?.projects || projectsRes.projects || [];

        // Calculate stats
        const totalUsers = users.length;
        const totalTeamMembers = users.filter(u => u.accountType === 'teamMember').length;
        const totalProjectManagers = users.filter(u => u.accountType === 'projectManager').length;
        const totalProjects = projectsData.length;

        setStats({
          totalUsers,
          totalTeamMembers,
          totalProjectManagers,
          totalProjects,
        });
        setProjects(projectsData);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('Failed to load dashboard data');
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const statCards = [
    {
      title: 'Total Users',
      name: 'Users',
      value: stats.totalUsers,
      icon: <PeopleIcon fontSize="large" />,
      color: '#1976d2',
    },
    {
      title: 'Team Members',
      name: 'teamMember',
      value: stats.totalTeamMembers,
      icon: <GroupIcon fontSize="large" />,
      color: '#388e3c',
    },
    {
      title: 'Project Managers',
      name: 'ProjectManagers',
      value: stats.totalProjectManagers,
      icon: <BusinessIcon fontSize="large" />,
      color: '#f57c00',
    },
    {
      title: 'Total Projects',
      name: 'projects',
      value: stats.totalProjects,
      icon: <AssignmentIcon fontSize="large" />,
      color: '#7b1fa2',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'assigned':
        return 'success';
      case 'pending':
        return 'warning';
      case 'completed':
        return 'info';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const columns = [
    { key: 'name', label: 'Project Name' },
    { key: 'projectManager', label: 'Assigned Project Manager', render: (row) => userMap[row.projectManager] || 'Unassigned' },
    { key: 'startDate', label: 'Start Date', render: (row) => formatDate(row.startDate) },
    { key: 'endDate', label: 'End Date', render: (row) => formatDate(row.endDate) },
    { key: 'status', label: 'Status', render: (row) => (
      <Chip
        label={row.status}
        color={getStatusColor(row.status)}
        size="small"
      />
    ) },
  ];

  const paginatedProjects = projects.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(projects.length / pageSize);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Admin Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card, index) => (
          <Grid   key={index}>
            <Card onClick={() => SetSelectedBox(card.name)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 2,
                boxShadow: 2,
                '&:hover': { boxShadow: 4 },
                transition: 'box-shadow 0.3s ease',
              }}
            >
              <Box  sx={{ color: card.color, mr: 2 }}>
                {card.icon}
              </Box>
              <CardContent sx={{ flex: 1, p: 0 }}>
                {loading ? (
                  <Skeleton variant="text" width={60} height={28} />
                ) : (
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {card.value}
                  </Typography>
                )}
                <Typography variant="body2" color="text.secondary">
                  {card.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
     <div className='flex flex-row w-full items-center  h-5 bg-gray-200 mb-4 px-4 py-5 gap-7  rounded-lg '>
      <h1 className={`${selectedBox === 'Users' ? 'bg-blue-500 text-white' : 'text-black bg-gray-50'} cursor-pointer px-4 py-1 rounded-2xl`}onClick={()=>SetSelectedBox('Users')}>Users</h1>
      <h1 className={`${selectedBox === 'ProjectManagers' ? 'bg-blue-500 text-white' : 'text-black bg-gray-50'} cursor-pointer px-4 py-1 rounded-2xl`}onClick={()=>SetSelectedBox('ProjectManagers')}>ProjectManagers</h1>
            <h1 className={`${selectedBox === 'teamMember' ? 'bg-blue-500 text-white' : 'text-black bg-gray-50'} cursor-pointer px-4 py-1 rounded-2xl`}onClick={()=>SetSelectedBox('teamMember')}>TeamMember</h1>
            <h1 className={`${selectedBox === 'blockeduser' ? 'bg-blue-500 text-white' : 'text-black bg-gray-50'} cursor-pointer px-4 py-1 rounded-2xl`}onClick={()=>SetSelectedBox('blockeduser')}>blocked user</h1>
      <h1 className={`${selectedBox === 'projects' ? 'bg-blue-500 text-white' : 'text-black bg-gray-50'} cursor-pointer px-4 py-1 rounded-2xl`}onClick={()=>SetSelectedBox('projects')}>projects</h1>

      
     </div>
     {
      selectedBox === 'Users' && (<>
            <h1 className='font-semibold text-2xl text-gray-600'>Users</h1>
      <Table
        columns={[
          { key: 'userName', label: 'Name' },
          { key: 'email', label: 'Email' },
          { key: 'accountType', label: 'accountType' },
          
        ]}
        data={users}
      />
      </>)

     }
       {
      selectedBox === 'ProjectManagers' && (<>
      <h1 className='font-semibold text-2xl text-gray-600'>ProjectManager</h1>
      <Table
        columns={[
          { key: 'userName', label: 'Name' },
          { key: 'email', label: 'Email' },
          { key: 'accountType', label: 'accountType' },
          
        ]}
        data={projectManagers}
      />
      </>)

     }
       {
      selectedBox === 'teamMember' && (<>
            <h1 className='font-semibold text-2xl text-gray-600'>TeamMember</h1>
      <Table
        columns={[
          { key: 'userName', label: 'Name' },
          { key: 'email', label: 'Email' },
          { key: 'accountType', label: 'accountType' },
          
        ]}
        data={teamMembers}
      />
      </>)

     }
       {
      selectedBox === 'blockeduser' && (<>
            <h1 className='font-semibold text-2xl text-gray-600'>Blocked Users</h1>
      <Table
        columns={[
          { key: 'userName', label: 'Name' },
          { key: 'email', label: 'Email' },
          { key: 'accountType', label: 'accountType' },
          
        ]}
        data={blockedUsers}
      />
      </>)

     }

      {/* Projects Table */}
   {selectedBox === 'projects' && (
        <CardContent>
          <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
            Projects Overview
          </Typography>
          {loading ? (
            <Box sx={{ p: 2 }}>
              {Array.from({ length: 3 }).map((_, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Skeleton variant="text" width={200} />
                  <Skeleton variant="text" width={150} />
                  <Skeleton variant="text" width={100} />
                  <Skeleton variant="text" width={100} />
                  <Skeleton variant="rectangular" width={80} height={32} />
                </Box>
              ))}
            </Box>
          ) : (
            <TablePagination
              columns={columns}
              data={paginatedProjects}
              page={page}
              onPageChange={handlePageChange}
              totalPages={totalPages}
            />
          )}
        </CardContent>
      )}
  
    </Box>
  );
}

export default AdminDashboard;