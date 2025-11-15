<div align="center">

# Lang Weaver

**Профессиональный инструмент для управления локализацией игр**

[![License](https://img.shields.io/badge/license-BSD--3--Clause-blue.svg)](LICENSE)
[![Electron](https://img.shields.io/badge/Electron-28.1.0-47848F?logo=electron&logoColor=white)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20Linux%20%7C%20macOS-lightgrey)]()

*Упростите процесс локализации вашей игры с помощью мощного десктопного приложения в ретро-стиле*

[Возможности](#-возможности) • [Установка](#-установка) • [Быстрый старт](#-быстрый-старт) • [Документация](#-документация)

</div>

---

## Возможности

- **Управление переводами** - Визуальный табличный редактор с валидацией в реальном времени
- **Система диалогов** - Встроенный JSON редактор для ветвящихся диалогов на базе Monaco Editor
- **Менеджер ключей** - Организация ключей переводов по категориям
- **Мультиязычность** - Добавление неограниченного количества языков с флагами
- **Умный экспорт** - Экспорт в вложенную JSON структуру с опцией минификации
- **База данных SQLite** - Все данные хранятся в портативных `.locproj` файлах
- **Ретро тёмная тема** - Киберпанк UI с эффектом стекла
- **Нативная производительность** - Создано на Electron для максимальной скорости

## Установка

### Готовые сборки

Скачайте последнюю версию для вашей платформы:

**Windows**
```bash
# Установщик
Lang_Weaver_Setup_1.0.3.exe

# Портативная версия
Lang_Weaver_1.0.3_Portable.exe
```

**Linux/macOS** - Сборка из исходников (см. ниже)

### Сборка из исходников

**Требования:**
- Node.js 18+ 
- npm или yarn

**Шаги:**

```bash
# Клонировать репозиторий
git clone https://github.com/n0tnone/lang-weaver.git
cd lang-weaver

# Установить зависимости
npm install

# Пересобрать нативные модули
npm run rebuild

# Режим разработки
npm start

# Сборка для продакшена
npm run dist          # Текущая платформа
npm run dist:win      # Windows
npm run dist:portable # Windows портативная
npm run dist:all      # Все платформы
```

## Быстрый старт

### 1. Создайте проект

Запустите Lang Weaver и нажмите **Создать новый проект**. Выберите место для вашего `.locproj` файла.

### 2. Добавьте языки

Перейдите на вкладку **Ключи** и добавьте целевые языки:

```
Код: ru    Название: Русский
Код: en    Название: English
Код: jp    Название: 日本語
```

### 3. Добавьте ключи переводов

Перейдите на вкладку **Переводы** и создайте ключи:

```
Ключ: ui.menu.start        Категория: ui
Ключ: dialog.intro.hello   Категория: dialog
Ключ: item.sword.name      Категория: item
```

### 4. Переведите

Кликните на любую ячейку для редактирования. Ключи с отсутствующими переводами подсвечены красным.

### 5. Экспортируйте

Нажмите **Экспорт** → Выберите папку → Ваши переводы будут экспортированы как:

```
output/
  ├─ ru.json
  ├─ en.json
  └─ jp.json
```

## Документация

### Структура проекта

```
project.locproj (База данных SQLite)
├─ languages      # Определения языков
├─ keys           # Ключи переводов
├─ translations   # Связи ключ-язык-значение
└─ dialog_files   # JSON деревья диалогов
```

### Формат диалогов

```json
{
  "dialog_id": "intro",
  "nodes": [
    {
      "id": "start",
      "type": "text",
      "text": "dialog.intro.greeting",
      "next": "choice1"
    },
    {
      "id": "choice1",
      "type": "choice",
      "text": "dialog.intro.question",
      "choices": [
        {
          "text": "dialog.intro.yes",
          "next": "yes_path"
        },
        {
          "text": "dialog.intro.no",
          "next": "no_path"
        }
      ]
    },
    {
      "id": "end",
      "type": "end"
    }
  ]
}
```

### Структура экспорта

Вложенные ключи автоматически структурируются:

```json
// Входные ключи
"ui.menu.start"
"ui.menu.options"

// Выходной JSON
{
  "ui": {
    "menu": {
      "start": "Начать игру",
      "options": "Настройки"
    }
  }
}
```

## Технологии

- **Frontend:** React 19, Vite
- **Редактор:** Monaco Editor
- **База данных:** better-sqlite3
- **Desktop:** Electron 28
- **UI:** Кастомный CSS с шрифтом JetBrains Mono
- **Иконки:** Lucide React, Country Flag Icons

## Лицензия

MIT License - подробности в [LICENSE](LICENSE)

## Автор

**txpa**
- Email: n3everlessy@yandex.ru
- GitHub: [@n0tnone](https://github.com/n0tnone)

---

<div align="center">

**⭐ Поставьте звезду, если проект помог вам!**

</div>