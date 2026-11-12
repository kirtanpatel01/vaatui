import { type ChatMessage } from "@/data/mock-messages"
import { type UserProfile } from "@/data/mock-contacts"

export function exportChatAsText(contact: UserProfile, messages: ChatMessage[]) {
  const lines: string[] = [
    `========================================`,
    `Chat export: ${contact.name}`,
    `Type: ${contact.type}`,
    `Exported on: ${new Date().toLocaleString()}`,
    `Total messages: ${messages.length}`,
    `========================================\n`,
  ]

  messages.forEach((msg) => {
    const sender = msg.isSentByMe ? "You" : (msg.senderName || contact.name)
    const content = msg.text || (msg.attachment ? `[Attachment: ${msg.attachment.type}]` : "")
    lines.push(`[${msg.date} ${msg.timestamp}] ${sender}: ${content}`)
  })

  downloadBlob(lines.join("\n"), `chat-${sanitizeFileName(contact.name)}.txt`, "text/plain;charset=utf-8")
}

export function exportChatAsJson(contact: UserProfile, messages: ChatMessage[]) {
  const data = {
    contact: {
      id: contact.id,
      name: contact.name,
      type: contact.type,
      phone: contact.phone,
    },
    exportedAt: new Date().toISOString(),
    totalMessages: messages.length,
    messages: messages.map((m) => ({
      id: m.id,
      senderId: m.senderId,
      senderName: m.senderName,
      isSentByMe: m.isSentByMe,
      date: m.date,
      timestamp: m.timestamp,
      text: m.text,
      isStarred: m.isStarred,
      isPinned: m.isPinned,
      isForwarded: m.isForwarded,
      reactions: m.reactions,
      attachment: m.attachment,
      replyTo: m.replyTo,
    })),
  }

  downloadBlob(JSON.stringify(data, null, 2), `chat-${sanitizeFileName(contact.name)}.json`, "application/json;charset=utf-8")
}

export function exportChatAsMarkdown(contact: UserProfile, messages: ChatMessage[]) {
  const lines: string[] = [
    `# Chat with ${contact.name}`,
    `*Exported on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}*`,
    `\n---\n`,
  ]

  messages.forEach((msg) => {
    const sender = msg.isSentByMe ? "**You**" : `**${msg.senderName || contact.name}**`
    const time = `*${msg.date} ${msg.timestamp}*`
    const content = msg.text || (msg.attachment ? `*[Attachment: ${msg.attachment.type}]*` : "")

    if (msg.replyTo) {
      lines.push(`> Replying to ${msg.replyTo.senderName}: "${msg.replyTo.text}"\n`)
    }

    lines.push(`${sender} (${time}):  \n${content}\n`)
  })

  downloadBlob(lines.join("\n"), `chat-${sanitizeFileName(contact.name)}.md`, "text/markdown;charset=utf-8")
}

function sanitizeFileName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9_-]/g, "_")
}

function downloadBlob(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

