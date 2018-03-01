let secrets = null;
try {
  secrets = require('../../secrets.json');
}
// JavaScript apparently can't do inner exceptions, so you get this instead.
catch (e) {
  console.error("Could not load secrets.json. This file is required in the root directory and may be missing. See documentation for details.\n");
  throw e;
}

// Node settings
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.SERVER_PORT = process.env.SERVER_PORT || '3000';

// Database settings
process.env.POSTGRES_CONNECTION_STRING = secrets.POSTGRES_CONNECTION_STRING;
process.env.ADMIN_EMAIL = secrets.ADMIN_EMAIL;
process.env.ADMIN_PASSWORD = secrets.ADMIN_PASSWORD;

// JWT settings
process.env.JWT_SECRET = secrets.JWT_SECRET;

// SendGrid settings
process.env.SENDGRID_API_KEY = secrets.SENDGRID_API_KEY;
process.env.NOREPLY_EMAIL = secrets.NOREPLY_EMAIL;

// S3 Bucket settings
process.env.VIDEO_ACCESS_KEY = secrets.VIDEO_ACCESS_KEY;
process.env.VIDEO_SECRET_KEY = secrets.VIDEO_SECRET_KEY;
