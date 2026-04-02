import { Box, Typography, Button, Container } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import AssignmentIcon from '@mui/icons-material/Assignment'
import DashboardIcon from '@mui/icons-material/Dashboard'
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial'

export default function Home() {
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a237e 0%, #283593 40%, #1565c0 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="md" sx={{ textAlign: 'center' }}>
        <Typography
          variant="h2"
          fontWeight={900}
          color="white"
          sx={{
            mb: 2,
            textShadow: '0 2px 20px rgba(0,0,0,0.3)',
            fontSize: { xs: '1.8rem', md: '3rem' },
            lineHeight: 1.3,
          }}
        >
          "A goal without a timeline is just a wish"
        </Typography>
        <Typography
          variant="h6"
          color="rgba(255,255,255,0.75)"
          sx={{ mb: 6, fontWeight: 400 }}
        >
          Delivery Practices Portal — for Project Managers
        </Typography>
        <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<AssignmentIcon />}
            onClick={() => navigate('/project')}
            sx={{
              px: 4, py: 2, fontSize: '1.1rem', fontWeight: 700,
              backgroundColor: '#4caf50', '&:hover': { backgroundColor: '#388e3c' },
              borderRadius: 3, boxShadow: '0 4px 20px rgba(76,175,80,0.4)',
            }}
          >
            Project Details
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<DashboardIcon />}
            onClick={() => navigate('/dashboard')}
            sx={{
              px: 4, py: 2, fontSize: '1.1rem', fontWeight: 700,
              color: 'white', borderColor: 'white', borderWidth: 2,
              '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' },
              borderRadius: 3,
            }}
          >
            Projects Dashboard
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<FolderSpecialIcon />}
            onClick={() => navigate('/controlling')}
            sx={{
              px: 4, py: 2, fontSize: '1.1rem', fontWeight: 700,
              color: 'white', borderColor: 'white', borderWidth: 2,
              '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' },
              borderRadius: 3,
            }}
          >
            Project Controlling Templates
          </Button>
        </Box>
      </Container>
    </Box>
  )
}
