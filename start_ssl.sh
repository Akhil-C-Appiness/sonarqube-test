

npm install --legacy-peer-deps
sudo rm -rf .next    
npm run build
# pm2 start npm --name "itms" -- stop
pm2 delete all

pm2 start npm --name "itms" -- start

#add ssl for localhost
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ./onsite.key -out ./onsite.crt -subj "/C=IN/ST=Karnataka/L=Bangalore/O=ITMS/OU=IT/CN=localhost"


sudo cp onsite.crt /etc/ssl/certs/onsite.crt
sudo cp onsite.key /etc/ssl/private/onsite.key

sudo cp nginx.conf /opt/homebrew/etc/nginx/nginx.conf

sudo chmod 600 /etc/ssl/certs/onsite.crt
sudo chmod 600 /etc/ssl/private/onsite.key

sudo brew services restart nginx

# sudo service nginx restart
# sudo service nginx status
