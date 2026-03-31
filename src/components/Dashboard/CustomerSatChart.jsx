import { Paper, Typography } from '@mui/material'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts'

const COLORS = ['#1565c0', '#c62828', '#2e7d32', '#e65100', '#6a1b9a', '#00838f', '#4e342e', '#37474f']

export default function CustomerSatChart({ projects, monthlyData, configData }) {
  const months = [...new Set(monthlyData.map(m => m.month))].sort()
  const data = months.map(month => {
    const point = { month: month.slice(0, 7) }
    projects.forEach(p => {
      const entry = monthlyData.find(m => m.project_id === p.id && m.month === month)
      if (entry?.customer_cnps != null) point[p.name] = entry.customer_cnps
      const config = configData.find(c => c.project_id === p.id)
      if (config?.customer_cnps_goal != null) point[`${p.name} (goal)`] = config.customer_cnps_goal
    })
    return point
  })

  if (!data.length) return null

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" fontWeight={700} mb={3}>Customer Satisfaction — cNPS Evolution</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
          <YAxis domain={[-100, 100]} />
          <Tooltip />
          <Legend />
          <ReferenceLine y={0} stroke="#999" strokeDasharray="3 3" />
          {projects.map((p, i) => (
            <>
              <Line key={p.id} type="monotone" dataKey={p.name} stroke={COLORS[i % COLORS.length]} strokeWidth={2} dot={{ r: 4 }} connectNulls />
              <Line key={`${p.id}-goal`} type="monotone" dataKey={`${p.name} (goal)`} stroke={COLORS[i % COLORS.length]} strokeDasharray="5 5" strokeWidth={1} dot={false} connectNulls />
            </>
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  )
}
