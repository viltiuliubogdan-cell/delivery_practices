import { Paper, Typography, Grid } from '@mui/material'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const COLORS = ['#1565c0', '#c62828', '#2e7d32', '#e65100', '#6a1b9a', '#00838f', '#4e342e', '#37474f']

export default function EmployeeSatChart({ projects, monthlyData, configData }) {
  const months = [...new Set(monthlyData.map(m => m.month))].sort()

  const enpsData = months.map(month => {
    const point = { month: month.slice(0, 7) }
    projects.forEach(p => {
      const entry = monthlyData.find(m => m.project_id === p.id && m.month === month)
      if (entry?.employee_enps != null) point[p.name] = entry.employee_enps
      const config = configData.find(c => c.project_id === p.id)
      if (config?.employee_enps_goal != null) point[`${p.name} goal`] = config.employee_enps_goal
    })
    return point
  })

  const attritionData = months.map(month => {
    const point = { month: month.slice(0, 7) }
    projects.forEach(p => {
      const entry = monthlyData.find(m => m.project_id === p.id && m.month === month)
      if (entry?.employee_attrition != null) point[p.name] = entry.employee_attrition
      const config = configData.find(c => c.project_id === p.id)
      if (config?.employee_attrition_goal != null) point[`${p.name} goal`] = config.employee_attrition_goal
    })
    return point
  })

  if (!enpsData.length) return null

  const Chart = ({ data, title, domain }) => (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" fontWeight={700} mb={3}>{title}</Typography>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
          <YAxis domain={domain} />
          <Tooltip />
          <Legend />
          {projects.map((p, i) => (
            <>
              <Line key={p.id} type="monotone" dataKey={p.name} stroke={COLORS[i % COLORS.length]} strokeWidth={2} dot={{ r: 4 }} connectNulls />
              <Line key={`${p.id}-g`} type="monotone" dataKey={`${p.name} goal`} stroke={COLORS[i % COLORS.length]} strokeDasharray="5 5" strokeWidth={1} dot={false} connectNulls />
            </>
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  )

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Chart data={enpsData} title="Employee eNPS Evolution" domain={[-100, 100]} />
      </Grid>
      <Grid item xs={12} md={6}>
        <Chart data={attritionData} title="Attrition Rate Evolution (%)" domain={[0, 50]} />
      </Grid>
    </Grid>
  )
}
