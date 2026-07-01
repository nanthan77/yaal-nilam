// @ts-nocheck
'use client';

import { useState, useEffect, useRef } from 'react';
import {
  MessageCircle,
  Phone,
  Search,
  Send,
  CheckCheck,
  Check,
  Clock,
  ChevronLeft,
  Package,
} from 'lucide-react';
import { db, functions } from '@/lib/firebase';
import {
  collection,
  getDocs,
  orderBy,
  query,
  limit as fsLimit,
  onSnapshot,
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';

interface WaMessage {
  id: string;
  conversation_id?: string;
  direction: 'inbound' | 'outbound';
  content: string;
  content_type?: string;
  status?: string;
  sender_name?: string;
  timestamp: string;
}

interface WaConversation {
  id: string;
  customer_name: string;
  customer_whatsapp: string;
  status: string;
  last_message?: string;
  last_message_time?: string;
  unread_count?: number;
  messages: WaMessage[];
}

const formatTime = (ts: string) => {
  if (!ts) return '';
  const d = new Date(ts);
  if (isNaN(d.getTime())) return ts;
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export default function WhatsAppPage() {
  const [conversations, setConversations] = useState<WaConversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<WaMessage[]>([]);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  // Load conversations
  useEffect(() => {
    async function loadConversations() {
      try {
        const snap = await getDocs(
          query(collection(db, 'whatsapp_conversations'), orderBy('last_message_time', 'desc'), fsLimit(50))
        );
        const convs = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          messages: [],
        })) as WaConversation[];
        setConversations(convs);
        if (convs.length > 0) setSelectedId(convs[0].id);
      } catch (err: any) {
        const msg = err?.message || '';
        if (msg.toLowerCase().includes('permission') || msg.includes('PERMISSION_DENIED')) {
          setError('Permission denied — your account lacks an admin role');
        } else {
          // conversations collection may not exist yet — not an error, just empty
          setConversations([]);
        }
      } finally {
        setLoadingConvs(false);
      }
    }
    loadConversations();
  }, []);

  // Load + subscribe to messages for selected conversation
  useEffect(() => {
    if (!selectedId) return;
    setLoadingMsgs(true);
    const q = query(
      collection(db, 'whatsapp_conversations', selectedId, 'messages'),
      orderBy('timestamp', 'asc')
    );
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        const msgs = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as WaMessage[];
        setMessages(msgs);
        setLoadingMsgs(false);
      },
      () => {
        setLoadingMsgs(false);
      }
    );
    return unsubscribe;
  }, [selectedId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const selectedConv = conversations.find((c) => c.id === selectedId) || null;

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedConv) return;
    setSending(true);
    setSendError('');
    const text = newMessage.trim();
    setNewMessage('');

    // Optimistic local append
    const optimistic: WaMessage = {
      id: `opt-${Date.now()}`,
      direction: 'outbound',
      content: text,
      status: 'pending',
      timestamp: new Date().toISOString(),
    };
    setMessages((curr) => [...curr, optimistic]);

    try {
      const sendFn = httpsCallable(functions, 'sendWhatsApp');
      await sendFn({
        conversation_id: selectedConv.id,
        to: selectedConv.customer_whatsapp,
        message: text,
      });
    } catch (err: any) {
      setSendError(err?.message || 'Failed to send message.');
      // Remove optimistic message on failure
      setMessages((curr) => curr.filter((m) => m.id !== optimistic.id));
    } finally {
      setSending(false);
    }
  };

  const filteredConvs = conversations.filter((c) =>
    (c.customer_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.customer_whatsapp || '').includes(searchTerm)
  );

  return (
    <div className="h-[calc(100vh-5rem)] flex rounded-xl border border-charcoal-200 overflow-hidden bg-white shadow">
      {/* Left: Conversation list */}
      <div className="w-80 flex-shrink-0 border-r border-charcoal-200 flex flex-col">
        {/* Header */}
        <div className="px-4 py-4 border-b border-charcoal-200">
          <h2 className="text-lg font-bold text-charcoal-900 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-green-600" />
            WhatsApp Inbox
          </h2>
          <div className="relative mt-3">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-charcoal-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search conversations…"
              className="w-full pl-9 pr-4 py-2 text-sm border border-charcoal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mx-3 mt-3 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700 font-semibold">
            {error}
          </div>
        )}

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {loadingConvs ? (
            <div className="py-12 text-center text-charcoal-500 text-sm">Loading…</div>
          ) : filteredConvs.length === 0 ? (
            <div className="py-16 px-6 text-center">
              <MessageCircle className="w-10 h-10 text-charcoal-300 mx-auto mb-3" />
              <p className="text-charcoal-600 font-medium text-sm">No conversations yet</p>
              <p className="text-charcoal-400 text-xs mt-1">They appear when customers message your WhatsApp number.</p>
            </div>
          ) : (
            filteredConvs.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedId(conv.id)}
                className={`w-full text-left px-4 py-3 border-b border-charcoal-100 hover:bg-charcoal-50 transition ${
                  selectedId === conv.id ? 'bg-teal-50 border-l-4 border-l-teal-500' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-sm flex-shrink-0">
                    {(conv.customer_name || '?')[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-charcoal-900 truncate">{conv.customer_name || conv.customer_whatsapp}</p>
                      <p className="text-xs text-charcoal-400 flex-shrink-0 ml-2">{formatTime(conv.last_message_time || '')}</p>
                    </div>
                    <p className="text-xs text-charcoal-500 truncate mt-0.5">{conv.last_message || '—'}</p>
                  </div>
                  {(conv.unread_count || 0) > 0 && (
                    <span className="w-5 h-5 bg-green-500 rounded-full text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {conv.unread_count}
                    </span>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right: Chat area */}
      <div className="flex-1 flex flex-col">
        {!selectedConv ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-14 h-14 text-charcoal-300 mx-auto mb-4" />
              <p className="text-charcoal-600 font-medium">Select a conversation</p>
              <p className="text-charcoal-400 text-sm mt-1">Choose a customer from the left to view messages.</p>
            </div>
          </div>
        ) : (
          <>
            {/* Chat header */}
            <div className="px-6 py-4 border-b border-charcoal-200 flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold flex-shrink-0">
                {(selectedConv.customer_name || '?')[0].toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-charcoal-900">{selectedConv.customer_name || '—'}</p>
                <p className="text-xs text-charcoal-500 flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {selectedConv.customer_whatsapp || '—'}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {loadingMsgs ? (
                <div className="text-center text-charcoal-500 text-sm py-8">Loading messages…</div>
              ) : messages.length === 0 ? (
                <div className="text-center text-charcoal-400 text-sm py-8">No messages in this conversation yet.</div>
              ) : (
                messages.map((msg) => {
                  const isOut = msg.direction === 'outbound';
                  return (
                    <div key={msg.id} className={`flex ${isOut ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-sm px-4 py-2 rounded-2xl text-sm ${
                          isOut ? 'bg-teal-600 text-white rounded-br-sm' : 'bg-charcoal-100 text-charcoal-900 rounded-bl-sm'
                        }`}
                      >
                        <p>{msg.content}</p>
                        <div className={`flex items-center gap-1 mt-1 text-xs ${isOut ? 'text-teal-200 justify-end' : 'text-charcoal-400'}`}>
                          <span>{formatTime(msg.timestamp)}</span>
                          {isOut && (
                            msg.status === 'read' ? <CheckCheck className="w-3 h-3" /> :
                            msg.status === 'delivered' ? <CheckCheck className="w-3 h-3 opacity-60" /> :
                            msg.status === 'failed' ? <span className="text-red-300">!</span> :
                            <Clock className="w-3 h-3 opacity-60" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={bottomRef} />
            </div>

            {/* Send error */}
            {sendError && (
              <div className="px-6 py-2 bg-red-50 border-t border-red-200 text-xs text-red-700 font-semibold">
                {sendError}
              </div>
            )}

            {/* Input */}
            <div className="px-6 py-4 border-t border-charcoal-200 flex gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Type a message…"
                className="flex-1 px-4 py-2 border border-charcoal-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                disabled={sending}
              />
              <button
                onClick={handleSend}
                disabled={sending || !newMessage.trim()}
                className="w-10 h-10 bg-teal-600 text-white rounded-full flex items-center justify-center hover:bg-teal-700 transition disabled:opacity-50"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
