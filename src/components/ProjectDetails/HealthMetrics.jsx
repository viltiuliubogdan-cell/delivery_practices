import { Paper, Typography, Box, FormControlLabel, Checkbox, TextField, Divider } from '@mui/material'
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart'
import SpeedIcon from '@mui/icons-material/Speed'
import VerifiedIcon from '@mui/icons-material/Verified'

export const HEALTH_METRICS = [
  { key: 'unit_testing_coverage', label: 'Unit testing coverage', defaultHint: 'e.g. > 80%', category: 'Quality' },
  { key: 'integration_testing', label: 'Integration Testing', defaultHint: 'e.g. > 60%', category: 'Quality' },
  { key: 'automation_testing_coverage', label: 'Automation Testing Coverage', defaultHint: 'e.g. > 70%', category: 'Quality' },
  { key: 'vulnerabilities_detected', label: 'Vulnerabilities detected', defaultHint: 'e.g. 0 critical', category: 'Quality' },
  { key: 'failed_releases', label: 'Failed release % per quarter', defaultHint: 'e.g. < 5%', category: 'Quality' },
  { key: 'technical_depth', label: 'Technical Depth %', defaultHint: 'e.g. < 15%', category: 'Quality' },
  { key: 'code_review', label: 'Code review coverage', defaultHint: 'e.g. 100%', category: 'Quality' },
  { key: 'ai_adoption', label: 'AI Adoption %', defaultHint: 'e.g. > 50% of team using AI tools', category: 'Quality' },
  { key: 'velocity', label: 'Velocity', defaultHint: 'e.g. 40 story points/sprint', category: 'Productivity' },
  { key: 'cycle_time', label: 'Cycle time', defaultHint: 'e.g. < 3 days', category: 'Productivity' },
]

export default function HealthMetrics({ metrics, onChange }) {
  const getMetric = (key) => metrics[key] || { selected: false, objective: '' }

  const toggleSelected = (key) => {
    const current = getMetric(key)
    onChange({ ...metrics, [key]: { ...current, selected: !current.selected } })
  }

  const setObjective = (key, value) => {
    const current = getMetric(key)
    onChange({ ...metrics, [key]: { ...current, objective: value } })
  }

  const qualityMetrics = HEALTH_METRICS.filter(m => m.category === 'Quality')
  const productivityMetrics = HEALTH_METRICS.filter(m => m.category === 'Productivity')

  const renderMetricRow = (m) => {
    const metric = getMetric(m.key)
    return (
      <Box key={m.key} sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', py: 0.5 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={metric.selected}
              onChange={() => toggleSelected(m.key)}
              color="primary"
            />
          }
          label={<Typography fontWeight={metric.selected ? 600 : 400}>{m.label}</Typography>}
          sx={{ minWidth: 300, m: 0 }}
        />
        {metric.selected && (
          <TextField
            size="small"
            placeholder={m.defaultHint}
            value={metric.objective}
            onChange={e => setObjective(m.key, e.target.value)}
            label="Objective / Target"
            sx={{ minWidth: 240 }}
          />
        )}
      </Box>
    )
  }

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <MonitorHeartIcon color="primary" />
        <Typography variant="h6" fontWeight={700}>Health Metrics</Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Select the metrics applicable to your project and define your target objectives.
      </Typography>

      {/* Quality Metrics */}
      <Box
        sx={{
          backgroundColor: '#f0f4ff',
          border: '1px solid #c5cae9',
          borderRadius: 2,
          p: 2.5,
          mb: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <VerifiedIcon sx={{ color: '#1565c0', fontSize: 20 }} />
          <Typography variant="subtitle1" fontWeight={700} color="primary">Quality Metrics</Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {qualityMetrics.map(renderMetricRow)}
        </Box>
      </Box>

      {/* Productivity Metrics */}
      <Box
        sx={{
          backgroundColor: '#f1f8e9',
          border: '1px solid #c5e1a5',
          borderRadius: 2,
          p: 2.5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <SpeedIcon sx={{ color: '#2e7d32', fontSize: 20 }} />
          <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#2e7d32' }}>Productivity Metrics</Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {productivityMetrics.map(renderMetricRow)}
        </Box>
      </Box>
    </Paper>
  )
}
