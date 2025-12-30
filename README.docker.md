# Docker Setup for Article Creator and Portfolio Deployment

This Docker Compose setup provides:
1. **Article Creator Service**: A Next.js application for creating articles
2. **Deploy Service**: Builds the portfolio and deploys it to an FTP server

## Prerequisites

- Docker and Docker Compose installed
- FTP server credentials

## Setup

1. **Create a `.env` file** in the root directory:

```env
FTP_HOST=your-ftp-server.com
FTP_USER=your-ftp-username
FTP_PASSWORD=your-ftp-password
FTP_PORT=21
FTP_SECURE=false
FTP_REMOTE_PATH=/
```

2. **Build and start the article creator**:

```bash
docker compose up -d article-creator
```

This will:
- Build the article-creator Next.js application
- Start it on port 3000
- Mount the article-backups directory
- Mount the portfolio articles.ts file as read-only

3. **Access the article creator**:

Open your browser to `http://localhost:3000`

## Deploying the Portfolio

To build and deploy the portfolio to your FTP server:

```bash
docker compose --profile deploy run --rm deploy
```

This will:
1. Build the portfolio static export (`npm run build:export`)
2. Format the HTML and JS files
3. Upload all files from the `out` directory to your FTP server

## Services

### article-creator

- **Port**: 3000
- **Volumes**:
  - `./article-creator/article-backups` - Saved article backups
  - `./src/data/articles.ts` - Portfolio articles (read-only)
- **Restart**: unless-stopped

### deploy

- **Profile**: deploy (only runs when explicitly invoked)
- **Environment**: Reads from `.env` file
- **Function**: Builds portfolio and uploads via FTP

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `FTP_HOST` | FTP server hostname | Required |
| `FTP_USER` | FTP username | Required |
| `FTP_PASSWORD` | FTP password | Required |
| `FTP_PORT` | FTP server port | 21 |
| `FTP_SECURE` | Use FTPS (true/false) | false |
| `FTP_REMOTE_PATH` | Remote directory path | / |

## Troubleshooting

### Article Creator won't start

- Check if port 3000 is already in use
- Check Docker logs: `docker-compose logs article-creator`

### Deployment fails

- Verify FTP credentials in `.env` file
- Check FTP server is accessible
- Review deployment logs: `docker-compose --profile deploy run deploy`

### Build fails

- Ensure all dependencies are installed
- Check that all required files are present
- Review build logs in the deploy container

## Development

To work on the article creator locally without Docker:

```bash
cd article-creator
npm install
npm run dev
```

To deploy manually without Docker:

```bash
npm run build:export
node scripts/ftp-deploy.js
```

