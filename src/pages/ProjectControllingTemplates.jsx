import { useState } from 'react'
import {
  Box, Container, Typography, Paper, Button, Grid, Divider,
  Checkbox, FormControlLabel, LinearProgress
} from '@mui/material'
import Navbar from '../components/Layout/Navbar'
import DownloadIcon from '@mui/icons-material/Download'
import AssessmentIcon from '@mui/icons-material/Assessment'
import TableChartIcon from '@mui/icons-material/TableChart'
import GroupsIcon from '@mui/icons-material/Groups'
import SlideshowIcon from '@mui/icons-material/Slideshow'
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial'
import ChecklistIcon from '@mui/icons-material/Checklist'
import { downloadFinancialForecast, downloadKnowledgeMatrix } from '../utils/templateGenerator'

const TEMPLATES = [
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

const CHECKLIST_ITEMS = [
  'Project Management process',
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
  const [checked, setChecked] = useState({})

  const toggle = (item) => setChecked(prev => ({ ...prev, [item]: !prev[item] }))
  const checkedCount = Object.values(checked).filter(Boolean).length
  const progress = Math.round((checkedCount / CHECKLIST_ITEMS.length) * 100)

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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <ChecklistIcon color="primary" />
            <Typography variant="h6" fontWeight={700}>Delivery Checklist</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Track the delivery artefacts and processes in place for your project.
            </Typography>
            <Typography variant="body2" fontWeight={700} color="primary">
              {checkedCount} / {CHECKLIST_ITEMS.length}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ mb: 3, height: 6, borderRadius: 3 }}
          />
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {CHECKLIST_ITEMS.map((item, i) => (
              <Box
                key={item}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  py: 0.75,
                  borderBottom: i < CHECKLIST_ITEMS.length - 1 ? '1px solid #f0f0f0' : 'none',
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!!checked[item]}
                      onChange={() => toggle(item)}
                      color="primary"
                    />
                  }
                  label={
                    <Typography
                      variant="body1"
                      sx={{
                        color: checked[item] ? 'text.disabled' : 'text.primary',
                        textDecoration: checked[item] ? 'line-through' : 'none',
                        transition: 'all 0.2s',
                        fontWeight: checked[item] ? 400 : 500,
                      }}
                    >
                      {item}
                    </Typography>
                  }
                  sx={{ m: 0, width: '100%' }}
                />
              </Box>
            ))}
          </Box>
        </Paper>

      </Container>
    </Box>
  )
}
