// ============================================
// Localization System
// ============================================

export const translations = {
  ru: {
    // App Header
    app_title: 'Инструмент локализации игр',
    export_button: 'Экспорт',
    
    // Stats
    stats_keys: 'Ключей',
    stats_translated: 'Переведено',
    stats_unused: 'Не использовано',
    
    // Tabs
    tab_translations: 'Переводы',
    tab_dialogs: 'Диалоги',
    tab_keys: 'Управление ключами',
    
    // Project Manager
    project_title: 'Инструмент локализации игр',
    project_subtitle: 'Управляйте переводами вашей игры эффективно',
    project_create: 'Создать новый проект',
    project_open: 'Открыть существующий',
    project_extension_note: 'Файлы проектов используют расширение .locproj',
    
    // Translation Table
    trans_search_placeholder: 'Поиск ключей или переводов...',
    trans_new_key_placeholder: 'Новый ключ (например, ui.menu.start)',
    trans_add_key: 'Добавить ключ',
    trans_key: 'Ключ',
    trans_category: 'Категория',
    trans_delete_confirm: 'Удалить этот ключ и все его переводы?',
    trans_edit_placeholder: 'Нажмите для редактирования...',
    
    // Categories
    category_general: 'Общее',
    category_ui: 'Интерфейс',
    category_dialog: 'Диалоги',
    category_item: 'Предметы',
    category_quest: 'Квесты',
    
    // Dialog Editor
    dialog_create_placeholder: 'имя_диалога.json',
    dialog_create_button: 'Создать файл',
    dialog_delete_button: 'Удалить',
    dialog_save_button: 'Сохранить',
    dialog_delete_confirm: 'Удалить',
    dialog_saved: 'Диалог успешно сохранён!',
    dialog_error_save: 'Ошибка сохранения диалога',
    dialog_error_create: 'Ошибка создания файла',
    dialog_select_message: 'Выберите файл диалога или создайте новый',
    dialog_errors: 'ошибок',
    dialog_missing_keys: 'отсутствующих ключей',
    
    // Dialog Structure Help
    help_dialog_structure: 'Структура диалога',
    help_node_types: 'Типы узлов',
    help_node_text: 'Отображение текста',
    help_node_choice: 'Выбор игрока',
    help_node_end: 'Завершение диалога',
    help_available_keys: 'Доступные ключи',
    help_and_more: 'и ещё',
    
    // Validation Errors
    validation_missing_id: 'Отсутствует dialog_id',
    validation_missing_nodes: 'Отсутствует или неверен массив nodes',
    validation_node_missing_id: 'Узел {idx}: отсутствует id',
    validation_node_missing_type: 'Узел {idx}: отсутствует type',
    validation_invalid_json: 'Неверный JSON',
    validation_missing_key: 'Отсутствующий ключ',
    
    // Key Manager
    keys_languages_title: 'Языки',
    keys_add_lang_code: 'Код языка (например, de)',
    keys_add_lang_name: 'Название языка (например, Deutsch)',
    keys_add_language: 'Добавить язык',
    keys_error_add_lang: 'Ошибка добавления языка',
    keys_overview_title: 'Обзор ключей',
    keys_search_placeholder: 'Поиск ключей...',
    keys_stat_total: 'Всего ключей',
    keys_stat_categories: 'Категорий',
    keys_stat_used: 'Используется в диалогах',
    keys_stat_unused: 'Не используется',
    keys_used_in: 'Используется в',
    
    // Export Dialog
    export_title: 'Экспорт переводов',
    export_description: 'Экспорт переводов в JSON файлы (по одному на язык).',
    export_minify: 'Минифицировать JSON',
    export_format: 'Формат вывода:',
    export_cancel: 'Отмена',
    export_exporting: 'Экспорт...',
    export_success_title: 'Экспорт успешен!',
    export_success_message: 'Файлы переводов были созданы.',
    export_error: 'Ошибка экспорта',
    
    // Messages
    msg_error_prefix: 'Ошибка',
    msg_success_prefix: 'Успех',
    
    // Languages
    lang_russian: 'Русский',
    lang_english: 'English',
    lang_japanese: '日本語',
  },
  
  en: {
    // App Header
    app_title: 'Game Localization Tool',
    export_button: 'Export',
    
    // Stats
    stats_keys: 'Keys',
    stats_translated: 'Translated',
    stats_unused: 'Unused',
    
    // Tabs
    tab_translations: 'Translations',
    tab_dialogs: 'Dialogs',
    tab_keys: 'Keys Manager',
    
    // Project Manager
    project_title: 'Game Localization Tool',
    project_subtitle: 'Manage your game translations efficiently',
    project_create: 'Create New Project',
    project_open: 'Open Existing Project',
    project_extension_note: 'Project files use .locproj extension',
    
    // Translation Table
    trans_search_placeholder: 'Search keys or translations...',
    trans_new_key_placeholder: 'New key (e.g. ui.menu.start)',
    trans_add_key: 'Add Key',
    trans_key: 'Key',
    trans_category: 'Category',
    trans_delete_confirm: 'Delete this key and all its translations?',
    trans_edit_placeholder: 'Click to edit...',
    
    // Categories
    category_general: 'General',
    category_ui: 'UI',
    category_dialog: 'Dialog',
    category_item: 'Item',
    category_quest: 'Quest',
    
    // Dialog Editor
    dialog_create_placeholder: 'dialog_name.json',
    dialog_create_button: 'Create file',
    dialog_delete_button: 'Delete',
    dialog_save_button: 'Save',
    dialog_delete_confirm: 'Delete',
    dialog_saved: 'Dialog saved successfully!',
    dialog_error_save: 'Error saving dialog',
    dialog_error_create: 'Error creating file',
    dialog_select_message: 'Select a dialog file or create a new one',
    dialog_errors: 'errors',
    dialog_missing_keys: 'missing keys',
    
    // Dialog Structure Help
    help_dialog_structure: 'Dialog Structure',
    help_node_types: 'Node Types',
    help_node_text: 'Display text',
    help_node_choice: 'Player choice',
    help_node_end: 'End dialog',
    help_available_keys: 'Available Keys',
    help_and_more: 'and more',
    
    // Validation Errors
    validation_missing_id: 'Missing dialog_id',
    validation_missing_nodes: 'Missing or invalid nodes array',
    validation_node_missing_id: 'Node {idx}: missing id',
    validation_node_missing_type: 'Node {idx}: missing type',
    validation_invalid_json: 'Invalid JSON',
    validation_missing_key: 'Missing key',
    
    // Key Manager
    keys_languages_title: 'Languages',
    keys_add_lang_code: 'Language code (e.g. de)',
    keys_add_lang_name: 'Language name (e.g. Deutsch)',
    keys_add_language: 'Add Language',
    keys_error_add_lang: 'Error adding language',
    keys_overview_title: 'Keys Overview',
    keys_search_placeholder: 'Search keys...',
    keys_stat_total: 'Total Keys',
    keys_stat_categories: 'Categories',
    keys_stat_used: 'Used in Dialogs',
    keys_stat_unused: 'Unused',
    keys_used_in: 'Used in',
    
    // Export Dialog
    export_title: 'Export Translations',
    export_description: 'Export translations to JSON files (one per language).',
    export_minify: 'Minify JSON output',
    export_format: 'Output format:',
    export_cancel: 'Cancel',
    export_exporting: 'Exporting...',
    export_success_title: 'Export Successful!',
    export_success_message: 'Translation files have been created.',
    export_error: 'Export failed',
    
    // Messages
    msg_error_prefix: 'Error',
    msg_success_prefix: 'Success',
    
    // Languages
    lang_russian: 'Русский',
    lang_english: 'English',
    lang_japanese: '日本語',
  },
  
  jp: {
    // App Header
    app_title: 'ゲームローカライゼーションツール',
    export_button: 'エクスポート',
    
    // Stats
    stats_keys: 'キー',
    stats_translated: '翻訳済み',
    stats_unused: '未使用',
    
    // Tabs
    tab_translations: '翻訳',
    tab_dialogs: 'ダイアログ',
    tab_keys: 'キー管理',
    
    // Project Manager
    project_title: 'ゲームローカライゼーションツール',
    project_subtitle: 'ゲームの翻訳を効率的に管理',
    project_create: '新規プロジェクト作成',
    project_open: '既存プロジェクトを開く',
    project_extension_note: 'プロジェクトファイルは .locproj 拡張子を使用',
    
    // Translation Table
    trans_search_placeholder: 'キーまたは翻訳を検索...',
    trans_new_key_placeholder: '新しいキー (例: ui.menu.start)',
    trans_add_key: 'キーを追加',
    trans_key: 'キー',
    trans_category: 'カテゴリ',
    trans_delete_confirm: 'このキーとすべての翻訳を削除しますか？',
    trans_edit_placeholder: 'クリックして編集...',
    
    // Categories
    category_general: '一般',
    category_ui: 'UI',
    category_dialog: 'ダイアログ',
    category_item: 'アイテム',
    category_quest: 'クエスト',
    
    // Dialog Editor
    dialog_create_placeholder: 'dialog_name.json',
    dialog_create_button: 'ファイル作成',
    dialog_delete_button: '削除',
    dialog_save_button: '保存',
    dialog_delete_confirm: '削除',
    dialog_saved: 'ダイアログが正常に保存されました！',
    dialog_error_save: 'ダイアログ保存エラー',
    dialog_error_create: 'ファイル作成エラー',
    dialog_select_message: 'ダイアログファイルを選択するか、新規作成してください',
    dialog_errors: 'エラー',
    dialog_missing_keys: '不足しているキー',
    
    // Dialog Structure Help
    help_dialog_structure: 'ダイアログ構造',
    help_node_types: 'ノードタイプ',
    help_node_text: 'テキスト表示',
    help_node_choice: 'プレイヤーの選択',
    help_node_end: 'ダイアログ終了',
    help_available_keys: '利用可能なキー',
    help_and_more: 'その他',
    
    // Validation Errors
    validation_missing_id: 'dialog_idがありません',
    validation_missing_nodes: 'nodesが無効です',
    validation_node_missing_id: 'ノード {idx}: idがありません',
    validation_node_missing_type: 'ノード {idx}: typeがありません',
    validation_invalid_json: '無効なJSON',
    validation_missing_key: 'キーがありません',
    
    // Key Manager
    keys_languages_title: '言語',
    keys_add_lang_code: '言語コード (例: de)',
    keys_add_lang_name: '言語名 (例: Deutsch)',
    keys_add_language: '言語を追加',
    keys_error_add_lang: '言語追加エラー',
    keys_overview_title: 'キー概要',
    keys_search_placeholder: 'キーを検索...',
    keys_stat_total: '総キー数',
    keys_stat_categories: 'カテゴリ',
    keys_stat_used: 'ダイアログで使用',
    keys_stat_unused: '未使用',
    keys_used_in: '使用場所',
    
    // Export Dialog
    export_title: '翻訳のエクスポート',
    export_description: 'JSONファイルに翻訳をエクスポート（言語ごとに1つ）',
    export_minify: 'JSONを圧縮',
    export_format: '出力形式:',
    export_cancel: 'キャンセル',
    export_exporting: 'エクスポート中...',
    export_success_title: 'エクスポート成功！',
    export_success_message: '翻訳ファイルが作成されました。',
    export_error: 'エクスポート失敗',
    
    // Messages
    msg_error_prefix: 'エラー',
    msg_success_prefix: '成功',
    
    // Languages
    lang_russian: 'Русский',
    lang_english: 'English',
    lang_japanese: '日本語',
  }
};

// Hook для использования локализации
export function useTranslation(lang = 'ru') {
  const t = (key) => {
    return translations[lang]?.[key] || key;
  };
  
  return { t };
}

// Список доступных языков
export const availableLanguages = [
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'jp', name: '日本語', flag: '🇯🇵' }
];