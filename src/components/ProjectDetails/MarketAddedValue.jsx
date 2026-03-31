import { Paper, Typography, TextField, Box } from '@mui/material'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'

export default function MarketAddedValue({ value, onChange }) {
  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <TrendingUpIcon color="primary" />
        <Typography variant="h6" fontWeight={700}>Market Added Value</Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Describe the business value and impact of this product/project.
      </Typography>
      <TextField
        fullWidth
        multiline
        minRows={4}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="e.g. €2.5M revenue generated last year, 50,000 transactions/day, 2,000 requests/minute processed, serving 120,000 active users monthly"
        variant="outlined"
      />
    </Paper>
  )
}
