import { useState, type FormEvent } from 'react'
import { MessageSquare, Send } from 'lucide-react'
import type { Message } from '@/lib/types'
import { cx, fmtDateTime } from '@/lib/format'
import { Button } from './Button'
import { Avatar } from './Misc'

export function MessageThread({ messages, meId, onSend, placeholder = 'Write a message…' }: { messages: Message[]; meId: string; onSend: (text: string) => void; placeholder?: string }) {
  const [text, setText] = useState('')
  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    onSend(text)
    setText('')
  }
  return (
    <div>
      {messages.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl bg-slate-50 px-4 py-8 text-center">
          <MessageSquare className="size-6 text-slate-400" />
          <p className="mt-2 text-sm text-slate-500">No messages yet. Start the conversation below.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {messages.map((m) => {
            const mine = m.fromId === meId
            return (
              <li key={m.id} className={cx('flex items-end gap-2.5', mine && 'flex-row-reverse')}>
                <Avatar name={m.fromName} size="sm" />
                <div className={cx('max-w-[80%] rounded-2xl px-4 py-2.5 text-sm', mine ? 'rounded-br-md bg-navy-800 text-white' : 'rounded-bl-md bg-slate-100 text-slate-800')}>
                  <p className={cx('text-[11px] font-semibold', mine ? 'text-white/70' : 'text-slate-500')}>
                    {m.fromName}
                    {m.fromRole === 'admin' && ' · MBC'}
                  </p>
                  <p className="mt-0.5 whitespace-pre-line">{m.text}</p>
                  <p className={cx('mt-1 text-[11px]', mine ? 'text-white/60' : 'text-slate-400')}>{fmtDateTime(m.at)}</p>
                </div>
              </li>
            )
          })}
        </ul>
      )}
      <form onSubmit={submit} className="mt-4 flex items-end gap-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit(e)
          }}
          rows={2}
          placeholder={placeholder}
          className="field-input flex-1 resize-none"
          aria-label="Message"
        />
        <Button type="submit" variant="primary" disabled={!text.trim()} aria-label="Send message">
          <Send className="size-4" />
        </Button>
      </form>
      <p className="mt-1.5 text-[11px] text-slate-400">Press Ctrl + Enter to send.</p>
    </div>
  )
}
