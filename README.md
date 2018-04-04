# phi-electron 

### Setup

```
sudo apt-get install git
sudo apt-get install npm
sudo npm install -g n
sudo n latest
node -v
git clone https://github.com/wisnuc/phi-electron.git
cd phi-electron
npm install --registry=https://registry.npm.taobao.org
npm run rebuild (alt: ./node_modules/.bin/electron-rebuild -e '~/fruitmix-desktop/node_modules/electron/dist' -v 1.7.9)
npm run webpack2
npm start
```

### Development 

```
npm run webpack       // webpack with HMR
npm run devel         // start with devTools and auto-restart when any file changed
```
