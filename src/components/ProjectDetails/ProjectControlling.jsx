import { Paper, Typography, Box, Button, Grid } from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import TableChartIcon from '@mui/icons-material/TableChart'
import SlideshowIcon from '@mui/icons-material/Slideshow'
import AssessmentIcon from '@mui/icons-material/Assessment'
import GroupsIcon from '@mui/icons-material/Groups'
import { downloadFinancialForecast, downloadKnowledgeMatrix } from '../../utils/templateGenerator'

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

export default function ProjectControlling() {
  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <AssessmentIcon color="primary" />
        <Typography variant="h6" fontWeight={700}>Project Controlling</Typography>
      </Box>
      <Grid container spacing={2}>
        {templates.map(t => (
          <Grid item xs={12} sm={6} key={t.label}>
            <Paper
              variant="outlined"
              sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1, height: '100%', borderLeft: `4px solid ${t.color}` }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: t.color }}>
                {t.icon}
                <Typography fontWeight={700}>{t.label}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                {t.description}
              </Typography>
              {t.type === 'generate' ? (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<DownloadIcon />}
                  onClick={t.action}
                  sx={{ alignSelf: 'flex-start', borderColor: t.color, color: t.color }}
                >
                  Download Template
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<DownloadIcon />}
                  component="a"
                  href={t.href}
                  download
                  sx={{ alignSelf: 'flex-start', borderColor: t.color, color: t.color }}
                >
                  Download Template
                </Button>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Paper>
  )
}
