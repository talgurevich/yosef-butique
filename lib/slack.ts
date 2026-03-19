type CartItem = {
  productName: string;
  variantSize: string;
  price: number;
  quantity: number;
};

type CartCreatedEvent = {
  type: 'cart_created';
  items: CartItem[];
  total: number;
};

type CheckoutStartedEvent = {
  type: 'checkout_started';
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderNumber: string;
  items: CartItem[];
  total: number;
};

type PaymentLinkGeneratedEvent = {
  type: 'payment_link_generated';
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderNumber: string;
  items: CartItem[];
  total: number;
};

type OrderCompletedEvent = {
  type: 'order_completed';
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: CartItem[];
  total: number;
};

type CartAbandonedEvent = {
  type: 'cart_abandoned';
  items: CartItem[];
  total: number;
  minutesIdle: number;
};

type SlackEvent =
  | CartCreatedEvent
  | CheckoutStartedEvent
  | PaymentLinkGeneratedEvent
  | OrderCompletedEvent
  | CartAbandonedEvent;

function formatItems(items: CartItem[]): string {
  return items
    .map((item) => `• ${item.productName} (${item.variantSize}) x${item.quantity} — ₪${(item.price * item.quantity).toLocaleString()}`)
    .join('\n');
}

function buildBlocks(event: SlackEvent) {
  const itemList = formatItems(event.items);

  switch (event.type) {
    case 'cart_created':
      return [
        { type: 'header', text: { type: 'plain_text', text: '🛒 Cart Created' } },
        { type: 'section', text: { type: 'mrkdwn', text: itemList } },
        { type: 'section', text: { type: 'mrkdwn', text: `*Total:* ₪${event.total.toLocaleString()}` } },
      ];

    case 'checkout_started':
      return [
        { type: 'header', text: { type: 'plain_text', text: '💳 Checkout Started' } },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Customer:* ${event.customerName}\n*Email:* ${event.customerEmail}\n*Phone:* ${event.customerPhone}\n*Order:* ${event.orderNumber}`,
          },
        },
        { type: 'section', text: { type: 'mrkdwn', text: itemList } },
        { type: 'section', text: { type: 'mrkdwn', text: `*Total:* ₪${event.total.toLocaleString()}` } },
      ];

    case 'payment_link_generated':
      return [
        { type: 'header', text: { type: 'plain_text', text: '🔗 Payment Link Generated' } },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Customer:* ${event.customerName}\n*Email:* ${event.customerEmail}\n*Phone:* ${event.customerPhone}\n*Order:* ${event.orderNumber}`,
          },
        },
        { type: 'section', text: { type: 'mrkdwn', text: itemList } },
        { type: 'section', text: { type: 'mrkdwn', text: `*Total:* ₪${event.total.toLocaleString()}` } },
      ];

    case 'order_completed':
      return [
        { type: 'header', text: { type: 'plain_text', text: '✅ Order Completed' } },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Order:* ${event.orderNumber}\n*Customer:* ${event.customerName}\n*Email:* ${event.customerEmail}\n*Phone:* ${event.customerPhone}`,
          },
        },
        { type: 'section', text: { type: 'mrkdwn', text: itemList } },
        { type: 'section', text: { type: 'mrkdwn', text: `*Total:* ₪${event.total.toLocaleString()}` } },
      ];

    case 'cart_abandoned':
      return [
        { type: 'header', text: { type: 'plain_text', text: '⚠️ Cart Abandoned' } },
        { type: 'section', text: { type: 'mrkdwn', text: `*Idle for:* ${event.minutesIdle} minutes` } },
        { type: 'section', text: { type: 'mrkdwn', text: itemList } },
        { type: 'section', text: { type: 'mrkdwn', text: `*Total:* ₪${event.total.toLocaleString()}` } },
      ];
  }
}

export async function sendSlackNotification(event: SlackEvent): Promise<void> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) return;

  const blocks = buildBlocks(event);

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blocks }),
    });
  } catch {
    // best-effort — never throw
  }
}
