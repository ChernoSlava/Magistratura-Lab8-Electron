const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

// Путь к базе данных в папке пользователя (AppData/Roaming/...)
const DB_PATH = path.join(app.getPath('userData'), 'lab8_database.json');

function createWindow() {
    const win = new BrowserWindow({
        width: 900,
        height: 700,
        title: 'ULIM Lab 8 - GUI & CRUD',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    win.loadFile(path.join(__dirname, 'index.html'));
}

// IPC: Сохранение данных
ipcMain.handle('save-to-disk', async (event, dataArray) => {
    try {
        const jsonContent = JSON.stringify(dataArray, null, 2);
        fs.writeFileSync(DB_PATH, jsonContent, 'utf-8');
        return { success: true, path: DB_PATH };
    } catch (err) {
        return { success: false, error: err.message };
    }
});

// IPC: Загрузка данных
ipcMain.handle('load-from-disk', async () => {
    try {
        if (!fs.existsSync(DB_PATH)) return [];
        const rawData = fs.readFileSync(DB_PATH, 'utf-8');
        return JSON.parse(rawData);
    } catch (err) {
        console.error('Read error:', err);
        return [];
    }
});

// IPC: Выбор пользовательского файла
ipcMain.handle('open-file-dialog', async () => {
    const result = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'JSON Files', extensions: ['json'] }]
    });

    if (result.canceled || result.filePaths.length === 0) return null;

    const filePath = result.filePaths[0];
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    app.quit();
});
