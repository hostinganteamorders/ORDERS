'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
    chatBotAPI,
    ChatMessage,
    createMessage,
    saveChatHistory,
    loadChatHistory,
    clearChatHistory,
    FALLBACK_RESPONSES
} from '@/lib/chatbot';
import { renderMarkdown } from '@/lib/markdown';

// Quick action suggestions for empty chat
const QUICK_ACTIONS = [
    { label: '📋 Layanan', message: 'Apa saja layanan yang ditawarkan Orders?' },
    { label: '💰 Harga', message: 'Berapa harga layanan Orders?' },
    { label: '📞 Kontak', message: 'Bagaimana cara menghubungi Orders?' },
    { label: '⚙️ Proses', message: 'Bagaimana proses kerja Orders?' },
];

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [streamingContent, setStreamingContent] = useState('');
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const chatWindowRef = useRef<HTMLDivElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    // Load chat history on mount
    useEffect(() => {
        const saved = loadChatHistory();
        if (saved.length > 0) {
            setMessages(saved);
        }
    }, []);

    // Save chat history when messages change
    useEffect(() => {
        if (messages.length > 0) {
            saveChatHistory(messages);
        }
    }, [messages]);

    // Auto scroll to bottom
    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping, streamingContent]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Keyboard trap: Escape to close
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Textarea auto-resize
    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(e.target.value);
        // Auto resize
        e.target.style.height = 'auto';
        e.target.style.height = `${Math.min(e.target.scrollHeight, 128)}px`;
    };

    // Get error message based on error type
    const getErrorMessage = useCallback((error: any): string => {
        const msg = error?.message || '';
        if (msg.includes('429') || msg.includes('rate limit') || msg.includes('Terlalu banyak')) {
            return FALLBACK_RESPONSES.RATE_LIMIT_ERROR;
        }
        if (msg.includes('timeout') || msg.includes('AbortError')) {
            return FALLBACK_RESPONSES.TIMEOUT_ERROR;
        }
        if (msg.includes('401') || msg.includes('403') || msg.includes('Unauthorized')) {
            return FALLBACK_RESPONSES.MODEL_ERROR;
        }
        if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
            return FALLBACK_RESPONSES.CONNECTION_ERROR;
        }
        return FALLBACK_RESPONSES.GENERIC_ERROR;
    }, []);

    // Send message with streaming
    const handleSendMessage = async (overrideMessage?: string) => {
        const messageText = overrideMessage || inputValue.trim();
        if (!messageText || isLoading) return;

        const userMessage = createMessage(messageText, 'user');
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);
        setIsTyping(true);
        setStreamingContent('');

        // Reset textarea height
        if (inputRef.current) {
            inputRef.current.style.height = 'auto';
        }

        try {
            // Build conversation history (last 10 messages)
            const conversationHistory = messages.slice(-10).map(msg => ({
                role: msg.role,
                content: msg.content
            }));

            // Use streaming
            abortControllerRef.current = await chatBotAPI.sendMessageStream(
                messageText,
                conversationHistory,
                undefined,
                // onChunk
                (chunk) => {
                    setStreamingContent(prev => prev + chunk);
                },
                // onDone
                (fullMessage, model) => {
                    const assistantMessage = createMessage(fullMessage, 'assistant', model || 'Orders AI');
                    setMessages(prev => [...prev, assistantMessage]);
                    setStreamingContent('');
                    setIsTyping(false);
                    setIsLoading(false);
                },
                // onError
                (error) => {
                    console.error('ChatBot stream error:', error);
                    const errorMsg = createMessage(getErrorMessage(error), 'assistant', 'System');
                    setMessages(prev => [...prev, errorMsg]);
                    setStreamingContent('');
                    setIsTyping(false);
                    setIsLoading(false);
                }
            );
        } catch (error: any) {
            console.error('ChatBot error:', error);
            const errorMsg = createMessage(getErrorMessage(error), 'assistant', 'System');
            setMessages(prev => [...prev, errorMsg]);
            setStreamingContent('');
            setIsTyping(false);
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleClearChat = () => {
        if (!showClearConfirm) {
            setShowClearConfirm(true);
            setTimeout(() => setShowClearConfirm(false), 3000);
            return;
        }
        setMessages([]);
        clearChatHistory();
        setShowClearConfirm(false);
    };

    const handleCopyMessage = async (message: ChatMessage) => {
        try {
            await navigator.clipboard.writeText(message.content);
            setCopiedMessageId(message.id);
            setTimeout(() => setCopiedMessageId(null), 2000);
        } catch {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = message.content;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            setCopiedMessageId(message.id);
            setTimeout(() => setCopiedMessageId(null), 2000);
        }
    };

    const handleStopGenerating = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        if (streamingContent) {
            const partialMessage = createMessage(streamingContent + '\n\n*[Respons dihentikan]*', 'assistant', 'Orders AI');
            setMessages(prev => [...prev, partialMessage]);
        }
        setStreamingContent('');
        setIsTyping(false);
        setIsLoading(false);
    };

    const toggleChat = () => {
        setIsOpen(!isOpen);
        setShowClearConfirm(false);
    };

    return (
        <>
            {/* Chat Toggle Button */}
            <button
                onClick={toggleChat}
                className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 p-3 sm:p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 ${isOpen
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
                    }`}
                aria-label={isOpen ? 'Tutup chat' : 'Buka Orders AI chat'}
                aria-expanded={isOpen}
            >
                {isOpen ? (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                )}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div
                    ref={chatWindowRef}
                    role="dialog"
                    aria-label="Orders AI Chat"
                    aria-modal="false"
                    className="fixed z-50 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slideUp inset-x-2 bottom-20 max-h-[85vh] sm:inset-auto sm:bottom-24 sm:right-6 sm:w-[400px] sm:h-[620px] sm:max-h-none border border-gray-200/50"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 flex items-center justify-between flex-shrink-0">
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                                    <span className="text-2xl">🤖</span>
                                </div>
                                <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 border-2 border-white"></span>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg leading-tight">Orders AI</h3>
                                <p className="text-xs text-orange-100">
                                    {isTyping ? '✍️ Sedang mengetik...' : '🟢 Online'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleClearChat}
                            className={`text-white rounded-lg p-2 transition-all duration-200 ${showClearConfirm
                                ? 'bg-red-600 hover:bg-red-700 scale-110'
                                : 'hover:bg-white/20'
                                }`}
                            title={showClearConfirm ? 'Klik lagi untuk konfirmasi hapus' : 'Hapus percakapan'}
                            aria-label={showClearConfirm ? 'Konfirmasi hapus percakapan' : 'Hapus percakapan'}
                        >
                            {showClearConfirm ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            )}
                        </button>
                    </div>

                    {/* Messages Container */}
                    <div
                        className="flex-1 overflow-y-auto min-h-0 p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gray-50"
                        role="log"
                        aria-label="Riwayat percakapan"
                        aria-live="polite"
                    >
                        {/* Welcome State - shown when no messages */}
                        {messages.length === 0 && !isTyping && (
                            <div className="flex flex-col items-center justify-center py-8 px-4 text-center animate-fadeIn">
                                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                                    <span className="text-3xl">🤖</span>
                                </div>
                                <h4 className="font-bold text-gray-800 text-lg mb-1">Halo! Saya Orders AI</h4>
                                <p className="text-gray-500 text-sm mb-6 max-w-[280px]">
                                    Asisten digital yang siap membantu Anda dengan layanan digital Orders.
                                </p>
                                <div className="grid grid-cols-2 gap-2 w-full max-w-[300px]">
                                    {QUICK_ACTIONS.map((action, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleSendMessage(action.message)}
                                            className="bg-white hover:bg-orange-50 border border-gray-200 hover:border-orange-300 rounded-xl px-3 py-2.5 text-xs font-medium text-gray-700 hover:text-orange-600 transition-all duration-200 shadow-sm hover:shadow active:scale-95"
                                        >
                                            {action.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Messages */}
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-messageIn`}
                            >
                                <div
                                    className={`max-w-[82%] rounded-2xl px-4 py-3 relative group ${message.role === 'user'
                                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-br-sm'
                                        : 'bg-white text-gray-800 shadow-md rounded-bl-sm border border-gray-100'
                                        }`}
                                >
                                    {message.role === 'user' ? (
                                        <p className="text-sm whitespace-pre-wrap break-words text-white">{message.content}</p>
                                    ) : (
                                        <>
                                            <div
                                                className="text-sm break-words prose prose-sm prose-gray max-w-none [&_pre]:my-2 [&_code]:text-xs"
                                                dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
                                            />
                                            {/* Copy Button */}
                                            <button
                                                onClick={() => handleCopyMessage(message)}
                                                className="absolute -bottom-1 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-100 hover:bg-gray-200 rounded-full p-1.5 shadow-sm"
                                                title="Salin pesan"
                                                aria-label="Salin pesan"
                                            >
                                                {copiedMessageId === message.id ? (
                                                    <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                    </svg>
                                                )}
                                            </button>
                                        </>
                                    )}
                                    <p className={`text-xs mt-1.5 ${message.role === 'user' ? 'text-orange-200' : 'text-gray-400'
                                        }`}>
                                        {message.timestamp.toLocaleTimeString('id-ID', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {/* Streaming Content - shown while AI is generating */}
                        {isTyping && streamingContent && (
                            <div className="flex justify-start animate-messageIn">
                                <div className="max-w-[82%] rounded-2xl rounded-bl-sm px-4 py-3 bg-white text-gray-800 shadow-md border border-gray-100">
                                    <div
                                        className="text-sm break-words prose prose-sm prose-gray max-w-none [&_pre]:my-2 [&_code]:text-xs"
                                        dangerouslySetInnerHTML={{ __html: renderMarkdown(streamingContent) }}
                                    />
                                    <span className="inline-block w-1.5 h-4 bg-orange-500 animate-blink ml-0.5 align-text-bottom rounded-sm"></span>
                                </div>
                            </div>
                        )}

                        {/* Typing Indicator - shown before streaming starts */}
                        {isTyping && !streamingContent && (
                            <div className="flex justify-start">
                                <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-md border border-gray-100">
                                    <div className="flex space-x-1.5">
                                        <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 sm:p-4 bg-white border-t border-gray-100 flex-shrink-0">
                        {/* Stop button when generating */}
                        {isLoading && (
                            <button
                                onClick={handleStopGenerating}
                                className="w-full mb-2 py-1.5 text-xs font-medium text-gray-500 hover:text-red-500 bg-gray-50 hover:bg-red-50 rounded-lg border border-gray-200 hover:border-red-200 transition-all duration-200 flex items-center justify-center gap-1.5"
                            >
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                    <rect x="6" y="6" width="12" height="12" rx="2" />
                                </svg>
                                Hentikan respons
                            </button>
                        )}

                        <div className="flex items-end space-x-2">
                            <textarea
                                ref={inputRef}
                                value={inputValue}
                                onChange={handleTextareaChange}
                                onKeyDown={handleKeyDown}
                                placeholder="Ketik pesan Anda..."
                                className="flex-1 resize-none border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent max-h-32 placeholder:text-gray-400 text-sm bg-gray-50 focus:bg-white transition-colors"
                                style={{ color: '#000000' }}
                                rows={1}
                                disabled={isLoading}
                                aria-label="Pesan chat"
                            />
                            <button
                                onClick={() => handleSendMessage()}
                                disabled={!inputValue.trim() || isLoading}
                                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl p-3 hover:from-orange-600 hover:to-orange-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 flex-shrink-0 shadow-sm hover:shadow"
                                aria-label="Kirim pesan"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-2 text-center">
                            Powered by Orders AI • Enter kirim • Shift+Enter baris baru • Esc tutup
                        </p>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes messageIn {
                    from { opacity: 0; transform: translateY(6px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                }
                .animate-slideUp {
                    animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .animate-fadeIn {
                    animation: fadeIn 0.4s ease-out;
                }
                .animate-messageIn {
                    animation: messageIn 0.25s ease-out;
                }
                .animate-blink {
                    animation: blink 1s step-end infinite;
                }
            `}</style>
        </>
    );
}
