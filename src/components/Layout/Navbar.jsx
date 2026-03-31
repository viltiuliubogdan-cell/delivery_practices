import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import DashboardIcon from '@mui/icons-material/Dashboard'
import AssignmentIcon from '@mui/icons-material/Assignment'
import HomeIcon from '@mui/icons-material/Home'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#1a237e' }}>
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ cursor: 'pointer', fontWeight: 700, mr: 4 }}
          onClick={() => navigate('/')}
        >
          Delivery Practices
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexGrow: 1 }}>
          <Button
            color="inherit"
            startIcon={<HomeIcon />}
            onClick={() => navigate('/')}
            variant={location.pathname === '/' ? 'outlined' : 'text'}
          >
            Home
          </Button>
          <Button
            color="inherit"
            startIcon={<AssignmentIcon />}
            onClick={() => navigate('/project')}
            variant={location.pathname === '/project' ? 'outlined' : 'text'}
          >
            Project Details
          </Button>
          <Button
            color="inherit"
            startIcon={<DashboardIcon />}
            onClick={() => navigate('/dashboard')}
            variant={location.pathname === '/dashboard' ? 'outlined' : 'text'}
          >
            Projects Dashboard
          </Button>
        </Box>
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>{user.email}</Typography>
            <Button color="inherit" variant="outlined" size="small" onClick={handleSignOut}>
              Sign Out
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  )
}
