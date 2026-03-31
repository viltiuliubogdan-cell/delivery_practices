import { Paper, Typography, Box, TextField } from '@mui/material'
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt'

export default function CustomerSatisfaction({ cnpsGoal, onChange }) {
  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <SentimentSatisfiedAltIcon color="primary" />
        <Typography variant="h6" fontWeight={700}>Customer Satisfaction</Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Define the Customer Net Promoter Score (cNPS) goal for this project. cNPS ranges from -100 to 100.
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        <Box
          sx={{
            p: 2, backgroundColor: '#e3f2fd', borderRadius: 2, border: '1px solid #90caf9',
            textAlign: 'center', minWidth: 120
          }}
        >
          <Typography variant="caption" color="primary" fontWeight={700}>BENCHMARK</Typography>
          <Typography variant="h5" fontWeight={700} color="primary">{'> 60'}</Typography>
          <Typography variant="caption" color="text.secondary">cNPS target</Typography>
        </Box>
        <Box>
          <TextField
            label="Customer cNPS Goal"
            type="number"
            value={cnpsGoal}
            onChange={e => onChange(e.target.value)}
            inputProps={{ min: -100, max: 100 }}
            placeholder="e.g. 60"
            helperText="Net Promoter Score from -100 (worst) to 100 (best)"
            sx={{ width: 240 }}
          />
        </Box>
      </Box>
    </Paper>
  )
}
