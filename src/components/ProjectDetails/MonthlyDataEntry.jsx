import { Paper, Typography, Box, TextField, Grid, Button, Divider, Chip } from '@mui/material'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { HEALTH_METRICS } from './HealthMetrics'

const QUALITY_KEYS = HEALTH_METRICS.filter(m => m.category === 'Quality').map(m => m.key)
const PRODUCTIVITY_KEYS = ['velocity', 'cycle_time']

export default function MonthlyDataEntry({ projectId, metrics = {} }) {
  const [month, setMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })
  const [data, setData] = useState({})
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const set = (key, val) => setData(d => ({ ...d, [key]: val }))
  const val = (key) => data[key] ?? ''

  const selectedProductivity = HEALTH_METRICS.filter(
    m => m.category === 'Productivity' && metrics[m.key]?.selected
  )
  const selectedQuality = HEALTH_METRICS.filter(
    m => m.category === 'Quality' && metrics[m.key]?.selected
  )

  const handleSave = async () => {
    if (!projectId) return
    setSaving(true)
    const qualityData = {}
    selectedQuality.forEach(m => {
      if (data[m.key] !== '' && data[m.key] !== undefined) qualityData[m.key] = Number(data[m.key])
    })
    const payload = {
      project_id: projectId,
      month: `${month}-01`,
      customer_cnps: val('customer_cnps') !== '' ? Number(val('customer_cnps')) : null,
      employee_enps: val('employee_enps') !== '' ? Number(val('employee_enps')) : null,
      employee_attrition: val('employee_attrition') !== '' ? Number(val('employee_attrition')) : null,
      employee_participation: val('employee_participation') !== '' ? Number(val('employee_participation')) : null,
      velocity: val('velocity') !== '' ? Number(val('velocity')) : null,
      cycle_time: val('cycle_time') !== '' ? Number(val('cycle_time')) : null,
      quality_data: Object.keys(qualityData).length > 0 ? qualityData : null,
      updated_at: new Date().toISOString(),
    }
    const { error } = await supabase.from('monthly_metrics').upsert(payload, { onConflict: 'project_id,month' })
    setSaving(false)
    setMessage(error ? 'Error: ' + error.message : 'Monthly data saved!')
    setTimeout(() => setMessage(''), 3000)
  }

  const Field = ({ label, fieldKey, hint }) => (
    <TextField
      label={label}
      type="number"
      size="small"
      value={val(fieldKey)}
      onChange={e => set(fieldKey, e.target.value)}
      placeholder={hint}
      fullWidth
    />
  )

  const SectionHeader = ({ label, color = 'primary' }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
      <Typography variant="subtitle2" fontWeight={700} color={color}>{label}</Typography>
    </Box>
  )

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <CalendarMonthIcon color="primary" />
        <Typography variant="h6" fontWeight={700}>Monthly Data Entry</Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Record actual monthly metrics to power the Projects Dashboard charts.
      </Typography>

      <TextField
        label="Month"
        type="month"
        value={month}
        onChange={e => setMonth(e.target.value)}
        size="small"
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
      />

      <Divider sx={{ mb: 3 }} />

      {/* Row 1 — Satisfaction Scores */}
      <Box sx={{ mb: 3 }}>
        <SectionHeader label="Satisfaction Scores" />
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Field label="Customer cNPS" fieldKey="customer_cnps" hint="e.g. 65" />
          </Grid>
          <Grid item xs={6} sm={3}>
            <Field label="Employee eNPS" fieldKey="employee_enps" hint="e.g. 55" />
          </Grid>
          <Grid item xs={6} sm={3}>
            <Field label="Attrition %" fieldKey="employee_attrition" hint="e.g. 12" />
          </Grid>
          <Grid item xs={6} sm={3}>
            <Field label="Participation %" fieldKey="employee_participation" hint="e.g. 70" />
          </Grid>
        </Grid>
      </Box>

      {/* Row 2 — Productivity (only checked metrics) */}
      {selectedProductivity.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Divider sx={{ mb: 2 }} />
          <SectionHeader label="Productivity" />
          <Grid container spacing={2}>
            {selectedProductivity.map(m => (
              <Grid item xs={6} sm={3} key={m.key}>
                <Field
                  label={m.key === 'velocity' ? 'Velocity (story pts)' : 'Cycle time (days)'}
                  fieldKey={m.key}
                  hint={m.defaultHint}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Row 3 — Quality Metrics (only checked metrics) */}
      {selectedQuality.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Divider sx={{ mb: 2 }} />
          <SectionHeader label="Quality Metrics" />
          <Grid container spacing={2}>
            {selectedQuality.map(m => (
              <Grid item xs={6} sm={3} key={m.key}>
                <Field label={m.label} fieldKey={m.key} hint={m.defaultHint} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {selectedProductivity.length === 0 && selectedQuality.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontStyle: 'italic' }}>
          Select Health Metrics above to enable productivity and quality tracking here.
        </Typography>
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button variant="contained" onClick={handleSave} disabled={saving || !projectId}>
          {saving ? 'Saving...' : 'Save Monthly Data'}
        </Button>
        {message && (
          <Typography variant="body2" color={message.startsWith('Error') ? 'error' : 'success.main'}>
            {message}
          </Typography>
        )}
      </Box>
    </Paper>
  )
}
