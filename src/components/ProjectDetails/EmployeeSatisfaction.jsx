import { Paper, Typography, Box, TextField, Grid } from '@mui/material'
import GroupIcon from '@mui/icons-material/Group'

export default function EmployeeSatisfaction({ enpsGoal, attritionGoal, participationGoal, onChange }) {
  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <GroupIcon color="primary" />
        <Typography variant="h6" fontWeight={700}>Employee Satisfaction</Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Set goals for employee engagement and retention metrics.
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Box sx={{ p: 2, backgroundColor: '#fce4ec', borderRadius: 2, border: '1px solid #f48fb1', mb: 1 }}>
            <Typography variant="caption" color="error" fontWeight={700}>BENCHMARK</Typography>
            <Typography variant="h5" fontWeight={700} color="error">{'> 60'}</Typography>
            <Typography variant="caption" color="text.secondary">eNPS target</Typography>
          </Box>
          <TextField
            label="Employee eNPS Goal"
            type="number"
            value={enpsGoal}
            onChange={e => onChange('enps', e.target.value)}
            inputProps={{ min: -100, max: 100 }}
            placeholder="e.g. 60"
            helperText="Employee Net Promoter Score"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box sx={{ p: 2, backgroundColor: '#fff8e1', borderRadius: 2, border: '1px solid #ffe082', mb: 1 }}>
            <Typography variant="caption" color="warning.dark" fontWeight={700}>BENCHMARK</Typography>
            <Typography variant="h5" fontWeight={700} color="warning.dark">{'< 17%'}</Typography>
            <Typography variant="caption" color="text.secondary">Attrition target</Typography>
          </Box>
          <TextField
            label="Attrition Goal (%)"
            type="number"
            value={attritionGoal}
            onChange={e => onChange('attrition', e.target.value)}
            inputProps={{ min: 0, max: 100 }}
            placeholder="e.g. 17"
            helperText="Target annual attrition rate (%)"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box sx={{ p: 2, backgroundColor: '#e8f5e9', borderRadius: 2, border: '1px solid #a5d6a7', mb: 1 }}>
            <Typography variant="caption" color="success.dark" fontWeight={700}>BENCHMARK</Typography>
            <Typography variant="h5" fontWeight={700} color="success.dark">{'> 50%'}</Typography>
            <Typography variant="caption" color="text.secondary">Participation rate</Typography>
          </Box>
          <TextField
            label="Survey Participation Goal (%)"
            type="number"
            value={participationGoal}
            onChange={e => onChange('participation', e.target.value)}
            inputProps={{ min: 0, max: 100 }}
            placeholder="e.g. 50"
            helperText="Target survey participation rate (%)"
            fullWidth
          />
        </Grid>
      </Grid>
    </Paper>
  )
}
