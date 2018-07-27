import {
  app,
  BrowserWindow,
  ipcMain,
  webContents
} from 'electron'

var fs = require('fs')
var path = require('path')

var SerialPort = require('serialport');
var port = new SerialPort('/dev/ttyUSB0');
let bufferString = '';

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

ipcMain.on('konfig:save', function (e, item) {
  let dataToSave = JSON.stringify(item)
  let pathFile = path.join(__dirname, '../renderer/assets/json/konfigurasi.json')
  // save to json file
  fs.writeFile(pathFile, dataToSave, 'utf8', function () {
    console.log('data tersimpan')
  })
})

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

// //notes: don't forget to set serial device permission by running this command (on linux): 'sudo usermod -a -G dialout $USER' && sudo reboot @hammashamzah
// // Open errors will be emitted as an error event
port.on('error', function (err) {
  console.log('Error koneksi ke serial: ', err.message); 
})

port.on('readable', function () {
  let temp = port.read().toString();
  if (temp == '\n') {
    // parse first here 
    let berat = bufferString.split(' ')[4];
    berat = parseFloat(berat.substring(0, berat.length - 3) * 1000);
    // console.log(bufferString)
    mainWindow.webContents.send('serialtimbangan', berat);
    // ipcMain.send('serialtimbangan', bufferString);
    bufferString = '';
  } else {
    bufferString = bufferString + temp;
  }
});