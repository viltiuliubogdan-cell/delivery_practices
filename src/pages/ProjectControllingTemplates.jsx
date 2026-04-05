import {
  Box, Container, Typography, Paper, Button, Grid, Divider
} from '@mui/material'
import Navbar from '../components/Layout/Navbar'
import DownloadIcon from '@mui/icons-material/Download'
import AssessmentIcon from '@mui/icons-material/Assessment'
import TableChartIcon from '@mui/icons-material/TableChart'
import GroupsIcon from '@mui/icons-material/Groups'
import SlideshowIcon from '@mui/icons-material/Slideshow'
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial'
import ChecklistIcon from '@mui/icons-material/Checklist'
import { downloadKnowledgeMatrix } from '../utils/templateGenerator'

const TEMPLATES = [
  {
    label: 'Financial Forecast',
    description: 'Actuals vs Planned, Profitability, Holiday Planning',
    icon: <AssessmentIcon />,
    color: '#1565c0',
    href: '/templates/Financial_Forecast.xlsx',
    type: 'download',
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
    href: '/templates/Steering_Committee.pdf',
    type: 'download',
  },
]

const CHECKLIST_ITEMS = [
  'Testing process',
  'Requirements process',
  'Developments process',
  'Development guidelines',
  'Deployment process',
  'Non-Functional requirements',
  'Risks/Decision/Issues log',
  'Overall Scope burndown',
  'Project statement',
  'Project level milestones',
  'Team estimations - Story points estimations',
  'Induction for new members',
  "KPI's - Velocity defined",
  'Skills matrix',
  'Architectural diagram',
  'Disaster recovery process',
  'Rollback process',
  'Automation strategy and goals',
  'Code quality - Sonar',
  'Security/PenTest recurrent',
]

export default function ProjectControllingTemplates() {
  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Navbar />
      <Container maxWidth="md" sx={{ py: 4 }}>

        {/* Templates */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <FolderSpecialIcon color="primary" />
            <Typography variant="h6" fontWeight={700}>Project Controlling Templates</Typography>
          </Box>
          <Grid container spacing={2}>
            {TEMPLATES.map(t => (
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

        {/* Delivery Checklist */}
        <Paper elevation={2} sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <ChecklistIcon color="primary" />
            <Typography variant="h6" fontWeight={700}>Delivery Checklist</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Delivery artefacts and processes expected to be in place for your project.
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {CHECKLIST_ITEMS.map((item, i) => (
              <Box
                key={item}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  py: 0.85,
                  borderBottom: i < CHECKLIST_ITEMS.length - 1 ? '1px solid #f0f0f0' : 'none',
                }}
              >
                <Box
                  sx={{
                    width: 7, height: 7, borderRadius: '50%',
                    backgroundColor: 'primary.main', flexShrink: 0,
                  }}
                />
                <Typography variant="body1" fontWeight={500}>{item}</Typography>
              </Box>
            ))}
          </Box>
        </Paper>

      </Container>
    </Box>
  )
}
