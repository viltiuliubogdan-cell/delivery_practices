import { Paper, Typography, Box, Checkbox, FormControlLabel, TextField, Divider } from '@mui/material'
import SecurityIcon from '@mui/icons-material/Security'

export const NFR_CATEGORIES = [
  {
    category: 'Performance',
    items: [
      { key: 'perf_response_time', label: 'Response time' },
      { key: 'perf_throughput', label: 'Throughput (transactions per second)' },
      { key: 'perf_resource_limits', label: 'Resource usage limits (CPU, memory, disk)' },
    ]
  },
  {
    category: 'Scalability',
    items: [
      { key: 'scale_concurrency', label: 'Concurrency' },
      { key: 'scale_data_volume', label: 'Data volume growth projection' },
    ]
  },
  {
    category: 'Availability',
    items: [
      { key: 'avail_uptime_sla', label: 'Uptime SLA' },
      { key: 'avail_planned_maintenance', label: 'Acceptable planned maintenance window' },
      { key: 'avail_mttr', label: 'Mean time to recovery (MTTR)' },
    ]
  },
  {
    category: 'Deployment Frequency',
    items: [
      { key: 'deploy_frequency', label: 'Deployment frequency target' },
    ]
  },
  {
    category: 'Usability & Accessibility',
    items: [
      { key: 'ux_accessibility_standards', label: 'Accessibility standards (WCAG level)' },
      { key: 'ux_device_browser', label: 'Device & browser support' },
    ]
  },
  {
    category: 'Portability',
    items: [
      { key: 'port_target_infra', label: 'Target infrastructure' },
      { key: 'port_containerization', label: 'Containerization requirements' },
    ]
  },
  {
    category: 'Monitoring',
    items: [
      { key: 'mon_logging', label: 'Logging requirements' },
      { key: 'mon_thresholds', label: 'Monitoring thresholds & alerting' },
    ]
  },
]

export default function NonFunctionalRequirements({ nfrs, onChange }) {
  const getNfr = (key) => nfrs[key] || { selected: false, expectation: '' }

  const toggleSelected = (key) => {
    const current = getNfr(key)
    onChange({ ...nfrs, [key]: { ...current, selected: !current.selected } })
  }

  const setExpectation = (key, value) => {
    const current = getNfr(key)
    onChange({ ...nfrs, [key]: { ...current, expectation: value } })
  }

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <SecurityIcon color="primary" />
        <Typography variant="h6" fontWeight={700}>Non-Functional Requirements</Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Select the non-functional requirements applicable to your project and define the expected targets.
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {NFR_CATEGORIES.map((cat, ci) => (
          <Box key={cat.category}>
            {ci > 0 && <Divider sx={{ my: 2 }} />}
            <Typography variant="subtitle2" fontWeight={700} color="primary" sx={{ mb: 1.5 }}>
              {cat.category}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {cat.items.map(item => {
                const nfr = getNfr(item.key)
                return (
                  <Box key={item.key} sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={nfr.selected}
                          onChange={() => toggleSelected(item.key)}
                          color="primary"
                          size="small"
                        />
                      }
                      label={<Typography variant="body2" fontWeight={nfr.selected ? 600 : 400}>{item.label}</Typography>}
                      sx={{ minWidth: 320, m: 0 }}
                    />
                    {nfr.selected && (
                      <TextField
                        size="small"
                        placeholder="Define your expectation / target..."
                        value={nfr.expectation}
                        onChange={e => setExpectation(item.key, e.target.value)}
                        sx={{ minWidth: 300, flexGrow: 1 }}
                      />
                    )}
                  </Box>
                )
              })}
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  )
}
