/**
 * useDuelSocket — custom React hook that manages a WebSocket duel connection.
 *
 * Why a custom hook?
 * React hooks let you extract stateful logic out of components into reusable functions.
 * The DuelPage component doesn't need to know HOW the socket works — it just calls
 * this hook and gets back the state and actions it needs.
 *
 * State machine:
 *   idle → queued → active → finished
 */

import { useState, useEffect, useRef, useCallback } from 'react'

export function useDuelSocket(language) {
  const [status, setStatus] = useState('idle')        // idle | queued | active | finished
  const [problem, setProblem] = useState(null)        // { title, description, starterCode }
  const [opponentName, setOpponentName] = useState('')
  const [result, setResult] = useState(null)          // { winner, youWon, forfeit, disconnect }
  const [submitResult, setSubmitResult] = useState(null) // { passed, stdout } on wrong attempt
  const [opponentSubmitted, setOpponentSubmitted] = useState(false)

  // useRef stores the WebSocket instance without causing re-renders when it changes.
  // If we used useState, every time the socket connected/disconnected the component would re-render.
  const wsRef = useRef(null)

  // connect: establish the WebSocket and join the matchmaking queue
  const connect = useCallback(() => {
    const token = localStorage.getItem('cq_token')
    if (!token) return

    // Build the WebSocket URL from the environment variable.
    // VITE_WS_URL should be "wss://your-backend.onrender.com" in production.
    // In dev it falls back to localhost. Note: HTTPS sites require "wss://" (encrypted),
    // the same way HTTP sites use "ws://". Mixing them causes a browser security error.
    const wsBase = import.meta.env.VITE_WS_URL || 'ws://localhost:5000'
    const ws = new WebSocket(`${wsBase}/ws/duel?token=${token}`)
    wsRef.current = ws

    ws.onopen = () => {
      // Once connected, immediately join the queue for the chosen language
      ws.send(JSON.stringify({ type: 'join_queue', language }))
      setStatus('queued')
    }

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data)

      if (msg.type === 'queued') {
        setStatus('queued')
      }

      if (msg.type === 'duel_start') {
        setProblem(msg.problem)
        setOpponentName(msg.opponentName)
        setStatus('active')
      }

      if (msg.type === 'submit_result') {
        // Wrong answer — update output but stay in active state so they can retry
        setSubmitResult({ passed: false, stdout: msg.stdout })
      }

      if (msg.type === 'opponent_submitted') {
        setOpponentSubmitted(true)
        // Reset after 3s so the indicator doesn't stay forever
        setTimeout(() => setOpponentSubmitted(false), 3000)
      }

      if (msg.type === 'duel_result') {
        setResult(msg)
        setStatus('finished')
      }

      if (msg.type === 'error') {
        console.error('Duel socket error:', msg.message)
        setStatus('idle')
      }
    }

    ws.onclose = () => {
      if (status !== 'finished') setStatus('idle')
    }
  }, [language, status])

  // submit: send code to the server for evaluation
  const submit = useCallback((code) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      setSubmitResult(null) // clear previous result
      wsRef.current.send(JSON.stringify({ type: 'submit', code }))
    }
  }, [])

  // forfeit: give up the duel
  const forfeit = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'forfeit' }))
    }
  }, [])

  // Cleanup: close the socket when the component unmounts
  // The return value of useEffect is a cleanup function — React calls it automatically
  useEffect(() => {
    return () => {
      wsRef.current?.close()
    }
  }, [])

  return { status, problem, opponentName, result, submitResult, opponentSubmitted, connect, submit, forfeit }
}
