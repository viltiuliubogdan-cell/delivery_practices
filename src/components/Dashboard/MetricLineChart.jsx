import { Paper, Typography, Box } from '@mui/material'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, ReferenceLine
} from 'recharts'

const COLORS = ['#1565c0', '#c62828', '#2e7d32', '#e65100', '#6a1b9a', '#00838f', '#4e342e', '#37474f', '#ad1457', '#00695c']

export default function MetricLineChart({ title, data, projects, unit = '', referenceValue = null }) {
  if (!data.length) return null

  // Only include projects that have at least one non-null value
  const activeProjects = projects.filter(p =>
    data.some(d => d[p.name] != null)
  )
  if (!activeProjects.length) return null

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="subtitle1" fontWeight={700} mb={2.5}>{title}</Typography>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 5, right: 24, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
          <YAxis
            tickFormatter={v => unit ? `${v}${unit}` : v}
            tick={{ fontSize: 11 }}
            width={42}
          />
          <Tooltip formatter={(v, name) => [`${v}${unit}`, name]} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {referenceValue != null && (
            <ReferenceLine y={referenceValue} stroke="#999" strokeDasharray="4 4" label={{ value: `target ${referenceValue}${unit}`, fontSize: 10, fill: '#999' }} />
          )}
          {activeProjects.map((p, i) => (
            <Line
              key={p.id}
              type="monotone"
              dataKey={p.name}
              stroke={COLORS[i % COLORS.length]}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  )
}
