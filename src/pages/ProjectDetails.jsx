import { useState, useEffect } from 'react'
import { Box, Container, Alert } from '@mui/material'
import { supabase, supabaseReady } from '../lib/supabase'
import SaveBar from '../components/Layout/SaveBar'
import Navbar from '../components/Layout/Navbar'
import MarketAddedValue from '../components/ProjectDetails/MarketAddedValue'
import StakeholderMap from '../components/ProjectDetails/StakeholderMap'
import HealthMetrics, { HEALTH_METRICS } from '../components/ProjectDetails/HealthMetrics'
import ExecutionPractices from '../components/ProjectDetails/ExecutionPractices'
import NonFunctionalRequirements, { NFR_CATEGORIES } from '../components/ProjectDetails/NonFunctionalRequirements'
import CustomerSatisfaction from '../components/ProjectDetails/CustomerSatisfaction'
import EmployeeSatisfaction from '../components/ProjectDetails/EmployeeSatisfaction'
import MonthlyDataEntry from '../components/ProjectDetails/MonthlyDataEntry'

const initMetrics = () => Object.fromEntries(HEALTH_METRICS.map(m => [m.key, { selected: false, objective: '' }]))
const initNfrs = () => {
  const nfrs = {}
  NFR_CATEGORIES.forEach(cat => cat.items.forEach(item => { nfrs[item.key] = { selected: false, expectation: '' } }))
  return nfrs
}

