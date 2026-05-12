import React, { useEffect, useRef, useState } from 'react'

export default function App() {

  const [theme, setTheme] = useState(
    localStorage.getItem('theme') || 'dark'
  )

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi 👋 I am NeuraChat. How can I help you today?'
    }
  ])

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const chatRef = useRef()

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: 'smooth'
    })
  }, [messages])

  const sendMessage = async () => {

    if (!input.trim()) return
    if (!window.puter) return

    const userMsg = input

    setMessages((prev) => [
      ...prev,
      { role: 'user', content: userMsg }
    ])

    setInput('')
    setLoading(true)

    try {

      const response = await window.puter.ai.chat(userMsg, {
        model: 'gpt-4o'
      })

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: response.message?.content || response.text || 'No response'
        }
      ])

    } catch (err) {

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Something went wrong'
        }
      ])
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eef2ff] dark:bg-[#0b1220] text-gray-800 dark:text-white p-4">

      <div className="w-full max-w-3xl h-[90vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111827]">

        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-white/10 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">

          <h1 className="text-2xl font-bold tracking-wide">
            NeuraChat
          </h1>

          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 transition"
          >
            {theme === 'dark' ? '☀ Light' : '🌙 Dark'}
          </button>

        </div>

        <div
          ref={chatRef}
          className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#f8fafc] dark:bg-[#0f172a]"
        >

          {messages.map((msg, i) => (

            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >

              <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap shadow-md
                ${msg.role === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-white/10'
                }`}>

                {msg.content}

              </div>

            </div>

          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="px-4 py-3 rounded-2xl bg-gray-200 dark:bg-[#1e293b] animate-pulse text-sm">
                NeuraChat is thinking...
              </div>
            </div>
          )}

        </div>

        <div className="p-4 border-t border-gray-200 dark:border-white/10 bg-white dark:bg-[#111827] flex gap-3">

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask something..."
            className="flex-1 px-4 py-3 rounded-2xl outline-none bg-gray-200 dark:bg-[#0f172a] border border-gray-300 dark:border-white/10"
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />

          <button
            onClick={sendMessage}
            disabled={loading}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:scale-105 transition"
          >
            Send
          </button>

        </div>

      </div>

    </div>
  )
}