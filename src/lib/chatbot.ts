// ChatBot utility functions and types

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
  model?: string;
}

export interface ChatError {
  message: string;
  code?: string;
  status?: number;
}

export type ModelId = 'openai-gpt-oss-120b' | 'deepseek-ai/deepseek-v3.1';

export interface ModelConfig {
  id: ModelId;
  name: string;
  description: string;
}

export const AVAILABLE_MODELS: ModelConfig[] = [
  {
    id: 'deepseek-ai/deepseek-v3.1',
    name: 'DeepSeek V3.1',
    description: 'Fast and efficient model'
  },
  {
    id: 'openai-gpt-oss-120b',
    name: 'GPT OSS 120B',
    description: 'Large open-source model'
  }
];

export const DEFAULT_MODEL: ModelId = 'deepseek-ai/deepseek-v3.1';

// Request timeout in milliseconds
const REQUEST_TIMEOUT_MS = 30000;

export class ChatBotAPI {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  /**
   * Send a message and get a full response (non-streaming)
   */
  async sendMessage(
    message: string,
    conversationHistory?: Array<{ role: string; content: string }>,
    model?: ModelId
  ): Promise<{ message: string; model: string }> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          conversationHistory,
          model,
          stream: false
        }),
        signal: controller.signal,
      });

      const data = await response.json();

      if (!response.ok) {
        const error = new Error(data.error || `HTTP error! status: ${response.status}`);
        (error as any).status = response.status;
        throw error;
      }

      return data;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout: AI tidak merespons dalam 30 detik. Silakan coba lagi.');
      }
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  /**
   * Send a message and get a streaming response
   */
  async sendMessageStream(
    message: string,
    conversationHistory?: Array<{ role: string; content: string }>,
    model?: ModelId,
    onChunk?: (chunk: string) => void,
    onDone?: (fullMessage: string, model: string) => void,
    onError?: (error: Error) => void
  ): Promise<AbortController> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000); // 60s for streaming

    try {
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          conversationHistory,
          model,
          stream: true
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullMessage = '';
      let responseModel = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const text = decoder.decode(value, { stream: true });
          const lines = text.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);

              if (data === '[DONE]') {
                onDone?.(fullMessage, responseModel);
                clearTimeout(timeout);
                return controller;
              }

              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  fullMessage += parsed.content;
                  onChunk?.(parsed.content);
                }
                if (parsed.model) {
                  responseModel = parsed.model;
                }
                // Handle fallback (non-streaming) response
                if (parsed.fallback) {
                  fullMessage = parsed.message;
                  responseModel = parsed.model || 'fallback';
                  onDone?.(fullMessage, responseModel);
                  clearTimeout(timeout);
                  return controller;
                }
              } catch {
                // Skip invalid JSON chunks
              }
            }
          }
        }
        // If stream ended without [DONE]
        if (fullMessage) {
          onDone?.(fullMessage, responseModel);
        }
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        onError?.(new Error('Request timeout: AI tidak merespons. Silakan coba lagi.'));
      } else {
        onError?.(error);
      }
    } finally {
      clearTimeout(timeout);
    }

    return controller;
  }
}

export const chatBotAPI = new ChatBotAPI();

// Helper functions for message formatting
export const formatTimestamp = (date: Date): string => {
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const createMessage = (
  content: string,
  role: ChatMessage['role'],
  model?: string
): ChatMessage => ({
  id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  content,
  role,
  timestamp: new Date(),
  model
});

// Storage helpers for chat history
const CHAT_HISTORY_KEY = 'orders-ai-chat-history';
const MAX_STORED_MESSAGES = 50;

export const saveChatHistory = (messages: ChatMessage[]): void => {
  if (typeof window !== 'undefined') {
    try {
      // Only store last N messages to prevent localStorage bloat
      const toStore = messages.slice(-MAX_STORED_MESSAGES);
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(toStore));
    } catch (error) {
      console.warn('Failed to save chat history:', error);
    }
  }
};

export const loadChatHistory = (): ChatMessage[] => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(CHAT_HISTORY_KEY);
    if (saved) {
      try {
        return JSON.parse(saved).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      } catch (error) {
        console.error('Failed to load chat history:', error);
      }
    }
  }
  return [];
};

export const clearChatHistory = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(CHAT_HISTORY_KEY);
  }
};

// Predefined responses for common scenarios
export const FALLBACK_RESPONSES = {
  CONNECTION_ERROR: "Maaf, Orders AI tidak dapat terhubung ke server AI. Silakan coba lagi dalam beberapa saat atau hubungi tim kami via WhatsApp.",
  MODEL_ERROR: "Model AI tidak tersedia. Silakan coba lagi nanti.",
  TIMEOUT_ERROR: "Permintaan timeout. Server AI tidak merespons tepat waktu. Silakan coba lagi.",
  RATE_LIMIT_ERROR: "Terlalu banyak permintaan. Silakan tunggu beberapa saat sebelum mengirim pesan lagi.",
  GENERIC_ERROR: "Terjadi kesalahan pada Orders AI. Silakan coba lagi dalam beberapa saat.",
  WELCOME: "👋 Halo! Saya Orders AI, asisten digital dari Orders. Saya siap membantu Anda dengan pertanyaan tentang layanan digital, teknologi, atau topik lainnya. Ada yang bisa saya bantu hari ini?",
  THINKING: "Orders AI sedang memproses..."
};
