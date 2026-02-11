/**
 * Transport adapters for A2UI messages
 */

import type {
  TransportConfig,
  A2UIMessage,
  ActionMessage,
  WebSocketTransport,
  SSETransport,
} from "./types";

export type MessageHandler = (message: A2UIMessage) => void;
export type ConnectionHandler = () => void;

export interface Transport {
  connect: (onMessage: MessageHandler, onConnect?: ConnectionHandler) => void;
  disconnect: () => void;
  sendAction?: (action: ActionMessage["action"]) => void;
}

export function createTransport(config: TransportConfig): Transport {
  switch (config.type) {
    case "websocket":
      return createWebSocketTransport(config);
    case "sse":
      return createSSETransport(config);
    case "manual":
      return createManualTransport();
  }
}

function createWebSocketTransport(config: WebSocketTransport): Transport {
  let ws: WebSocket | null = null;
  let onMessage: MessageHandler | null = null;

  return {
    connect: (handler, onConnect) => {
      onMessage = handler;
      ws = new WebSocket(config.url);
      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data) as A2UIMessage;
          if (msg?.version) handler(msg);
        } catch {
          // ignore parse errors
        }
      };
      ws.onopen = () => onConnect?.();
    },
    disconnect: () => {
      ws?.close();
      ws = null;
      onMessage = null;
    },
    sendAction: (action) => {
      if (ws?.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ version: "v0.9", action }));
      }
    },
  };
}

function createSSETransport(config: SSETransport): Transport {
  let eventSource: EventSource | null = null;
  const actionEndpoint = config.actionEndpoint ?? config.url.replace(/\/sse$/, "/action");

  return {
    connect: (handler, onConnect) => {
      eventSource = new EventSource(config.url);
      eventSource.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data) as A2UIMessage;
          if (msg?.version) handler(msg);
        } catch {
          // ignore
        }
      };
      eventSource.onopen = () => onConnect?.();
    },
    disconnect: () => {
      eventSource?.close();
      eventSource = null;
    },
    sendAction: async (action) => {
      await fetch(actionEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ version: "v0.9", action }),
      });
    },
  };
}

function createManualTransport(): Transport {
  return {
    connect: () => {},
    disconnect: () => {},
  };
}
