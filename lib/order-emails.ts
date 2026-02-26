import sgMail from '@sendgrid/mail';

type OrderItem = {
  product_name: string;
  variant_size: string;
  variant_color?: string;
  price: number;
  quantity: number;
};

type OrderData = {
  order_number: string;
  subtotal: number;
  delivery_cost: number;
  discount_amount: number;
  coupon_code?: string;
  total: number;
  tax: number;
  notes?: string;
};

type CustomerData = {
  customer_name: string;
  email: string;
  phone: string;
};

function initSendGrid() {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) {
    throw new Error('SENDGRID_API_KEY not configured');
  }
  sgMail.setApiKey(apiKey);
}

function formatCurrency(amount: number): string {
  return `₪${amount.toLocaleString('he-IL')}`;
}

function buildItemsTable(items: OrderItem[]): string {
  return items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${item.product_name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.variant_size}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: left;">${formatCurrency(item.price * item.quantity)}</td>
    </tr>
  `).join('');
}

export async function sendOrderConfirmationEmail(
  order: OrderData,
  items: OrderItem[],
  customer: CustomerData
) {
  initSendGrid();

  const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'info@boutique-yossef.co.il';

  const msg = {
    to: customer.email,
    from: fromEmail,
    subject: `אישור הזמנה ${order.order_number} - שטיחי בוטיק יוסף`,
    html: `
      <!DOCTYPE html>
      <html dir="rtl" lang="he">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; border-top: 1px solid #e0e0e0; }
          table { width: 100%; border-collapse: collapse; }
          th { background: #f8f9fa; padding: 12px; text-align: right; border-bottom: 2px solid #667eea; }
          th:last-child { text-align: left; }
          th:nth-child(2), th:nth-child(3) { text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0 0 10px 0;">ההזמנה שלך אושרה!</h1>
            <p style="margin: 0; font-size: 18px;">הזמנה מספר: <strong>${order.order_number}</strong></p>
          </div>
          <div class="content">
            <p>שלום ${customer.customer_name},</p>
            <p>תודה שבחרת לקנות בשטיחי בוטיק יוסף! ההזמנה שלך התקבלה בהצלחה.</p>

            <h2 style="color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 8px;">פרטי ההזמנה</h2>
            <table>
              <thead>
                <tr>
                  <th>מוצר</th>
                  <th>מידה</th>
                  <th>כמות</th>
                  <th style="text-align: left;">מחיר</th>
                </tr>
              </thead>
              <tbody>
                ${buildItemsTable(items)}
              </tbody>
            </table>

            <div style="margin-top: 20px; background: #f8f9fa; padding: 15px; border-radius: 8px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>סכום ביניים:</span>
                <span>${formatCurrency(order.subtotal)}</span>
              </div>
              ${order.discount_amount > 0 ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #4caf50;">
                <span>הנחה${order.coupon_code ? ` (${order.coupon_code})` : ''}:</span>
                <span>-${formatCurrency(order.discount_amount)}</span>
              </div>
              ` : ''}
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>משלוח:</span>
                <span>${formatCurrency(order.delivery_cost)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold; border-top: 2px solid #667eea; padding-top: 10px; margin-top: 10px;">
                <span>סה"כ:</span>
                <span>${formatCurrency(order.total)}</span>
              </div>
            </div>

            <div style="margin-top: 25px; background: #e8f5e9; border: 1px solid #4caf50; padding: 20px; border-radius: 8px; text-align: center;">
              <p style="margin: 0; font-size: 16px; color: #2e7d32;">
                <strong>נציג יצור איתך קשר בהקדם לתיאום המשלוח</strong>
              </p>
            </div>

            <div style="margin-top: 25px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
              <h3 style="margin-top: 0;">צריך עזרה?</h3>
              <ul style="list-style: none; padding: 0;">
                <li style="margin-bottom: 8px;">טלפון: <a href="tel:0515092208" style="color: #667eea;">051-509-2208</a></li>
                <li style="margin-bottom: 8px;">WhatsApp: <a href="https://wa.me/972515092208" style="color: #25D366;">שלח הודעה</a></li>
                <li>אימייל: <a href="mailto:info@boutique-yossef.co.il" style="color: #667eea;">info@boutique-yossef.co.il</a></li>
              </ul>
            </div>
          </div>
          <div class="footer">
            <p>שטיחי בוטיק יוסף | השקד משק 47, מושב בית עזרא</p>
            <p>&copy; ${new Date().getFullYear()} שטיחי בוטיק יוסף. כל הזכויות שמורות.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
אישור הזמנה ${order.order_number} - שטיחי בוטיק יוסף

שלום ${customer.customer_name},

תודה שבחרת לקנות בשטיחי בוטיק יוסף! ההזמנה שלך התקבלה בהצלחה.

פרטי ההזמנה:
${items.map(item => `- ${item.product_name} | מידה: ${item.variant_size} | כמות: ${item.quantity} | ${formatCurrency(item.price * item.quantity)}`).join('\n')}

סכום ביניים: ${formatCurrency(order.subtotal)}
${order.discount_amount > 0 ? `הנחה${order.coupon_code ? ` (${order.coupon_code})` : ''}: -${formatCurrency(order.discount_amount)}\n` : ''}משלוח: ${formatCurrency(order.delivery_cost)}
סה"כ: ${formatCurrency(order.total)}

נציג יצור איתך קשר בהקדם לתיאום המשלוח.

צריך עזרה?
טלפון: 051-509-2208
WhatsApp: https://wa.me/972515092208
אימייל: info@boutique-yossef.co.il

שטיחי בוטיק יוסף | השקד משק 47, מושב בית עזרא
    `,
  };

  await sgMail.send(msg);
}

export async function sendAdminOrderNotificationEmail(
  order: OrderData,
  items: OrderItem[],
  customer: CustomerData
) {
  initSendGrid();

  const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'info@boutique-yossef.co.il';

  const msg = {
    to: 'info@boutique-yossef.co.il',
    from: fromEmail,
    subject: `הזמנה חדשה! ${order.order_number} - ${formatCurrency(order.total)}`,
    html: `
      <!DOCTYPE html>
      <html dir="rtl" lang="he">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
          .info-box { background: #f8f9fa; border-right: 4px solid #4caf50; padding: 15px; margin: 15px 0; }
          .info-label { font-weight: bold; color: #4caf50; margin-bottom: 5px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          table { width: 100%; border-collapse: collapse; }
          th { background: #f8f9fa; padding: 10px; text-align: right; border-bottom: 2px solid #4caf50; }
          th:last-child { text-align: left; }
          th:nth-child(2), th:nth-child(3) { text-align: center; }
          td { padding: 10px; border-bottom: 1px solid #eee; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">הזמנה חדשה!</h1>
            <p style="margin: 10px 0 0 0; font-size: 20px;">${order.order_number} | ${formatCurrency(order.total)}</p>
          </div>
          <div class="content">
            <h2>פרטי לקוח</h2>
            <div class="info-box">
              <div class="info-label">שם:</div>
              <div>${customer.customer_name}</div>
            </div>
            <div class="info-box">
              <div class="info-label">אימייל:</div>
              <div><a href="mailto:${customer.email}">${customer.email}</a></div>
            </div>
            <div class="info-box">
              <div class="info-label">טלפון:</div>
              <div><a href="tel:${customer.phone}">${customer.phone}</a></div>
            </div>
            ${order.notes ? `
            <div class="info-box">
              <div class="info-label">הערות:</div>
              <div>${order.notes}</div>
            </div>
            ` : ''}

            <h2>פריטים שהוזמנו</h2>
            <table>
              <thead>
                <tr>
                  <th>מוצר</th>
                  <th>מידה</th>
                  <th>כמות</th>
                  <th style="text-align: left;">מחיר</th>
                </tr>
              </thead>
              <tbody>
                ${buildItemsTable(items)}
              </tbody>
            </table>

            <div style="margin-top: 20px; background: #f8f9fa; padding: 15px; border-radius: 8px;">
              <div style="margin-bottom: 8px;">סכום ביניים: <strong>${formatCurrency(order.subtotal)}</strong></div>
              ${order.discount_amount > 0 ? `<div style="margin-bottom: 8px; color: #4caf50;">הנחה${order.coupon_code ? ` (${order.coupon_code})` : ''}: <strong>-${formatCurrency(order.discount_amount)}</strong></div>` : ''}
              <div style="margin-bottom: 8px;">משלוח: <strong>${formatCurrency(order.delivery_cost)}</strong></div>
              <div style="margin-bottom: 8px;">מע"מ (כלול): <strong>${formatCurrency(order.tax)}</strong></div>
              <div style="font-size: 18px; font-weight: bold; border-top: 2px solid #4caf50; padding-top: 10px; margin-top: 10px;">
                סה"כ: ${formatCurrency(order.total)}
              </div>
            </div>
          </div>
          <div class="footer">
            <p>מערכת הזמנות - שטיחי בוטיק יוסף</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
הזמנה חדשה! ${order.order_number}

פרטי לקוח:
שם: ${customer.customer_name}
אימייל: ${customer.email}
טלפון: ${customer.phone}
${order.notes ? `הערות: ${order.notes}` : ''}

פריטים:
${items.map(item => `- ${item.product_name} | מידה: ${item.variant_size} | כמות: ${item.quantity} | ${formatCurrency(item.price * item.quantity)}`).join('\n')}

סכום ביניים: ${formatCurrency(order.subtotal)}
${order.discount_amount > 0 ? `הנחה${order.coupon_code ? ` (${order.coupon_code})` : ''}: -${formatCurrency(order.discount_amount)}\n` : ''}משלוח: ${formatCurrency(order.delivery_cost)}
מע"מ (כלול): ${formatCurrency(order.tax)}
סה"כ: ${formatCurrency(order.total)}
    `,
  };

  await sgMail.send(msg);
}
