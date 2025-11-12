import React, { useState, useRef, useEffect } from 'react';
import { Send, Menu, Plus, MessageSquare, Trash2 } from 'lucide-react';

export default function ChatInterface() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Olá! Como posso ajudá-lo hoje?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [conversations, setConversations] = useState([
    { id: 1, title: 'Nova conversa', active: true }
  ]);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [input]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    // Simular resposta da IA
    setTimeout(() => {
      const responses = [
        'Entendo sua pergunta. Deixe-me ajudá-lo com isso.',
        'Essa é uma ótima questão! Aqui está o que penso sobre isso...',
        'Com certeza! Posso explicar isso para você.',
        'Interessante! Vou elaborar uma resposta detalhada.',
        'Claro! Aqui está uma explicação completa sobre o assunto.'
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: randomResponse 
      }]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const newConversation = () => {
    const newId = conversations.length + 1;
    setConversations(prev => prev.map(c => ({ ...c, active: false })).concat({
      id: newId,
      title: 'Nova conversa',
      active: true
    }));
    setMessages([{ role: 'assistant', content: 'Olá! Como posso ajudá-lo hoje?' }]);
  };

  const deleteConversation = (id, e) => {
    e.stopPropagation();
    if (conversations.length > 1) {
      setConversations(prev => prev.filter(c => c.id !== id));
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 bg-gray-950 border-r border-gray-800 overflow-hidden flex flex-col`}>
        <div className="p-3 border-b border-gray-800">
          <button 
            onClick={newConversation}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <Plus size={18} />
            <span className="text-sm">Nova conversa</span>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2">
          {conversations.map(conv => (
            <div
              key={conv.id}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-1 cursor-pointer group ${
                conv.active ? 'bg-gray-800' : 'hover:bg-gray-800'
              }`}
            >
              <MessageSquare size={16} className="flex-shrink-0" />
              <span className="text-sm flex-1 truncate">{conv.title}</span>
              <button
                onClick={(e) => deleteConversation(conv.id, e)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={14} className="text-gray-400 hover:text-red-400" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-800 p-2 flex items-center gap-3">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="px-2 py-0 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Menu size={12} />
          </button>
          <h1 className="font-semibold">ChatIA</h1>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 py-8">
            {messages.map((msg, idx) => (
              <div key={idx} className={`mb-8 ${msg.role === 'user' ? 'flex justify-end' : ''}`}>
                <div className={`flex gap-4 max-w-full ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'user' ? 'bg-blue-600' : 'bg-green-600'
                  }`}>
                    {msg.role === 'user' ? 'V' : 'IA'}
                  </div>
                  <div className={`flex-1 ${msg.role === 'user' ? 'text-right' : ''}`}>
                    <p className="text-gray-100 whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="mb-8 flex gap-4">
                <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                  IA
                </div>
                <div className="flex gap-1 items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-800 p-4">
          <div className="max-w-3xl mx-auto">
            <div className="relative bg-gray-800 rounded-xl flex items-end">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Envie uma mensagem..."
                className="flex-1 bg-transparent px-4 py-3 pr-12 resize-none outline-none max-h-[200px]"
                rows={1}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className={`absolute right-2 bottom-2 p-2 rounded-lg transition-colors ${
                  input.trim() && !isTyping
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Send size={18} />
              </button>
            </div>
            <p className="text-xs text-gray-500 text-center mt-2">
              Pressione Enter para enviar, Shift + Enter para nova linha
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}