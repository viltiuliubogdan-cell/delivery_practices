import { Paper, Typography, Box } from '@mui/material'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function HealthMetricsChart({ projects, metricsData }) {
  const data = projects.map(p => {
    const pMetrics = metricsData.filter(m => m.project_id === p.id && m.is_selected)
    const quality = pMetrics.filter(m => m.metric_category === 'Quality').length
    const productivity = pMetrics.filter(m => m.metric_category === 'Productivity').length
    return { name: p.name, Quality: quality, Productivity: productivity }
  })

  if (!data.length) return null

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" fontWeight={700} mb={3}>Health Metrics Coverage by Project</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis label={{ value: 'Metrics selected', angle: -90, position: 'insideLeft', offset: 10 }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="Quality" fill="#1565c0" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Productivity" fill="#4caf50" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  )
}
