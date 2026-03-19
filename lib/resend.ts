import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const EMAIL_FROM = 'שטיחי בוטיק יוסף <info@boutique-yossef.co.il>';

export { resend, EMAIL_FROM };
