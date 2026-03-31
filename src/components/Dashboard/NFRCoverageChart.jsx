import { Paper, Typography } from '@mui/material'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'

const COLORS = ['#1565c0', '#c62828', '#2e7d32', '#e65100', '#6a1b9a', '#00838f', '#4e342e', '#37474f']

const NFR_CATS = ['Performance', 'Scalability', 'Availability', 'Deployment Frequency', 'Usability & Accessibility', 'Portability', 'Monitoring']

export default function NFRCoverageChart({ projects, nfrData }) {
  const data = NFR_CATS.map(cat => {
    const point = { category: cat.length > 12 ? cat.slice(0, 12) + '…' : cat, fullName: cat }
    projects.forEach(p => {
      const catItems = nfrData.filter(n => n.project_id === p.id && n.category === cat)
      point[p.name] = catItems.filter(n => n.is_selected).length
    })
    return point
  })

  if (!nfrData.length) return null

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" fontWeight={700} mb={3}>Non-Functional Requirements Coverage by Category</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" />
          <YAxis label={{ value: 'NFRs selected', angle: -90, position: 'insideLeft', offset: 10 }} />
          <Tooltip formatter={(v, name) => [v, name]} labelFormatter={(l, payload) => payload?.[0]?.payload?.fullName || l} />
          <Legend />
          {projects.map((p, i) => (
            <Bar key={p.id} dataKey={p.name} fill={COLORS[i % COLORS.length]} radius={[3, 3, 0, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  )
}
