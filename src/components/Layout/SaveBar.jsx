import { AppBar, Toolbar, TextField, Button, Box, CircularProgress, Snackbar, Alert } from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import { useState } from 'react'

export default function SaveBar({ projectName, onProjectNameChange, onSave, saving }) {
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  const handleSave = async () => {
    const result = await onSave()
    if (result?.error) {
      setSnackbar({ open: true, message: 'Error saving: ' + result.error, severity: 'error' })
    } else {
      setSnackbar({ open: true, message: 'Project saved successfully!', severity: 'success' })
    }
  }

  return (
    <>
      <AppBar position="sticky" sx={{ top: 0, zIndex: 1100, backgroundColor: '#283593' }}>
        <Toolbar sx={{ gap: 2 }}>
          <Box sx={{ flexGrow: 1 }}>
            <TextField
              value={projectName}
              onChange={e => onProjectNameChange(e.target.value)}
              placeholder="Project Name *"
              variant="outlined"
              size="small"
              required
              sx={{
                minWidth: 280,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                  '&:hover fieldset': { borderColor: 'white' },
                },
                '& .MuiInputBase-input::placeholder': { color: 'rgba(255,255,255,0.7)' },
                '& .MuiInputBase-input': { color: 'white' },
              }}
            />
          </Box>
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
