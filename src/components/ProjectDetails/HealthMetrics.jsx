import { Paper, Typography, Box, FormControlLabel, Checkbox, TextField, Divider, Grid } from '@mui/material'
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart'

export const HEALTH_METRICS = [
  { key: 'unit_testing_coverage', label: 'Unit testing coverage', defaultHint: 'e.g. > 80%', category: 'Quality' },
  { key: 'integration_testing', label: 'Integration Testing', defaultHint: 'e.g. > 60%', category: 'Quality' },
  { key: 'vulnerabilities_detected', label: 'Vulnerabilities detected', defaultHint: 'e.g. 0 critical', category: 'Quality' },
  { key: 'failed_releases', label: 'Failed releases', defaultHint: 'e.g. 0', category: 'Quality' },
  { key: 'technical_depth', label: 'Technical Depth', defaultHint: 'e.g. < 15%', category: 'Quality' },
  { key: 'code_review', label: 'Code review coverage', defaultHint: 'e.g. 100%', category: 'Quality' },
  { key: 'quality_hygiene_rate', label: 'Quality Hygiene rate — all Tests to run/break build', defaultHint: 'e.g. 100% pass rate', category: 'Quality' },
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

  const renderGroup = (group, title) => (
    <Box>
      <Typography variant="subtitle1" fontWeight={700} color="primary" sx={{ mb: 1.5 }}>{title}</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {group.map(m => {
          const metric = getMetric(m.key)
          return (
            <Box key={m.key} sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={metric.selected}
                    onChange={() => toggleSelected(m.key)}
                    color="primary"
                  />
                }
                label={<Typography fontWeight={metric.selected ? 600 : 400}>{m.label}</Typography>}
                sx={{ minWidth: 320, m: 0 }}
              />
              {metric.selected && (
                <TextField
                  size="small"
                  placeholder={m.defaultHint}
                  value={metric.objective}
                  onChange={e => setObjective(m.key, e.target.value)}
                  label="Objective / Target"
                  sx={{ minWidth: 220 }}
                />
              )}
            </Box>
          )
        })}
      </Box>
    </Box>
  )

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <MonitorHeartIcon color="primary" />
        <Typography variant="h6" fontWeight={700}>Health Metrics</Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Select the metrics applicable to your project and define your target objectives.
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          {renderGroup(qualityMetrics, 'Quality Metrics')}
        </Grid>
        <Grid item xs={12} md={5}>
          <Divider orientation="vertical" sx={{ display: { xs: 'none', md: 'block' }, height: '100%' }} />
          {renderGroup(productivityMetrics, 'Productivity Metrics')}
        </Grid>
      </Grid>
    </Paper>
  )
}
