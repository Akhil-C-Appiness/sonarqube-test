# #!/bin/bash
# # Stop and delete the existing PM2 process
# pm2 stop "itms"
# pm2 delete "itms"

# # Install dependencies and build
# npm install --legacy-peer-deps
# npm run build

# # Start the new PM2 process
# pm2 start npm --name "itms" -- start -- -p 30000

npm install --legacy-peer-deps
npm run build

pm2 start npm --name "itms" -- start