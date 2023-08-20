export interface Mail {
  attachments: any[]
  headers: Headers
  headerLines: HeaderLine[]
  html: string
  text: string
  textAsHtml: string
  subject: string
  date: string
  to: To
  from: From
  cc: Cc
  messageId: string
  replyTo: ReplyTo
}

export interface Headers {}

export interface HeaderLine {
  key: string
  line: string
}

export interface To {
  value: EmailContact[]
  html: string
  text: string
}

export interface From {
  value: EmailContact[]
  html: string
  text: string
}

export interface Cc {
  value: EmailContact[]
  html: string
  text: string
}

export interface ReplyTo {
  value: EmailContact[]
  html: string
  text: string
}

export interface EmailContact {
  address: string
  name: string
}