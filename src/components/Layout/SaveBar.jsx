import {
  AppBar, Toolbar, TextField, Button, Box, CircularProgress,
  Snackbar, Alert, Chip, Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions
} from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import SearchIcon from '@mui/icons-material/Search'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useState } from 'react'

export default function SaveBar({ projectName, onProjectNameChange, onLoad, onSave, onDelete, saving, projectLoaded }) {
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const handleLoad = async () => {
    if (!projectName.trim()) return
    setLoading(true)
    await onLoad(projectName)
    setLoading(false)
    setSnackbar({ open: true, message: `Project "${projectName}" loaded.`, severity: 'info' })
  }

  const handleSave = async () => {
    const result = await onSave()
    if (result?.error) {
      setSnackbar({ open: true, message: 'Error saving: ' + result.error, severity: 'error' })
    } else {
      setSnackbar({ open: true, message: 'Project saved successfully!', severity: 'success' })
    }
  }

  const handleDeleteConfirm = async () => {
    setConfirmOpen(false)
    setDeleting(true)
    const result = await onDelete()
    setDeleting(false)
    if (result?.error) {
      setSnackbar({ open: true, message: 'Error deleting: ' + result.error, severity: 'error' })
    } else {
      setSnackbar({ open: true, message: 'Project deleted.', severity: 'success' })
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleLoad()
  }

  return (
    <>
      <AppBar position="sticky" sx={{ top: 0, zIndex: 1100, backgroundColor: '#283593' }}>
        <Toolbar sx={{ gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
            <TextField
              value={projectName}
              onChange={e => onProjectNameChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter project name..."
              variant="outlined"
              size="small"
              required
              sx={{
                minWidth: 260,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                  '&:hover fieldset': { borderColor: 'white' },
                },
                '& .MuiInputBase-input': { color: 'white' },
                '& .MuiInputBase-input::placeholder': { color: 'rgba(255,255,255,0.7)' },
              }}
            />
            <Button
              variant="outlined"
              startIcon={loading ? <CircularProgress size={14} color="inherit" /> : <SearchIcon />}
              onClick={handleLoad}
              disabled={loading || !projectName.trim()}
              size="small"
              sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.6)', '&:hover': { borderColor: 'white' }, whiteSpace: 'nowrap' }}
            >
              Load
            </Button>
            {projectLoaded && (
              <Chip
                icon={<CheckCircleIcon sx={{ color: '#a5d6a7 !important' }} />}
                label="Loaded"
                size="small"
                sx={{ backgroundColor: 'rgba(76,175,80,0.25)', color: '#a5d6a7', border: '1px solid rgba(165,214,167,0.4)' }}
              />
            )}
          </Box>
          {projectLoaded && (
            <Button
              variant="outlined"
              startIcon={deleting ? <CircularProgress size={16} color="inherit" /> : <DeleteIcon />}
              onClick={() => setConfirmOpen(true)}
              disabled={deleting || saving}
              size="small"
              sx={{
                color: '#ef9a9a', borderColor: 'rgba(239,154,154,0.6)',
                '&:hover': { borderColor: '#ef9a9a', backgroundColor: 'rgba(239,154,154,0.1)' },
                whiteSpace: 'nowrap',
              }}
            >
              Delete Project
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
            onClick={handleSave}
            disabled={saving || !projectName.trim()}
            sx={{ backgroundColor: '#4caf50', '&:hover': { backgroundColor: '#388e3c' }, fontWeight: 700, px: 3 }}
          >
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </Toolbar>
      </AppBar>

      {/* Confirm Delete Dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight={700} sx={{ color: '#c62828' }}>
          Delete Project
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to permanently delete <strong>"{projectName}"</strong>? This will remove all saved data including health metrics, NFRs, stakeholders, and monthly data. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteConfirm}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  )
}
