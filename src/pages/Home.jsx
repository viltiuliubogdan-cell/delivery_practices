import { Box, Typography, Button, Container, Paper, Grid, Divider } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import AssignmentIcon from '@mui/icons-material/Assignment'
import DashboardIcon from '@mui/icons-material/Dashboard'
import DownloadIcon from '@mui/icons-material/Download'
import AssessmentIcon from '@mui/icons-material/Assessment'
import TableChartIcon from '@mui/icons-material/TableChart'
import GroupsIcon from '@mui/icons-material/Groups'
import SlideshowIcon from '@mui/icons-material/Slideshow'
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial'
import { downloadFinancialForecast, downloadKnowledgeMatrix } from '../utils/templateGenerator'

const templates = [
  {
    label: 'Financial Forecast',
    description: 'Actuals vs Planned, Profitability, Holiday Planning',
    icon: <AssessmentIcon />,
    color: '#1565c0',
    action: downloadFinancialForecast,
    type: 'generate',
  },
  {
    label: 'Risk Log',
    description: 'Risk register with impact, probability and mitigation',
    icon: <TableChartIcon />,
    color: '#b71c1c',
    href: '/templates/Risk_Log.xlsx',
    type: 'download',
  },
  {
    label: 'Knowledge Matrix',
    description: 'Functional & technical module competency matrix',
    icon: <GroupsIcon />,
    color: '#1b5e20',
    action: downloadKnowledgeMatrix,
    type: 'generate',
  },
  {
    label: 'Steering Committee',
    description: 'Steering committee presentation template',
    icon: <SlideshowIcon />,
    color: '#e65100',
    href: '/templates/Steering_Committee.pptx',
    type: 'download',
  },
]

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
        py: 6,
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

        {/* Main navigation buttons */}
        <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap', mb: 6 }}>
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
        </Box>

        {/* Project Controlling Templates */}
        <Paper
          elevation={0}
          sx={{
            backgroundColor: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.25)',
            borderRadius: 3,
            p: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
            <FolderSpecialIcon sx={{ color: 'white' }} />
            <Typography variant="h6" fontWeight={700} color="white">
              Project Controlling Templates
            </Typography>
          </Box>
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', mb: 3 }} />
          <Grid container spacing={2}>
            {templates.map(t => (
              <Grid item xs={12} sm={6} key={t.label}>
                <Box
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.12)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderLeft: `4px solid ${t.color === '#1565c0' ? '#90caf9' : t.color === '#b71c1c' ? '#ef9a9a' : t.color === '#1b5e20' ? '#a5d6a7' : '#ffcc80'}`,
                    borderRadius: 2,
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                    textAlign: 'left',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ color: 'rgba(255,255,255,0.8)' }}>{t.icon}</Box>
                    <Box>
                      <Typography fontWeight={700} color="white" variant="body2">{t.label}</Typography>
                      <Typography variant="caption" color="rgba(255,255,255,0.65)">{t.description}</Typography>
                    </Box>
                  </Box>
                  {t.type === 'generate' ? (
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<DownloadIcon />}
                      onClick={t.action}
                      sx={{
                        color: 'white', borderColor: 'rgba(255,255,255,0.5)',
                        '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' },
                        whiteSpace: 'nowrap', flexShrink: 0,
                      }}
                    >
                      Download
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<DownloadIcon />}
                      component="a"
                      href={t.href}
                      download
                      sx={{
                        color: 'white', borderColor: 'rgba(255,255,255,0.5)',
                        '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' },
                        whiteSpace: 'nowrap', flexShrink: 0,
                      }}
                    >
                      Download
                    </Button>
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>
    </Box>
  )
}
