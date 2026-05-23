"use client";

import { useState, useEffect } from "react";
import { Mail, MailOpen, Clock } from "lucide-react";

interface Message {
  id: string; name: string; email: string;
  subject: string; message: string; read: boolean; createdAt: string;
}

export default function MessagesAdminPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selected, setSelected] = useState<Message | null>(null);

  const load = () => fetch("/api/admin/messages").then((r) => r.json()).then(setMessages);
  useEffect(() => { load(); }, []);

  const markRead = async (msg: Message) => {
    if (!msg.read) {
      await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: msg.id, read: true }),
      });
      load();
    }
    setSelected(msg);
  };

  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-500 text-sm mt-1">
          {messages.length} total · {unread > 0 ? <span className="text-red-500 font-medium">{unread} unread</span> : "all read"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* List */}
        <div className="space-y-2">
          {messages.map((msg) => (
            <button
              key={msg.id}
              onClick={() => markRead(msg)}
              className={`w-full text-left rounded-xl border p-4 transition-all ${
                selected?.id === msg.id
                  ? "border-gray-900 bg-gray-50"
                  : msg.read
                  ? "border-gray-100 bg-white hover:border-gray-200"
                  : "border-blue-200 bg-blue-50 hover:border-blue-300"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {msg.read ? <MailOpen size={15} className="text-gray-400" /> : <Mail size={15} className="text-blue-500" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-sm truncate ${msg.read ? "text-gray-700" : "font-semibold text-gray-900"}`}>{msg.name}</p>
                    <span className="text-[10px] text-gray-400 shrink-0 flex items-center gap-1">
                      <Clock size={10} />
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{msg.subject}</p>
                </div>
              </div>
            </button>
          ))}
          {messages.length === 0 && (
            <div className="bg-white rounded-xl border border-dashed border-gray-200 p-10 text-center text-gray-400 text-sm">
              No messages yet.
            </div>
          )}
        </div>

        {/* Detail */}
        {selected ? (
          <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
            <div>
              <h3 className="font-bold text-gray-900">{selected.subject}</h3>
              <p className="text-sm text-gray-500 mt-1">From: <span className="font-medium text-gray-700">{selected.name}</span> · {selected.email}</p>
              <p className="text-xs text-gray-400 mt-0.5">{new Date(selected.createdAt).toLocaleString()}</p>
            </div>
            <hr />
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
            <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`} className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-all">
              <Mail size={14} /> Reply via Email
            </a>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-dashed border-gray-200 p-10 text-center text-gray-400 text-sm">
            Select a message to read
          </div>
        )}
      </div>
    </div>
  );
}
