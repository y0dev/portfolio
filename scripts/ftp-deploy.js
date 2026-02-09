const { Client } = require('basic-ftp');
const fs = require('fs');
const path = require('path');

// Check required environment variables
if (!process.env.FTP_HOST || !process.env.FTP_USER || !process.env.FTP_PASSWORD) {
  console.error('Error: FTP_HOST, FTP_USER, and FTP_PASSWORD environment variables are required');
  process.exit(1);
}

async function deploy() {
  const client = new Client();
  client.ftp.verbose = true;

  const config = {
    host: process.env.FTP_HOST,
    user: process.env.FTP_USER,
    password: process.env.FTP_PASSWORD,
    port: parseInt(process.env.FTP_PORT || '21'),
    secure: process.env.FTP_SECURE === 'true',
  };

  const remotePath = process.env.FTP_REMOTE_PATH || '/';
  const localPath = path.join(process.cwd(), 'out');

  try {
    console.log('Connecting to FTP server...');
    await client.access(config);
    console.log('Connected successfully!');

    // Change to remote directory
    await client.cd(remotePath);
    console.log(`Changed to remote directory: ${remotePath}`);

    // Upload all files recursively
    console.log('Uploading files...');
    await uploadDirectory(client, localPath, remotePath);

    console.log('Upload complete!');
  } catch (error) {
    console.error('FTP deployment error:', error);
    process.exit(1);
  } finally {
    client.close();
  }
}

async function uploadDirectory(client, localDir, remoteDir) {
  const files = fs.readdirSync(localDir);

  for (const file of files) {
    const localPath = path.join(localDir, file);
    const remotePath = `${remoteDir}/${file}`;

    const stat = fs.statSync(localPath);

    if (stat.isDirectory()) {
      // Create directory on FTP server
      try {
        await client.ensureDir(remotePath);
        console.log(`Created directory: ${remotePath}`);
      } catch (error) {
        // Directory might already exist, continue
        console.log(`Directory exists or created: ${remotePath}`);
      }
      
      // Recursively upload directory contents
      await uploadDirectory(client, localPath, remotePath);
    } else {
      // Upload file
      try {
        await client.uploadFrom(localPath, remotePath);
        console.log(`Uploaded: ${remotePath}`);
      } catch (error) {
        console.error(`Error uploading ${remotePath}:`, error.message);
        throw error;
      }
    }
  }
}

// Run deployment
deploy().catch(error => {
  console.error('Deployment failed:', error);
  process.exit(1);
});

