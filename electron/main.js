const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

let mainWindow;
let currentDb = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      devTools: app.isPackaged ? false : true
    },
    backgroundColor: '#1a1a1a',
    titleBarStyle: 'default',
    icon: path.join(__dirname, '../../build/icon.ico')
  });

    const isDev = !app.isPackaged;

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    if (process.env.DEBUG) {
      mainWindow.webContents.openDevTools();
    }
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.webContents.setWindowOpenHandler(() => {
    return { action: 'deny' };
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (currentDb) currentDb.close();
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// === IPC Handlers ===

ipcMain.handle('create-project', async (event, projectPath) => {
  try {
    if (currentDb) currentDb.close();
    
    currentDb = new Database(projectPath);
    
    // Создание схемы
    currentDb.exec(`
      CREATE TABLE IF NOT EXISTS languages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS keys (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT UNIQUE NOT NULL,
        category TEXT NOT NULL DEFAULT 'general',
        used_in TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS translations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key_id INTEGER NOT NULL,
        language_id INTEGER NOT NULL,
        value TEXT,
        FOREIGN KEY (key_id) REFERENCES keys(id) ON DELETE CASCADE,
        FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE CASCADE,
        UNIQUE(key_id, language_id)
      );
      
      CREATE TABLE IF NOT EXISTS dialog_files (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filename TEXT UNIQUE NOT NULL,
        content TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS project_meta (
        key TEXT PRIMARY KEY,
        value TEXT
      );
    `);
    
    // Добавление языков по умолчанию
    const insertLang = currentDb.prepare('INSERT OR IGNORE INTO languages (code, name) VALUES (?, ?)');
    insertLang.run('ru', 'Русский');
    insertLang.run('en', 'English');
    insertLang.run('jp', '日本語');
    
    // Мета-информация
    const insertMeta = currentDb.prepare('INSERT OR REPLACE INTO project_meta (key, value) VALUES (?, ?)');
    insertMeta.run('created_at', new Date().toISOString());
    insertMeta.run('version', '1.0.0');
    
    return { success: true, path: projectPath };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('open-project', async (event, projectPath) => {
  try {
    if (currentDb) currentDb.close();
    
    if (!fs.existsSync(projectPath)) {
      throw new Error('Project file not found');
    }
    
    currentDb = new Database(projectPath);
    return { success: true, path: projectPath };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('show-save-dialog', async () => {
  const result = await dialog.showSaveDialog(mainWindow, {
    title: 'Create Project',
    defaultPath: 'project.locproj',
    filters: [{ name: 'Localization Project', extensions: ['locproj'] }]
  });
  return result;
});

ipcMain.handle('show-open-dialog', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Open Project',
    filters: [{ name: 'Localization Project', extensions: ['locproj'] }],
    properties: ['openFile']
  });
  return result;
});

ipcMain.handle('show-export-dialog', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Select Export Directory',
    properties: ['openDirectory']
  });
  return result;
});

// === Database Operations ===

ipcMain.handle('get-languages', async () => {
  if (!currentDb) return [];
  try {
    return currentDb.prepare('SELECT * FROM languages ORDER BY id').all();
  } catch (error) {
    console.error(error);
    return [];
  }
});

ipcMain.handle('add-language', async (event, { code, name }) => {
  if (!currentDb) return { success: false };
  try {
    const stmt = currentDb.prepare('INSERT INTO languages (code, name) VALUES (?, ?)');
    stmt.run(code, name);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-all-keys', async () => {
  if (!currentDb) return [];
  try {
    return currentDb.prepare('SELECT * FROM keys ORDER BY key').all();
  } catch (error) {
    console.error(error);
    return [];
  }
});

ipcMain.handle('add-key', async (event, { key, category }) => {
  if (!currentDb) return { success: false };
  try {
    const stmt = currentDb.prepare('INSERT INTO keys (key, category) VALUES (?, ?)');
    const result = stmt.run(key, category || 'general');
    return { success: true, id: result.lastInsertRowid };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('delete-key', async (event, keyId) => {
  if (!currentDb) return { success: false };
  try {
    currentDb.prepare('DELETE FROM keys WHERE id = ?').run(keyId);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-translations', async () => {
  if (!currentDb) return [];
  try {
    const query = `
      SELECT 
        k.id as key_id,
        k.key,
        k.category,
        k.used_in,
        l.id as lang_id,
        l.code as lang_code,
        t.value
      FROM keys k
      CROSS JOIN languages l
      LEFT JOIN translations t ON t.key_id = k.id AND t.language_id = l.id
      ORDER BY k.key, l.id
    `;
    return currentDb.prepare(query).all();
  } catch (error) {
    console.error(error);
    return [];
  }
});

ipcMain.handle('update-translation', async (event, { keyId, languageId, value }) => {
  if (!currentDb) return { success: false };
  try {
    const stmt = currentDb.prepare(`
      INSERT INTO translations (key_id, language_id, value) 
      VALUES (?, ?, ?)
      ON CONFLICT(key_id, language_id) 
      DO UPDATE SET value = excluded.value
    `);
    stmt.run(keyId, languageId, value);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('save-dialog-file', async (event, { filename, content }) => {
  if (!currentDb) return { success: false };
  try {
    const stmt = currentDb.prepare(`
      INSERT INTO dialog_files (filename, content, updated_at) 
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(filename) 
      DO UPDATE SET content = excluded.content, updated_at = CURRENT_TIMESTAMP
    `);
    stmt.run(filename, content);
    
    // Обновление used_in для ключей
    const keys = extractKeysFromDialog(content);
    const updateStmt = currentDb.prepare(`
      UPDATE keys 
      SET used_in = CASE 
        WHEN used_in IS NULL THEN ?
        WHEN used_in NOT LIKE '%' || ? || '%' THEN used_in || ',' || ?
        ELSE used_in
      END
      WHERE key = ?
    `);
    
    for (const key of keys) {
      updateStmt.run(filename, filename, filename, key);
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-dialog-files', async () => {
  if (!currentDb) return [];
  try {
    return currentDb.prepare('SELECT * FROM dialog_files ORDER BY filename').all();
  } catch (error) {
    console.error(error);
    return [];
  }
});

ipcMain.handle('delete-dialog-file', async (event, filename) => {
  if (!currentDb) return { success: false };
  try {
    currentDb.prepare('DELETE FROM dialog_files WHERE filename = ?').run(filename);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('export-translations', async (event, { exportPath, minify }) => {
  if (!currentDb) return { success: false };
  try {
    const languages = currentDb.prepare('SELECT * FROM languages').all();
    const translations = currentDb.prepare(`
      SELECT k.key, l.code, t.value
      FROM translations t
      JOIN keys k ON k.id = t.key_id
      JOIN languages l ON l.id = t.language_id
      WHERE t.value IS NOT NULL AND t.value != ''
    `).all();
    
    // Группировка по языкам
    for (const lang of languages) {
      const langData = {};
      
      translations
        .filter(t => t.code === lang.code)
        .forEach(t => {
          const parts = t.key.split('.');
          let current = langData;
          
          for (let i = 0; i < parts.length - 1; i++) {
            if (!current[parts[i]]) current[parts[i]] = {};
            current = current[parts[i]];
          }
          
          current[parts[parts.length - 1]] = t.value;
        });
      
      const json = minify 
        ? JSON.stringify(langData)
        : JSON.stringify(langData, null, 2);
      
      fs.writeFileSync(
        path.join(exportPath, `${lang.code}.json`),
        json,
        'utf8'
      );
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.on('minimize-window', () => {
    mainWindow.minimize();
});

ipcMain.on('maximize-window', () => {
    if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
    } else {
        mainWindow.maximize();
    }
});

ipcMain.on('close-window', () => {
    mainWindow.close();
});

// Вспомогательная функция для извлечения ключей из диалога
function extractKeysFromDialog(content) {
  try {
    const dialog = JSON.parse(content);
    const keys = new Set();
    
    if (dialog.nodes && Array.isArray(dialog.nodes)) {
      dialog.nodes.forEach(node => {
        if (node.text) keys.add(node.text);
        if (node.choices && Array.isArray(node.choices)) {
          node.choices.forEach(choice => {
            if (choice.text) keys.add(choice.text);
          });
        }
      });
    }
    
    return Array.from(keys);
  } catch {
    return [];
  }
}