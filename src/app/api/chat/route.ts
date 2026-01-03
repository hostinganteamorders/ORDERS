import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// MegaLLM API compatible - uses OpenAI SDK format
// Base URL and API key configured via environment variables

// Inisialisasi OpenAI client
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL,
});

// Available models for MegaLLM API
const AVAILABLE_MODELS = [
    'openai-gpt-oss-120b',
    'deepseek-ai/deepseek-v3.1'
];

const MODEL = process.env.OPENAI_MODEL || 'deepseek-ai/deepseek-v3.1';

export async function POST(request: NextRequest) {
    try {
        const { message, conversationHistory } = await request.json();

        if (!message || typeof message !== 'string') {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            );
        }

        // Cek apakah API key tersedia
        if (!process.env.OPENAI_API_KEY) {
            console.warn('OPENAI_API_KEY not configured, using fallback responses');
            const fallbackResponses = getFallbackResponse(message);
            return NextResponse.json({
                message: fallbackResponses,
                model: 'fallback'
            });
        }

        // Coba koneksi ke OpenAI API
        try {
            // Siapkan system prompt
            const systemPrompt = `Kamu adalah Orders AI, asisten digital dari Orders - sebuah perusahaan yang menyediakan layanan digital seperti pembuatan website, aplikasi, desain grafis, dan layanan IT lainnya. 

Tugas kamu:
- Membantu menjawab pertanyaan tentang layanan Orders
- Memberikan informasi tentang teknologi dan digital marketing
- Bersikap ramah, profesional, dan membantu
- Menjawab dalam Bahasa Indonesia yang natural dan ramah
- Berikan jawaban yang singkat, jelas, dan informatif
- Gunakan emoji untuk membuat percakapan lebih menarik

Layanan Orders:
• 🌐 Web Development - Website modern dan responsif
• 📱 Mobile Apps - Aplikasi Android & iOS
• 🎨 Desain Grafis - Logo, branding, material marketing
• 💼 Digital Marketing - SEO, social media, content
• ☁️ Cloud Solutions - Hosting, server, infrastruktur IT
• 🛠️ IT Consulting - Konsultasi teknologi bisnis

Jika ditanya kontak: WhatsApp (tombol di website), Email: info@orders.co.id`;

            // Buat messages array dengan conversation history
            const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
                { role: 'system', content: systemPrompt }
            ];

            // Tambahkan conversation history jika ada
            if (conversationHistory && Array.isArray(conversationHistory)) {
                conversationHistory.forEach((msg: any) => {
                    if (msg.role && msg.content) {
                        messages.push({
                            role: msg.role as 'user' | 'assistant',
                            content: msg.content
                        });
                    }
                });
            }

            // Tambahkan pesan user terbaru
            messages.push({ role: 'user', content: message });

            // Panggil OpenAI API
            const response = await client.chat.completions.create({
                model: MODEL,
                messages: messages,
                temperature: 0.7,
                max_tokens: 300,
            });

            const aiMessage = response.choices[0].message.content;

            return NextResponse.json({
                message: aiMessage,
                model: MODEL
            });

        } catch (apiError: any) {
            console.error('OpenAI API error:', apiError);

            // Jika error dari API, gunakan fallback
            const fallbackResponses = getFallbackResponse(message);
            return NextResponse.json({
                message: fallbackResponses,
                model: 'fallback',
                error: apiError.message
            });
        }

    } catch (error: any) {
        console.error('Chat API error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}

// Fungsi untuk memberikan response fallback yang cerdas
function getFallbackResponse(message: string): string {
    const lowerMessage = message.toLowerCase();

    // Deteksi pertanyaan tentang layanan
    if (lowerMessage.includes('layanan') || lowerMessage.includes('service') || lowerMessage.includes('jasa')) {
        return `🎯 Orders menyediakan berbagai layanan digital profesional:

• 🌐 **Web Development** - Pembuatan website modern dan responsif
• 📱 **Mobile Apps** - Aplikasi Android & iOS
• 🎨 **Desain Grafis** - Logo, branding, dan material marketing
• 💼 **Digital Marketing** - SEO, social media, content marketing
• ☁️ **Cloud Solutions** - Hosting, server, dan infrastruktur IT
• 🛠️ **IT Consulting** - Konsultasi teknologi untuk bisnis Anda

Tertarik dengan layanan tertentu? Tanya saya lebih detail atau hubungi tim kami!`;
    }

    // Pertanyaan tentang harga
    if (lowerMessage.includes('harga') || lowerMessage.includes('biaya') || lowerMessage.includes('price')) {
        return `💰 Untuk informasi harga yang akurat dan sesuai kebutuhan Anda, saya sarankan:

1. **Konsultasi Gratis** - Ceritakan project Anda terlebih dahulu
2. **Penawaran Custom** - Setiap project memiliki kebutuhan unik
3. **Paket Hemat** - Tersedia paket bundling untuk beberapa layanan

Hubungi tim sales kami untuk mendapatkan penawaran terbaik! 📞

Mau saya jelaskan lebih detail tentang layanan tertentu?`;
    }

    // Pertanyaan tentang kontak
    if (lowerMessage.includes('kontak') || lowerMessage.includes('hubungi') || lowerMessage.includes('contact')) {
        return `📞 Hubungi Orders:

• **WhatsApp**: Klik tombol WhatsApp di kanan bawah
• **Email**: info@orders.co.id
• **Website**: www.orders.co.id
• **Social Media**: @orders.digital

Tim kami siap membantu Anda! Biasanya respon dalam 1-2 jam di hari kerja. 

Ada yang bisa saya bantu saat ini?`;
    }

    // Pertanyaan tentang portfolio
    if (lowerMessage.includes('portfolio') || lowerMessage.includes('portofolio') || lowerMessage.includes('project')) {
        return `🎨 Orders telah menangani berbagai project:

• Sistem E-Commerce untuk retail
• Aplikasi mobile untuk startup
• Website corporate untuk perusahaan besar
• Landing page untuk campaign marketing
• Sistem internal perusahaan

Lihat portfolio lengkap kami di halaman Portfolio atau tanya saya tentang jenis project tertentu yang Anda minati!`;
    }

    // Pertanyaan tentang proses
    if (lowerMessage.includes('proses') || lowerMessage.includes('cara') || lowerMessage.includes('bagaimana')) {
        return `⚙️ Proses kerja Orders:

1. **Konsultasi** - Diskusi kebutuhan project (GRATIS)
2. **Proposal** - Penawaran harga dan timeline
3. **Development** - Tim mulai mengerjakan project
4. **Review** - Anda cek dan berikan feedback
5. **Revisi** - Penyempurnaan sesuai feedback
6. **Launch** - Project siap digunakan
7. **Support** - Maintenance dan dukungan teknis

Proses transparan dengan update berkala. Tertarik mulai project?`;
    }

    // Salam
    if (lowerMessage.includes('halo') || lowerMessage.includes('hai') || lowerMessage.includes('hi') || lowerMessage.includes('hello')) {
        return `👋 Halo! Saya Orders AI, asisten digital Orders.

Saya bisa membantu Anda dengan:
• Informasi layanan kami
• Penjelasan proses kerja
• Rekomendasi solusi digital
• Menghubungkan dengan tim

Apa yang bisa saya bantu hari ini?`;
    }

    // Pertanyaan tentang teknologi
    if (lowerMessage.includes('teknologi') || lowerMessage.includes('tech') || lowerMessage.includes('stack')) {
        return `💻 Orders menggunakan teknologi modern:

**Frontend**: React, Next.js, Vue.js, TypeScript
**Mobile**: React Native, Flutter
**Backend**: Node.js, Python, PHP
**Database**: PostgreSQL, MongoDB, MySQL
**Cloud**: AWS, Google Cloud, Azure
**DevOps**: Docker, Kubernetes, CI/CD

Kami selalu menggunakan best practices dan teknologi terkini untuk memastikan product berkualitas tinggi!`;
    }

    // Response umum
    return `Terima kasih atas pertanyaan Anda! 😊

Saat ini Orders AI sedang dalam mode offline, tapi saya tetap bisa membantu dengan:

• **Layanan Orders** - Apa yang kami tawarkan
• **Harga & Paket** - Informasi biaya
• **Portfolio** - Project yang sudah kami kerjakan
• **Proses Kerja** - Bagaimana kami bekerja
• **Kontak** - Cara menghubungi tim

Atau Anda bisa langsung chat dengan tim kami via WhatsApp untuk respons lebih cepat!

Ada yang bisa saya bantu? 🚀`;
}

export async function GET() {
    return NextResponse.json({
        status: 'ok',
        message: 'Chat API is running',
        version: '1.0.0'
    });
}
