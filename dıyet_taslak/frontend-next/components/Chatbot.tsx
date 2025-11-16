'use client'

import React, { useState, useRef, useEffect } from 'react'

interface Profile {
  age: number
  sex: string
  weight: number
  height: number
  activity: string
  goal: string
  bmi?: number
  teh?: number
}

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export default function Chatbot({ profile }: { profile?: Profile | null }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Merhaba! Beslenme ve diyet konusunda size nasıl yardımcı olabilirim?'
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const systemPrompt = profile
        ? `Sen uzman bir beslenme danışmanısın. Kullanıcı profili: ${profile.age} yaş, ${profile.sex === 'M' ? 'erkek' : 'kadın'}, ${profile.weight}kg, ${profile.height}cm, aktivite: ${profile.activity}, hedef: ${profile.goal}, günlük kalori ihtiyacı: ${profile.teh?.toFixed(0)} kcal.

Görevin:
- Kullanıcıya özel, bilimsel ve pratik beslenme önerileri sunmak
- Kısa, net ve anlaşılır Türkçe cevaplar vermek
- Emoji kullanmamak, profesyonel ama samimi olmak
- Sadece beslenme, sağlık ve fitness konularında yardımcı olmak
- Gereksiz detaya girmeden doğrudan konuya girmek

Özel kurallar:
- "Sen kimsin/hangi model" sorularına: "Ben Gökçe tarafından optimize edilmiş bir beslenme asistanıyım"
- Kesinlikle emoji kullanma
- Maksimum 3-4 cümle ile cevapla
- Dans, diploma gibi ilgisiz konulara girmeme`
        : `Sen uzman bir beslenme danışmanısın.

Görevin:
- Kullanıcıya bilimsel ve pratik beslenme önerileri sunmak
- Kısa, net ve anlaşılır Türkçe cevaplar vermek
- Emoji kullanmamak, profesyonel ama samimi olmak
- Sadece beslenme, sağlık ve fitness konularında yardımcı olmak

Özel kurallar:
- "Sen kimsin/hangi model" sorularına: "Ben Gökçe tarafından optimize edilmiş bir beslenme asistanıyım"
- Kesinlikle emoji kullanma
- Maksimum 3-4 cümle ile cevapla`

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : '',
          'X-Title': 'HEALFLOW Diet Assistant'
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-20b:free',
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.slice(-5),
            userMessage
          ],
          temperature: 0.7,
          max_tokens: 300
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMsg = response.status === 429 
          ? 'Çok fazla istek gönderildi. Lütfen birkaç saniye bekleyip tekrar deneyin.'
          : response.status === 401
          ? 'API anahtarı geçersiz. Lütfen yöneticinize başvurun.'
          : `API hatası: ${response.status} - ${errorData.error?.message || 'Bilinmeyen hata'}`
        throw new Error(errorMsg)
      }

      const data = await response.json()
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.choices[0]?.message?.content || 'Üzgünüm, bir hata oluştu.'
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chatbot error:', error)
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: error instanceof Error ? error.message : 'Üzgünüm, şu anda yanıt veremiyorum. Lütfen daha sonra tekrar deneyin.'
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Chatbot toggle button */}
      <button
        className="chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Sohbet robotu"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Chatbot window */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div>
              <h3>Beslenme Asistanı</h3>
              <p>AI destekli danışmanlık</p>
            </div>
            <button onClick={() => setIsOpen(false)} aria-label="Kapat">✕</button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chatbot-message ${msg.role}`}>
                <div className="message-content">
                  {msg.content.split('\n').map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < msg.content.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="chatbot-message assistant">
                <div className="message-content typing">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Mesajınızı yazın..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <button onClick={sendMessage} disabled={isLoading || !input.trim()}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  )
}
