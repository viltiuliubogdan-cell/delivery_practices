import { useState, useRef, useEffect } from 'react'
import {
  Box, Fab, Paper, Typography, TextField, IconButton, Avatar,
  CircularProgress, Fade, Divider
} from '@mui/material'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import CloseIcon from '@mui/icons-material/Close'
import SendIcon from '@mui/icons-material/Send'
import PersonIcon from '@mui/icons-material/Person'

const WELCOME = "Hi, I'm Alex — your senior PM advisor. Ask me anything about project management: risk mitigation, stakeholder communication, velocity, team health, delivery practices, and more. How can I help?"

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: 'assistant', content: WELCOME }])
    }
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')

    const userMsg = { role: 'user', content: text }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated.filter(m => m.role !== 'assistant' || m !== messages[0]) }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.content || data.error || 'Sorry, something went wrong.' }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <>
      {/* Floating button */}
      <Fade in={!open}>
        <Fab
          onClick={() => setOpen(true)}
          sx={{
            position: 'fixed', bottom: 32, right: 32, zIndex: 1300,
            backgroundColor: '#1565c0', color: 'white',
            '&:hover': { backgroundColor: '#0d47a1' },
            width: 64, height: 64, boxShadow: '0 4px 20px rgba(21,101,192,0.5)',
          }}
        >
          <SmartToyIcon sx={{ fontSize: 30 }} />
        </Fab>
      </Fade>

      {/* Chat window */}
      <Fade in={open}>
        <Paper
          elevation={8}
          sx={{
            position: 'fixed', bottom: 32, right: 32, zIndex: 1300,
            width: { xs: 'calc(100vw - 32px)', sm: 400 },
            height: 560,
            display: open ? 'flex' : 'none',
            flexDirection: 'column',
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <Box sx={{ backgroundColor: '#1565c0', px: 2, py: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ backgroundColor: '#0d47a1', width: 36, height: 36 }}>
              <SmartToyIcon fontSize="small" />
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography fontWeight={700} color="white" variant="body1" lineHeight={1.2}>Alex</Typography>
              <Typography variant="caption" color="rgba(255,255,255,0.75)">Senior PM Advisor · AI</Typography>
            </Box>
            <IconButton size="small" onClick={() => setOpen(false)} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Messages */}
          <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 1.5, backgroundColor: '#f8f9fb' }}>
            {messages.map((m, i) => (
              <Box key={i} sx={{ display: 'flex', gap: 1, flexDirection: m.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-start' }}>
                <Avatar
                  sx={{
                    width: 28, height: 28, flexShrink: 0,
                    backgroundColor: m.role === 'user' ? '#4caf50' : '#1565c0',
                  }}
                >
                  {m.role === 'user' ? <PersonIcon sx={{ fontSize: 16 }} /> : <SmartToyIcon sx={{ fontSize: 16 }} />}
                </Avatar>
                <Box
                  sx={{
                    maxWidth: '78%',
                    backgroundColor: m.role === 'user' ? '#4caf50' : 'white',
                    color: m.role === 'user' ? 'white' : 'text.primary',
                    px: 1.5, py: 1,
                    borderRadius: m.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  }}
                >
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                    {m.content}
                  </Typography>
                </Box>
              </Box>
            ))}
            {loading && (
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Avatar sx={{ width: 28, height: 28, backgroundColor: '#1565c0' }}>
                  <SmartToyIcon sx={{ fontSize: 16 }} />
                </Avatar>
                <Box sx={{ backgroundColor: 'white', px: 2, py: 1, borderRadius: '4px 16px 16px 16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <CircularProgress size={14} />
                </Box>
              </Box>
            )}
            <div ref={bottomRef} />
          </Box>

          {/* Input */}
          <Divider />
          <Box sx={{ p: 1.5, display: 'flex', gap: 1, alignItems: 'flex-end', backgroundColor: 'white' }}>
            <TextField
              fullWidth
              multiline
              maxRows={3}
              size="small"
              placeholder="Ask about risks, velocity, stakeholders…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              variant="outlined"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />
            <IconButton
              onClick={send}
              disabled={!input.trim() || loading}
              sx={{ backgroundColor: '#1565c0', color: 'white', '&:hover': { backgroundColor: '#0d47a1' }, '&.Mui-disabled': { backgroundColor: '#e0e0e0' }, borderRadius: 2, p: 1 }}
            >
              <SendIcon fontSize="small" />
            </IconButton>
          </Box>
        </Paper>
      </Fade>
    </>
  )
}
