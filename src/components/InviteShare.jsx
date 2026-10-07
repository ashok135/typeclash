'use client'

import React, { useState } from 'react'

export default function InviteShare({ roomCode }) {
  const [copiedLink, setCopiedLink] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode)
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
    } catch (e) {}
  }

  const handleCopyLink = async () => {
    try {
      const url = `${window.location.origin}?room=${roomCode}`
      await navigator.clipboard.writeText(url)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
    } catch (e) {}
  }

  return (
    <div className="invite-box">
      <div className="invite-meta">
        <span className="invite-icon">🔗</span>
        <div className="invite-text">
          <span className="invite-label">CHALLENGE FRIENDS:</span>
          <strong className="invite-code">{roomCode}</strong>
        </div>
      </div>

      <div className="invite-buttons">
        <button
          className={`invite-copy-btn ${copiedCode ? 'copied' : ''}`}
          onClick={handleCopyCode}
          title="Copy 5-letter Room Code"
        >
          {copiedCode ? '✓ Code Copied' : '📋 Copy Code'}
        </button>

        <button
          className={`invite-link-btn ${copiedLink ? 'copied' : ''}`}
          onClick={handleCopyLink}
          title="Copy Direct Challenge Link"
        >
          {copiedLink ? '✓ Link Copied!' : '🚀 Copy Invite Link'}
        </button>
      </div>
    </div>
  )
}