export default function ProjectDetails() {
  const [saving, setSaving] = useState(false)
  const [projectId, setProjectId] = useState(null)
  const [projectName, setProjectName] = useState('')

  const [marketValue, setMarketValue] = useState('')
  const [stakeholders, setStakeholders] = useState([])
  const [metrics, setMetrics] = useState(initMetrics)
  const [nfrs, setNfrs] = useState(initNfrs)
  const [cnpsGoal, setCnpsGoal] = useState('')
  const [enpsGoal, setEnpsGoal] = useState('')
  const [attritionGoal, setAttritionGoal] = useState('')
  const [participationGoal, setParticipationGoal] = useState('')

  const resetForm = () => {
    setProjectId(null)
    setMarketValue('')
    setStakeholders([])
    setMetrics(initMetrics())
    setNfrs(initNfrs())
    setCnpsGoal('')
    setEnpsGoal('')
    setAttritionGoal('')
    setParticipationGoal('')
  }

  const loadProject = async (name) => {
    if (!name.trim()) return
    resetForm()
    const { data: projects } = await supabase
      .from('projects')
      .select('*')
      .ilike('name', name.trim())
      .limit(1)

    if (!projects?.length) return

    const p = projects[0]
    setProjectId(p.id)

    const [configRes, stakeholdersRes, metricsRes, nfrRes] = await Promise.all([
      supabase.from('project_config').select('*').eq('project_id', p.id).single(),
      supabase.from('stakeholders').select('*').eq('project_id', p.id),
      supabase.from('health_metric_configs').select('*').eq('project_id', p.id),
      supabase.from('nfr_configs').select('*').eq('project_id', p.id),
    ])

    if (configRes.data) {
      const c = configRes.data
      setMarketValue(c.market_added_value || '')
      setCnpsGoal(c.customer_cnps_goal ?? '')
      setEnpsGoal(c.employee_enps_goal ?? '')
      setAttritionGoal(c.employee_attrition_goal ?? '')
      setParticipationGoal(c.employee_participation_goal ?? '')
    }

    if (stakeholdersRes.data) {
      setStakeholders(stakeholdersRes.data.map(s => ({
        name: s.name, role: s.role, influence: s.influence, interest: s.interest, notes: s.notes
      })))
    }

    if (metricsRes.data?.length > 0) {
      const m = {}
      metricsRes.data.forEach(r => { m[r.metric_key] = { selected: r.is_selected, objective: r.objective || '' } })
      setMetrics(prev => ({ ...prev, ...m }))
    }

    if (nfrRes.data?.length > 0) {
      const n = {}
      nfrRes.data.forEach(r => { n[r.requirement_key] = { selected: r.is_selected, expectation: r.expectation || '' } })
      setNfrs(prev => ({ ...prev, ...n }))
    }
  }

  const handleSave = async () => {
    if (!projectName.trim()) return { error: 'Project name is required' }
    setSaving(true)
    try {
      let pid = projectId

      if (!pid) {
        // Check if project with this name already exists
        const { data: existing } = await supabase
          .from('projects')
          .select('id')
          .ilike('name', projectName.trim())
          .limit(1)

        if (existing?.length > 0) {
          pid = existing[0].id
          setProjectId(pid)
        } else {
          const { data, error } = await supabase
            .from('projects')
            .insert({ name: projectName.trim() })
            .select()
            .single()
          if (error) return { error: error.message }
          pid = data.id
          setProjectId(pid)
        }
      } else {
        await supabase.from('projects').update({ name: projectName.trim(), updated_at: new Date().toISOString() }).eq('id', pid)
      }

      await supabase.from('project_config').upsert({
        project_id: pid,
        market_added_value: marketValue,
        customer_cnps_goal: cnpsGoal !== '' ? Number(cnpsGoal) : null,
        employee_enps_goal: enpsGoal !== '' ? Number(enpsGoal) : null,
        employee_attrition_goal: attritionGoal !== '' ? Number(attritionGoal) : null,
        employee_participation_goal: participationGoal !== '' ? Number(participationGoal) : null,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'project_id' })

      await supabase.from('stakeholders').delete().eq('project_id', pid)
      if (stakeholders.length > 0) {
        await supabase.from('stakeholders').insert(stakeholders.map(s => ({ ...s, project_id: pid })))
      }

      const metricRows = HEALTH_METRICS.map(m => ({
        project_id: pid,
        metric_key: m.key,
        metric_label: m.label,
        metric_category: m.category,
        is_selected: metrics[m.key]?.selected || false,
        objective: metrics[m.key]?.objective || null,
        updated_at: new Date().toISOString(),
      }))
      await supabase.from('health_metric_configs').upsert(metricRows, { onConflict: 'project_id,metric_key' })

      const nfrRows = []
      NFR_CATEGORIES.forEach(cat => {
        cat.items.forEach(item => {
          nfrRows.push({
            project_id: pid,
            category: cat.category,
            requirement_key: item.key,
            requirement_label: item.label,
            is_selected: nfrs[item.key]?.selected || false,
            expectation: nfrs[item.key]?.expectation || null,
            updated_at: new Date().toISOString(),
          })
        })
      })
      await supabase.from('nfr_configs').upsert(nfrRows, { onConflict: 'project_id,requirement_key' })

      return {}
    } catch (err) {
      return { error: err.message }
    } finally {
      setSaving(false)
    }
  }

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Navbar />
      <SaveBar
        projectName={projectName}
        onProjectNameChange={setProjectName}
        onLoad={loadProject}
        onSave={handleSave}
        saving={saving}
        projectLoaded={!!projectId}
      />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {!supabaseReady && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            <strong>Supabase not connected.</strong> Add your credentials to <code>.env.local</code> and restart. See <strong>SETUP.md</strong>.
          </Alert>
        )}
        <MarketAddedValue value={marketValue} onChange={setMarketValue} />
        <HealthMetrics metrics={metrics} onChange={setMetrics} />
        <NonFunctionalRequirements nfrs={nfrs} onChange={setNfrs} />
        <CustomerSatisfaction cnpsGoal={cnpsGoal} onChange={setCnpsGoal} />
        <EmployeeSatisfaction
          enpsGoal={enpsGoal}
          attritionGoal={attritionGoal}
          participationGoal={participationGoal}
          onChange={(field, val) => {
            if (field === 'enps') setEnpsGoal(val)
            else if (field === 'attrition') setAttritionGoal(val)
            else if (field === 'participation') setParticipationGoal(val)
          }}
        />
        <MonthlyDataEntry projectId={projectId} />
        <StakeholderMap stakeholders={stakeholders} onChange={setStakeholders} />
        <ExecutionPractices />
      </Container>
    </Box>
  )
}
