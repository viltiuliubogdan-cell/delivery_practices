import { useState, useEffect } from 'react'
import {
  Box, Container, Typography, CircularProgress, Grid, Paper, Chip,
  Tabs, Tab, Divider, Alert
} from '@mui/material'
import Navbar from '../components/Layout/Navbar'
import { supabase, supabaseReady } from '../lib/supabase'
import MetricLineChart from '../components/Dashboard/MetricLineChart'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'

const QUALITY_METRICS = [
  { key: 'unit_testing_coverage', label: 'Unit Testing Coverage', unit: '%' },
  { key: 'integration_testing', label: 'Integration Testing', unit: '%' },
  { key: 'automation_testing_coverage', label: 'Automation Testing Coverage', unit: '%' },
  { key: 'vulnerabilities_detected', label: 'Vulnerabilities Detected', unit: '' },
  { key: 'failed_releases', label: 'Failed Release % per Quarter', unit: '%' },
  { key: 'technical_depth', label: 'Technical Depth %', unit: '%' },
  { key: 'code_review', label: 'Code Review', unit: '%' },
  { key: 'ai_adoption', label: 'AI Adoption %', unit: '%' },
]

const PRODUCTIVITY_METRICS = [
  { key: 'velocity', label: 'Velocity', unit: '' },
  { key: 'cycle_time', label: 'Cycle Time', unit: ' days' },
]

function formatMonth(isoDate) {
  const d = new Date(isoDate)
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

function buildChartData(projects, monthlyData, getValue) {
  const months = [...new Set(monthlyData.map(m => m.month))].sort()
  return months.map(month => {
    const row = { month: formatMonth(month) }
    projects.forEach(p => {
      const entry = monthlyData.find(m => m.project_id === p.id && m.month === month)
      const val = entry != null ? getValue(entry) : null
      if (val != null) row[p.name] = val
    })
    return row
  })
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState([])
  const [metricsData, setMetricsData] = useState([])
  const [nfrData, setNfrData] = useState([])
  const [monthlyData, setMonthlyData] = useState([])
  const [configData, setConfigData] = useState([])
  const [selectedTab, setSelectedTab] = useState(0)

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    setLoading(true)
    const [projRes, metricsRes, nfrRes, monthlyRes, configRes] = await Promise.all([
      supabase.from('projects').select('*').order('created_at', { ascending: true }),
      supabase.from('health_metric_configs').select('*'),
      supabase.from('nfr_configs').select('*'),
      supabase.from('monthly_metrics').select('*').order('month', { ascending: true }),
      supabase.from('project_config').select('*'),
    ])
    setProjects(projRes.data || [])
    setMetricsData(metricsRes.data || [])
    setNfrData(nfrRes.data || [])
    setMonthlyData(monthlyRes.data || [])
    setConfigData(configRes.data || [])
    setLoading(false)
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  const filteredProjects = selectedTab === 0 ? projects : projects.filter((_, i) => i === selectedTab - 1)
  const noData = projects.length === 0

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Navbar />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <FolderOpenIcon color="primary" sx={{ fontSize: 36 }} />
          <Box>
            <Typography variant="h4" fontWeight={800}>Projects Dashboard</Typography>
            <Typography variant="body2" color="text.secondary">
              Aggregated view across all {projects.length} project{projects.length !== 1 ? 's' : ''}
            </Typography>
          </Box>
        </Box>

        {!supabaseReady && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            <strong>Supabase not connected.</strong> Add your project URL and anon key to <code>.env.local</code> and restart the dev server.
          </Alert>
        )}

        {noData ? (
          <Paper elevation={2} sx={{ p: 6, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">No project data yet.</Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              Project managers need to create and save their project details first.
            </Typography>
          </Paper>
        ) : (
          <>
            {/* Project Overview Cards */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
              {projects.map(p => {
                const config = configData.find(c => c.project_id === p.id)
                const selectedMetrics = metricsData.filter(m => m.project_id === p.id && m.is_selected).length
                const selectedNfrs = nfrData.filter(n => n.project_id === p.id && n.is_selected).length
                const latestMonthly = monthlyData.filter(m => m.project_id === p.id).slice(-1)[0]
                return (
                  <Grid item xs={12} sm={6} md={4} key={p.id}>
                    <Paper elevation={2} sx={{ p: 2.5, borderTop: '4px solid #1565c0', height: '100%' }}>
                      <Typography fontWeight={700} variant="subtitle1" noWrap>{p.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{p.pm_name}</Typography>
                      <Divider sx={{ my: 1 }} />
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                        <Chip label={`${selectedMetrics} health metrics`} size="small" color="primary" variant="outlined" />
                        <Chip label={`${selectedNfrs} NFRs`} size="small" color="secondary" variant="outlined" />
                        {config?.customer_cnps_goal != null && (
                          <Chip label={`cNPS goal: ${config.customer_cnps_goal}`} size="small" variant="outlined" />
                        )}
                        {latestMonthly?.velocity != null && (
                          <Chip label={`Velocity: ${latestMonthly.velocity}`} size="small" color="success" variant="outlined" />
                        )}
                      </Box>
                    </Paper>
                  </Grid>
                )
              })}
            </Grid>

            {/* Project Filter Tabs */}
            <Paper elevation={1} sx={{ mb: 3 }}>
              <Tabs
                value={selectedTab}
                onChange={(_, v) => setSelectedTab(v)}
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label="All Projects" />
                {projects.map(p => <Tab key={p.id} label={p.name} />)}
              </Tabs>
            </Paper>

            {/* Satisfaction Charts */}
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2, mt: 1 }}>Satisfaction</Typography>

            <MetricLineChart
              title="Customer cNPS"
              data={buildChartData(filteredProjects, monthlyData, e => e.customer_cnps)}
              projects={filteredProjects}
              unit=""
            />

            <MetricLineChart
              title="Employee eNPS"
              data={buildChartData(filteredProjects, monthlyData, e => e.employee_enps)}
              projects={filteredProjects}
              unit=""
            />

            <MetricLineChart
              title="Employee Attrition"
              data={buildChartData(filteredProjects, monthlyData, e => e.employee_attrition)}
              projects={filteredProjects}
              unit="%"
            />

            <MetricLineChart
              title="Employee Participation Rate"
              data={buildChartData(filteredProjects, monthlyData, e => e.employee_participation)}
              projects={filteredProjects}
              unit="%"
            />

            {/* Productivity Charts */}
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2, mt: 3 }}>Productivity</Typography>

            {PRODUCTIVITY_METRICS.map(metric => (
              <MetricLineChart
                key={metric.key}
                title={metric.label}
                data={buildChartData(filteredProjects, monthlyData, e => e[metric.key])}
                projects={filteredProjects}
                unit={metric.unit}
              />
            ))}

            {/* Quality Charts */}
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2, mt: 3 }}>Quality Metrics</Typography>

            {QUALITY_METRICS.map(metric => (
              <MetricLineChart
                key={metric.key}
                title={metric.label}
                data={buildChartData(filteredProjects, monthlyData, e => e.quality_data?.[metric.key] ?? null)}
                projects={filteredProjects}
                unit={metric.unit}
              />
            ))}
          </>
        )}
      </Container>
    </Box>
  )
}
