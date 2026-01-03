'use client';

import WhatsAppButton from './WhatsAppButton';
import ChatBot from './ChatBot';

export default function FloatingActionButtons() {
    return (
        <>
            {/* ChatBot Component - sudah memiliki logika open/close sendiri */}
            <ChatBot />

            {/* WhatsApp Button - positioned above chat button */}
            <WhatsAppButton className="fixed bottom-24 right-6 z-50" />
        </>
    );
}
