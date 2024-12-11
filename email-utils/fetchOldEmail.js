const Imap = require('imap-simple');
const simpleParser = require('mailparser').simpleParser;
const qp = require('quoted-printable');

const config = {
  imap: {
    user: 'marcelmueller@visitorstart.de',
    password: '47f66xeo2khd1!#A',
    host: 'imap.hostinger.com',
    port: 993,
    tls: true,
    tlsOptions: { rejectUnauthorized: false },
  },
};

async function fetchResetLink() {
  try {
    const connection = await Imap.connect(config);
    await connection.openBox('INBOX');

    const searchCriteria = ['ALL']; 
    const fetchOptions = { bodies: ['HEADER', 'TEXT'], struct: true };

    const messages = await connection.search(searchCriteria, fetchOptions);

    for (const message of messages.reverse()) {
      const headerPart = message.parts.find((part) => part.which === 'HEADER');
      const textPart = message.parts.find((part) => part.which === 'TEXT');

      if (!headerPart || !textPart) continue;

      const header = headerPart.body;
      const subject = header.subject ? header.subject[0] : 'No subject';
      const from = header.from ? header.from[0] : 'No sender';
      const receivedDate = header.date ? header.date[0] : 'Unknown date';

      if (subject.includes('Reset password') && from.includes('no-reply@visitorapp.co')) {
        console.log(`Subject: ${subject}`);
        console.log(`From: ${from}`);
        console.log(`Received At: ${receivedDate}`);

        const rawHtml = qp.decode(textPart.body);

        const linkMatches = rawHtml.match(/https?:\/\/[^\s"<]+/g);
        if (linkMatches) {
          console.log('Found links:', linkMatches);

          const resetLink = linkMatches[linkMatches.length - 3]; 

          if (resetLink) {
            connection.end();
            return resetLink;
          }
        }
      }
    }

    connection.end();
    throw new Error('No reset email or link found');
  } catch (err) {
    console.error('Error fetching email:', err.message);
    process.exit(1);
  }
}

fetchResetLink()
  .then((link) => {
    console.log('Reset Link:', link);
  })
  .catch((err) => {
    console.error('Failed to fetch reset link:', err.message);
  });

module.exports = { fetchResetLink };
