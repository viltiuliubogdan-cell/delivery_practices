import {
  Paper, Typography, Box, Button, Grid, Chip, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, MenuItem, IconButton, Table,
  TableBody, TableCell, TableHead, TableRow, Select, FormControl, InputLabel
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import PeopleIcon from '@mui/icons-material/People'
import { useState } from 'react'

const LEVELS = ['High', 'Medium', 'Low']

const QUADRANTS = [
  { influence: 'High', interest: 'High', label: 'Manage Closely', color: '#1565c0', bg: '#e3f2fd' },
  { influence: 'High', interest: 'Low', label: 'Keep Satisfied', color: '#6a1b9a', bg: '#f3e5f5' },
  { influence: 'Low', interest: 'High', label: 'Keep Informed', color: '#2e7d32', bg: '#e8f5e9' },
  { influence: 'Low', interest: 'Low', label: 'Monitor', color: '#e65100', bg: '#fff3e0' },
]

const emptyStakeholder = { name: '', role: '', influence: 'Medium', interest: 'Medium', notes: '' }

export default function StakeholderMap({ stakeholders, onChange }) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyStakeholder)

  const openAdd = () => { setEditing(null); setForm(emptyStakeholder); setDialogOpen(true) }
  const openEdit = (s, i) => { setEditing(i); setForm({ ...s }); setDialogOpen(true) }

  const handleSave = () => {
    if (!form.name.trim()) return
    if (editing !== null) {
      const updated = [...stakeholders]
      updated[editing] = form
      onChange(updated)
    } else {
      onChange([...stakeholders, form])
    }
    setDialogOpen(false)
  }

  const handleDelete = (i) => {
    onChange(stakeholders.filter((_, idx) => idx !== i))
  }

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PeopleIcon color="primary" />
          <Typography variant="h6" fontWeight={700}>Stakeholders View</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd} size="small">
          Add Stakeholder
        </Button>
      </Box>

      {/* 2x2 Matrix */}
      <Grid container spacing={1} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', mb: 0.5 }}>
            <Box sx={{ width: 80 }} />
            <Box sx={{ flex: 1, textAlign: 'center' }}>
              <Typography variant="caption" fontWeight={700} color="text.secondary">HIGH INTEREST</Typography>
            </Box>
            <Box sx={{ flex: 1, textAlign: 'center' }}>
              <Typography variant="caption" fontWeight={700} color="text.secondary">LOW INTEREST</Typography>
            </Box>
          </Box>
        </Grid>
        {QUADRANTS.map((q) => (
          <Grid item xs={6} key={`${q.influence}-${q.interest}`}>
            <Box
              sx={{
                backgroundColor: q.bg, border: `2px solid ${q.color}`, borderRadius: 2,
                p: 1.5, minHeight: 120
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="caption" fontWeight={700} color={q.color}>{q.label}</Typography>
                <Chip label={`${q.influence} Influence`} size="small" sx={{ fontSize: '0.6rem', bgcolor: q.color, color: 'white' }} />
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {stakeholders
                  .filter(s => s.influence === q.influence && s.interest === q.interest)
                  .map((s, i) => (
                    <Chip key={i} label={s.name} size="small" variant="outlined" sx={{ borderColor: q.color, color: q.color }} />
                  ))}
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Stakeholder Table */}
      {stakeholders.length > 0 && (
        <Table size="small">
          <TableHead>
            <TableRow sx={{ '& th': { fontWeight: 700, backgroundColor: '#f5f5f5' } }}>
              <TableCell>Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Influence</TableCell>
              <TableCell>Interest</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stakeholders.map((s, i) => (
              <TableRow key={i} hover>
                <TableCell fontWeight={600}>{s.name}</TableCell>
                <TableCell>{s.role}</TableCell>
                <TableCell><Chip label={s.influence} size="small" color={s.influence === 'High' ? 'error' : s.influence === 'Medium' ? 'warning' : 'default'} /></TableCell>
                <TableCell><Chip label={s.interest} size="small" color={s.interest === 'High' ? 'primary' : s.interest === 'Medium' ? 'info' : 'default'} /></TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.notes}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => openEdit(s, i)}><EditIcon fontSize="small" /></IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(i)}><DeleteIcon fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={700}>{editing !== null ? 'Edit Stakeholder' : 'Add Stakeholder'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField label="Name *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} fullWidth />
          <TextField label="Role" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} fullWidth />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Influence</InputLabel>
              <Select value={form.influence} label="Influence" onChange={e => setForm(f => ({ ...f, influence: e.target.value }))}>
                {LEVELS.map(l => <MenuItem key={l} value={l}>{l}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Interest</InputLabel>
              <Select value={form.interest} label="Interest" onChange={e => setForm(f => ({ ...f, interest: e.target.value }))}>
                {LEVELS.map(l => <MenuItem key={l} value={l}>{l}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>
          <TextField label="Notes" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} fullWidth multiline rows={2} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={!form.name.trim()}>Save</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  )
}
