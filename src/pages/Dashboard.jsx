import { useState, useEffect } from 'react'
import {
  Box, Container, Typography, CircularProgress, Grid, Paper, Chip,
  Tabs, Tab, Divider, Alert
} from '@mui/material'
import Navbar from '../components/Layout/Navbar'
import { supabase, supabaseReady } from '../lib/supabase'
import HealthMetricsChart from '../components/Dashboard/HealthMetricsChart'
import VelocityChart from '../components/Dashboard/VelocityChart'
import NFRCoverageChart from '../components/Dashboard/NFRCoverageChart'
import CustomerSatChart from '../components/Dashboard/CustomerSatChart'
import EmployeeSatChart from '../components/Dashboard/EmployeeSatChart'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'

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

  const selectedProjects = selectedTab === 0 ? projects : projects.filter((_, i) => i === selectedTab - 1)
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
            <strong>Supabase not connected.</strong> Add your project URL and anon key to <code>.env.local</code> and restart the dev server. See <strong>SETUP.md</strong> for instructions.
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

            {/* Charts */}
            <HealthMetricsChart projects={selectedProjects} metricsData={metricsData} />
            <VelocityChart projects={selectedProjects} monthlyData={monthlyData} />
            <NFRCoverageChart projects={selectedProjects} nfrData={nfrData} />
            <CustomerSatChart projects={selectedProjects} monthlyData={monthlyData} configData={configData} />
            <EmployeeSatChart projects={selectedProjects} monthlyData={monthlyData} configData={configData} />
          </>
        )}
      </Container>
    </Box>
  )
}
