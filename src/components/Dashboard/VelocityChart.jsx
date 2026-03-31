import { Paper, Typography } from '@mui/material'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const COLORS = ['#1565c0', '#c62828', '#2e7d32', '#e65100', '#6a1b9a', '#00838f', '#4e342e', '#37474f']

export default function VelocityChart({ projects, monthlyData }) {
  const months = [...new Set(monthlyData.map(m => m.month))].sort()
  const data = months.map(month => {
    const point = { month: month.slice(0, 7) }
    projects.forEach(p => {
      const entry = monthlyData.find(m => m.project_id === p.id && m.month === month)
      point[p.name] = entry?.velocity ?? null
    })
    return point
  })

  if (!data.length) return null

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" fontWeight={700} mb={3}>Velocity Evolution (Story Points/Sprint)</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
          <YAxis />
          <Tooltip />
          <Legend />
          {projects.map((p, i) => (
            <Line
              key={p.id}
              type="monotone"
              dataKey={p.name}
              stroke={COLORS[i % COLORS.length]}
              strokeWidth={2}
              dot={{ r: 4 }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  )
}
