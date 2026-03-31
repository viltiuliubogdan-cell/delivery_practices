import { Paper, Typography, Box, TextField, Grid, Button, Divider } from '@mui/material'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function MonthlyDataEntry({ projectId }) {
  const [month, setMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })
  const [data, setData] = useState({ customer_cnps: '', employee_enps: '', employee_attrition: '', employee_participation: '', velocity: '', cycle_time: '' })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const handleSave = async () => {
    if (!projectId) return
    setSaving(true)
    const monthDate = `${month}-01`
    const payload = {
      project_id: projectId,
      month: monthDate,
      customer_cnps: data.customer_cnps !== '' ? Number(data.customer_cnps) : null,
      employee_enps: data.employee_enps !== '' ? Number(data.employee_enps) : null,
      employee_attrition: data.employee_attrition !== '' ? Number(data.employee_attrition) : null,
      employee_participation: data.employee_participation !== '' ? Number(data.employee_participation) : null,
      velocity: data.velocity !== '' ? Number(data.velocity) : null,
      cycle_time: data.cycle_time !== '' ? Number(data.cycle_time) : null,
      updated_at: new Date().toISOString(),
    }
    const { error } = await supabase.from('monthly_metrics').upsert(payload, { onConflict: 'project_id,month' })
    setSaving(false)
    setMessage(error ? 'Error: ' + error.message : 'Monthly data saved!')
    setTimeout(() => setMessage(''), 3000)
  }

  const field = (label, key, hint) => (
    <TextField
      label={label}
      type="number"
      size="small"
      value={data[key]}
      onChange={e => setData(d => ({ ...d, [key]: e.target.value }))}
      placeholder={hint}
      fullWidth
    />
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
      <Box sx={{ mb: 3 }}>
        <TextField
          label="Month"
          type="month"
          value={month}
          onChange={e => setMonth(e.target.value)}
          size="small"
          InputLabelProps={{ shrink: true }}
        />
      </Box>
      <Divider sx={{ mb: 3 }} />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="subtitle2" fontWeight={700} color="primary" sx={{ mb: 1 }}>Satisfaction Scores</Typography>
        </Grid>
        <Grid item xs={12} sm={4}>{field('Customer cNPS (actual)', 'customer_cnps', 'e.g. 65')}</Grid>
        <Grid item xs={12} sm={4}>{field('Employee eNPS (actual)', 'employee_enps', 'e.g. 55')}</Grid>
        <Grid item xs={12} sm={4}>{field('Attrition % (actual)', 'employee_attrition', 'e.g. 12')}</Grid>
        <Grid item xs={12} sm={4}>{field('Participation % (actual)', 'employee_participation', 'e.g. 70')}</Grid>
        <Grid item xs={12}>
          <Divider sx={{ my: 1 }} />
          <Typography variant="subtitle2" fontWeight={700} color="primary" sx={{ mt: 1, mb: 1 }}>Productivity</Typography>
        </Grid>
        <Grid item xs={12} sm={4}>{field('Velocity (story points)', 'velocity', 'e.g. 42')}</Grid>
        <Grid item xs={12} sm={4}>{field('Cycle time (days)', 'cycle_time', 'e.g. 2.5')}</Grid>
      </Grid>
      <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button variant="contained" onClick={handleSave} disabled={saving || !projectId}>
          {saving ? 'Saving...' : 'Save Monthly Data'}
        </Button>
        {message && <Typography variant="body2" color={message.startsWith('Error') ? 'error' : 'success.main'}>{message}</Typography>}
      </Box>
    </Paper>
  )
}
