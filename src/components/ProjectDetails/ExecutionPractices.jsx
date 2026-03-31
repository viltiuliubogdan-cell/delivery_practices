import { Paper, Typography, Box, Grid } from '@mui/material'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import BarChartIcon from '@mui/icons-material/BarChart'
import ListAltIcon from '@mui/icons-material/ListAlt'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import TrackChangesIcon from '@mui/icons-material/TrackChanges'

const practices = [
  {
    icon: <BarChartIcon sx={{ color: '#1565c0', fontSize: 28 }} />,
    title: 'Delivery Timelines',
    guidance: 'Track delivery timelines via a Burndown Chart — visualise remaining work versus time to ensure on-time delivery.',
    color: '#e3f2fd',
    border: '#1565c0',
  },
  {
    icon: <ListAltIcon sx={{ color: '#6a1b9a', fontSize: 28 }} />,
    title: 'Backlog Estimation',
    guidance: 'Estimate backlog items in Story Points to ensure consistent sizing and accurate sprint planning across the team.',
    color: '#f3e5f5',
    border: '#6a1b9a',
  },
  {
    icon: <AccessTimeIcon sx={{ color: '#1b5e20', fontSize: 28 }} />,
    title: 'Task Estimation',
    guidance: 'Log estimated Hours per task before starting work. Use planning poker or T-shirt sizing for team alignment.',
    color: '#e8f5e9',
    border: '#1b5e20',
  },
  {
    icon: <TrackChangesIcon sx={{ color: '#e65100', fontSize: 28 }} />,
    title: 'Effort Monitoring',
    guidance: 'Log hours spent in the Issue Tracker (Jira, Azure DevOps, etc.) to monitor actuals vs estimates and improve forecasting.',
    color: '#fff3e0',
    border: '#e65100',
  },
]

export default function ExecutionPractices() {
  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <RocketLaunchIcon color="primary" />
        <Typography variant="h6" fontWeight={700}>Execution Practices</Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Mandatory delivery practices expected on all projects. These are non-negotiable standards.
      </Typography>
      <Grid container spacing={2}>
        {practices.map(p => (
          <Grid item xs={12} sm={6} key={p.title}>
            <Box
              sx={{
                backgroundColor: p.color, borderLeft: `4px solid ${p.border}`,
                borderRadius: 2, p: 2.5, height: '100%'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                {p.icon}
                <Typography fontWeight={700} color={p.border}>{p.title}</Typography>
              </Box>
              <Typography variant="body2" color="text.primary" fontWeight={500}>
                {p.guidance}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  )
}
