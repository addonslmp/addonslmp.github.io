(function () {
    'use strict';

    Lampa.Lang.add({
        mp_title: { ru: 'Мультиплагин', uk: 'Мультиплагін', en: 'Multiplugin' },
        mp_category_plugins: { ru: 'Категории плагинов', uk: 'Категорії плагінів', en: 'Plugin Categories' },
        mp_updated: { ru: 'Обновлено: ', uk: 'Оновлено: ', en: 'Updated: ' },
        mp_sync_plugins: { ru: 'Синхронизировать плагины', uk: 'Синхронізувати плагіни', en: 'Sync Plugins' },
        mp_load_online_only: { ru: 'Загрузить только онлайн', uk: 'Завантажити тільки онлайн', en: 'Load Online Only' },
        mp_management: { ru: 'Управление', uk: 'Керування', en: 'Management' },
        mp_current_plugins: { ru: 'Текущие плагины', uk: 'Поточні плагіни', en: 'Current Plugins' },
        mp_export_to_lampa: { ru: 'Экспорт плагинов в Lampa', uk: 'Експорт плагінів в Lampa', en: 'Export Plugins to Lampa' },
        mp_disable_all: { ru: 'Выключить все плагины', uk: 'Вимкнути всі плагіни', en: 'Disable All Plugins' },
        mp_reload_lampa: { ru: 'Перезагрузить Lampa', uk: 'Перезавантажити Lampa', en: 'Reload Lampa' },
        mp_update_info: { ru: 'Информация об обновлении', uk: 'Інформація про оновлення', en: 'Update Information' },
        mp_last_update: { ru: 'Последнее обновление: ', uk: 'Останнє оновлення: ', en: 'Last Update: ' },
        mp_added: { ru: 'Добавлено:', uk: 'Додано:', en: 'Added:' },
        mp_removed: { ru: 'Удалено:', uk: 'Видалено:', en: 'Removed:' },
        mp_no_changes: { ru: 'Новых изменений нет', uk: 'Нових змін немає', en: 'No new changes' },
        mp_no_plugins: { ru: 'Включённых плагинов нет', uk: 'Увімкнених плагінів немає', en: 'No enabled plugins' },
        mp_no_plugins_category: { ru: 'В категории "%s" нет плагинов', uk: 'У категорії "%s" немає плагінів', en: 'No plugins in category "%s"' },
        mp_plugin_enabled: { ru: '%s включён', uk: '%s увімкнено', en: '%s enabled' },
        mp_plugin_disabled: { ru: '%s отключён', uk: '%s вимкнено', en: '%s disabled' },
        mp_all_disabled: { ru: 'Все плагины отключены', uk: 'Всі плагіни вимкнено', en: 'All plugins disabled' },
        mp_sync_complete: { ru: 'Синхронизация завершена', uk: 'Синхронізація завершена', en: 'Sync completed' },
        mp_online_enabled: { ru: 'Онлайн-плагины включены', uk: 'Онлайн-плагіни увімкнено', en: 'Online plugins enabled' },
        mp_export_complete: { ru: 'Экспорт завершён', uk: 'Експорт завершено', en: 'Export completed' },
        mp_confirm_sync: { ru: 'Синхронизировать актуальные плагины с облака?', uk: 'Синхронізувати актуальні плагіни з хмари?', en: 'Sync latest plugins from cloud?' },
        mp_confirm_online: { ru: 'Загрузить и включить только плагины категории "Онлайн"?', uk: 'Завантажити та увімкнути тільки плагіни категорії "Онлайн"?', en: 'Load and enable only "Online" category plugins?' },
        mp_confirm_disable_all: { ru: 'Вы уверены? Все плагины будут отключены', uk: 'Ви впевнені? Усі плагіни будуть вимкнено', en: 'Are you sure? All plugins will be disabled' },
        mp_export_message: {
            ru: 'Включённые плагины будут добавлены в Lampa как обычные расширения.<br><br>После этого они:<br>• не будут зависеть от мультиплагина<br>• останутся даже после его удаления<br>• удаляются только вручную<br><br>После экспорта Lampa автоматически перезагрузится.',
            uk: 'Увімкнені плагіни будуть додані в Lampa як звичайні розширення.<br><br>Після цього вони:<br>• не залежатимуть від мультиплагіна<br>• залишаться навіть після його видалення<br>• видаляються тільки вручну<br><br>Після експорту Lampa автоматично перезавантажиться.',
            en: 'Enabled plugins will be added to Lampa as regular extensions.<br><br>After that they:<br>• will not depend on multiplugin<br>• will remain even after its removal<br>• can only be removed manually<br><br>Lampa will reload automatically after export.'
        },
        mp_reload_message: { ru: 'Перезапустить приложение?', uk: 'Перезавантажити додаток?', en: 'Restart application?' },
        mp_ok: { ru: 'OK', uk: 'OK', en: 'OK' },
        mp_cancel: { ru: 'Отмена', uk: 'Скасувати', en: 'Cancel' }
    });

    let CURRENT_LANG = Lampa.Storage.get('language', 'ru');

    Lampa.Listener.follow('app', function (e) {
        if (e.type === 'language') CURRENT_LANG = Lampa.Storage.get('language', 'ru');
    });

    function tr(value) {
        if (!value) return '';
        if (typeof value === 'string') return value;
        return value[CURRENT_LANG] || value.ru || '';
    }

    const syncUrl = 'https://addonslmp.github.io/sources/plugins_mp.js';

    const STORAGE_KEY = 'multi_plugins_list';
    const ENABLED_KEY = 'multi_enabled_plugins';
    const INFO_KEY = 'multi_last_update';

    let pluginList = [];
    const loadedPlugins = new Set();

    function lazyLoadPlugin(url) {
        if (loadedPlugins.has(url)) return;
        Lampa.Utils.putScriptAsync([url], () => loadedPlugins.add(url));
    }

    function loadEnabledPlugins() {
        const enabled = new Set(Lampa.Storage.get(ENABLED_KEY, []));
        const toLoad = pluginList
            .filter(p => enabled.has(p.url) && !loadedPlugins.has(p.url))
            .map(p => p.url);

        if (toLoad.length === 0) return;

        Lampa.Utils.putScriptAsync(toLoad, () => {
            toLoad.forEach(url => loadedPlugins.add(url));
        });
    }

    function savePluginList(list) {
        Lampa.Storage.set(STORAGE_KEY, list);
        pluginList = list;
    }

    function getPluginList() {
        return Lampa.Storage.get(STORAGE_KEY, []);
    }

    function saveUpdateInfo(date, added, removed) {
        const info = { date: date || '—', added: added || [], removed: removed || [] };
        Lampa.Storage.set(INFO_KEY, info, true);
    }

    function getUpdateInfo() {
        return Lampa.Storage.get(INFO_KEY, { date: '—', added: [], removed: [] });
    }

    function showInfo() {
        const info = getUpdateInfo();
        let html = '<div class="about" style="text-align:left">';
        html += `<div><b>${Lampa.Lang.translate('mp_last_update')}</b> ${info.date}</div><br>`;
        if (info.added.length) {
            html += `<b>${Lampa.Lang.translate('mp_added')}</b><br>`;
            info.added.forEach(p => {
                const name = tr(p.name) || p.url.split('/').pop();
                html += '• <b>' + name + '</b><br>';
                if (p.description) html += '<div style="color:#bfbfbf; font-size:0.9em; margin-left:18px;">' + tr(p.description) + '</div>';
                html += '<br>';
            });
            html += '<br>';
        }
        if (info.removed.length) {
            html += `<b>${Lampa.Lang.translate('mp_removed')}</b><br>`;
            info.removed.forEach(p => {
                const name = tr(p.name) || p.url.split('/').pop();
                html += '• <b>' + name + '</b><br>';
                if (p.description) html += '<div style="color:#bfbfbf; font-size:0.9em; margin-left:18px;">' + tr(p.description) + '</div>';
                html += '<br>';
            });
            html += '<br>';
        }
        if (!info.added.length && !info.removed.length) html += `<div>${Lampa.Lang.translate('mp_no_changes')}</div>`;
        html += '</div>';
        const prev = Lampa.Controller.enabled().name;
        Lampa.Modal.open({
            title: Lampa.Lang.translate('mp_update_info'),
            align: 'center',
            html: $(html),
            buttons: [{ name: Lampa.Lang.translate('mp_ok'), onSelect: function () { Lampa.Modal.close(); Lampa.Controller.toggle(prev); } }]
        });
    }

    function showCategory(category) {
        const plugins = pluginList.filter(p => tr(p.category || 'Разное') === category);
        if (plugins.length === 0) {
            Lampa.Noty.show(Lampa.Lang.translate('mp_no_plugins_category').replace('%s', category));
            return;
        }
        const enabled = new Set(Lampa.Storage.get(ENABLED_KEY, []));
        const items = plugins.map(p => ({
            title: tr(p.name) || p.url.split('/').pop(),
            subtitle: tr(p.description) || '',
            checkbox: true,
            checked: enabled.has(p.url),
            url: p.url
        }));
        Lampa.Select.show({
            title: category,
            items: items,
            onCheck: function (item) {
                const enabledSet = new Set(Lampa.Storage.get(ENABLED_KEY, []));
                if (item.checked) {
                    enabledSet.add(item.url);
                    lazyLoadPlugin(item.url);
                    Lampa.Noty.show(Lampa.Lang.translate('mp_plugin_enabled').replace('%s', item.title));
                } else {
                    enabledSet.delete(item.url);
                    Lampa.Noty.show(Lampa.Lang.translate('mp_plugin_disabled').replace('%s', item.title));
                }
                Lampa.Storage.set(ENABLED_KEY, Array.from(enabledSet));
            },
            onBack: function () { Lampa.Controller.toggle('settings_component'); }
        });
    }

    function showEnabledPlugins() {
        const enabled = new Set(Lampa.Storage.get(ENABLED_KEY, []));
        const active = pluginList.filter(p => enabled.has(p.url));
        if (active.length === 0) {
            Lampa.Noty.show(Lampa.Lang.translate('mp_no_plugins'));
            return;
        }
        const items = active.map(p => ({
            title: tr(p.name) || p.url.split('/').pop(),
            subtitle: tr(p.description) || '',
            checkbox: true,
            checked: true,
            url: p.url
        }));
        Lampa.Select.show({
            title: Lampa.Lang.translate('mp_current_plugins'),
            items: items,
            onCheck: function (item) {
                if (!item.checked) {
                    const enabledSet = new Set(Lampa.Storage.get(ENABLED_KEY, []));
                    enabledSet.delete(item.url);
                    Lampa.Storage.set(ENABLED_KEY, Array.from(enabledSet));
                    Lampa.Noty.show(Lampa.Lang.translate('mp_plugin_disabled').replace('%s', item.title));
                }
            },
            onBack: function () { Lampa.Controller.toggle('settings_component'); }
        });
    }

    function disableAllPlugins() {
        const prev = Lampa.Controller.enabled().name;
        Lampa.Modal.open({
            title: Lampa.Lang.translate('mp_disable_all'),
            align: 'center',
            html: $('<div class="about">' + Lampa.Lang.translate('mp_confirm_disable_all') + '</div>'),
            buttons: [
                { name: Lampa.Lang.translate('mp_cancel'), onSelect: function () { Lampa.Modal.close(); Lampa.Controller.toggle(prev); } },
                { name: Lampa.Lang.translate('mp_ok'), onSelect: function () { Lampa.Storage.set(ENABLED_KEY, []); Lampa.Noty.show(Lampa.Lang.translate('mp_all_disabled')); Lampa.Modal.close(); Lampa.Controller.toggle(prev); } }
            ]
        });
    }

    function exportToLampa() {
        const prev = Lampa.Controller.enabled().name;
        Lampa.Modal.open({
            title: Lampa.Lang.translate('mp_export_to_lampa'),
            align: 'center',
            html: $('<div class="about">' + Lampa.Lang.translate('mp_export_message') + '</div>'),
            buttons: [
                { name: Lampa.Lang.translate('mp_cancel'), onSelect: function () { Lampa.Modal.close(); Lampa.Controller.toggle(prev); } },
                { name: Lampa.Lang.translate('mp_ok'), onSelect: function () {
                    Lampa.Modal.close();
                    const enabledUrls = Lampa.Storage.get(ENABLED_KEY, []);
                    const installed = Lampa.Plugins.get() || [];
                    let added = 0;
                    enabledUrls.forEach(url => {
                        const plugin = pluginList.find(p => p.url === url);
                        if (!plugin) return;
                        const exists = installed.find(p => p.url === plugin.url);
                        if (exists) return;
                        Lampa.Plugins.add({
                            url: plugin.url,
                            name: tr(plugin.name) || plugin.url.split('/').pop(),
                            status: 1,
                            source: 'multiplugin'
                        });
                        added++;
                    });
                    if (added > 0) Lampa.Plugins.save();
                    window.location.reload();
                }}
            ]
        });
    }

    function confirmAndSync() {
        const prev = Lampa.Controller.enabled().name;
        Lampa.Modal.open({
            title: Lampa.Lang.translate('mp_sync_plugins'),
            align: 'center',
            html: $('<div class="about">' + Lampa.Lang.translate('mp_confirm_sync') + '</div>'),
            buttons: [
                { name: Lampa.Lang.translate('mp_cancel'), onSelect: function () { Lampa.Modal.close(); Lampa.Controller.toggle(prev); } },
                { name: Lampa.Lang.translate('mp_ok'), onSelect: function () { Lampa.Modal.close(); synchronize(() => Lampa.Controller.toggle(prev)); } }
            ]
        });
    }

    function confirmAndLoadOnline() {
        const prev = Lampa.Controller.enabled().name;
        Lampa.Modal.open({
            title: Lampa.Lang.translate('mp_load_online_only'),
            align: 'center',
            html: $('<div class="about">' + Lampa.Lang.translate('mp_confirm_online') + '</div>'),
            buttons: [
                { name: Lampa.Lang.translate('mp_cancel'), onSelect: function () { Lampa.Modal.close(); Lampa.Controller.toggle(prev); } },
                { name: Lampa.Lang.translate('mp_ok'), onSelect: function () { Lampa.Modal.close(); loadOnlyOnline(() => Lampa.Controller.toggle(prev)); } }
            ]
        });
    }

    function loadOnlyOnline(callback = () => {}) {
        Lampa.Loading.start();
        fetch(syncUrl, { cache: 'no-cache' })
            .then(response => response.text())
            .then(text => {
                const listMatch = text.match(/const\s+remotePlugins\s*=\s*(\[[\s\S]*?\])/);
                if (listMatch && listMatch[1]) {
                    const remoteObjects = eval('(' + listMatch[1] + ')');
                    const newList = remoteObjects.map(item => ({
                        url: item.url,
                        name: item.name,
                        description: item.description,
                        category: item.category
                    }));
                    savePluginList(newList);
                    const enabledSet = new Set(Lampa.Storage.get(ENABLED_KEY, []));
                    newList.filter(p => tr(p.category) === 'Онлайн' || tr(p.category) === 'Online').forEach(p => {
                        enabledSet.add(p.url);
                        lazyLoadPlugin(p.url);
                    });
                    Lampa.Storage.set(ENABLED_KEY, Array.from(enabledSet));
                    Lampa.Noty.show(Lampa.Lang.translate('mp_online_enabled'));
                }
            })
            .catch(() => { Lampa.Noty.show('Ошибка загрузки'); })
            .finally(() => { Lampa.Loading.stop(); callback(); });
    }

    function synchronize(callback = () => {}) {
        Lampa.Loading.start();
        fetch(syncUrl, { cache: 'no-cache' })
            .then(response => response.text())
            .then(text => {
                const dateMatch = text.match(/const\s+updateDate\s*=\s*['"]([^'"]+)['"]/);
                const listMatch = text.match(/const\s+remotePlugins\s*=\s*(\[[\s\S]*?\])/);
                if (listMatch && listMatch[1]) {
                    const remoteObjects = eval('(' + listMatch[1] + ')');
                    const newList = remoteObjects.map(item => ({
                        url: item.url,
                        name: item.name,
                        description: item.description,
                        category: item.category
                    }));
                    const prevList = getPluginList();
                    const prevUrls = prevList.map(p => p.url);
                    const newUrls = newList.map(p => p.url);
                    const added = newUrls.filter(x => !prevUrls.includes(x));
                    const removed = prevUrls.filter(x => !newUrls.includes(x));
                    savePluginList(newList);
                    const oldEnabled = new Set(Lampa.Storage.get(ENABLED_KEY, []));
                    const validEnabled = prevUrls.filter(u => oldEnabled.has(u) && newUrls.includes(u));
                    Lampa.Storage.set(ENABLED_KEY, validEnabled);
                    Lampa.Noty.show(Lampa.Lang.translate('mp_sync_complete'));
                }
            })
            .catch(() => { Lampa.Noty.show('Ошибка синхронизации'); })
            .finally(() => { Lampa.Loading.stop(); callback(); });
    }

    function checkUpdatesOnStart() {
        fetch(syncUrl, { cache: 'no-cache' })
            .then(r => r.text())
            .then(text => {
                const dateMatch = text.match(/const\s+updateDate\s*=\s*['"]([^'"]+)['"]/);
                const listMatch = text.match(/const\s+remotePlugins\s*=\s*(\[[\s\S]*?\])/);
                if (!listMatch) return;
                const remoteDate = dateMatch ? dateMatch[1] : '—';
                const remoteObjects = eval('(' + listMatch[1] + ')');
                const remoteList = remoteObjects.map(item => ({
                    url: item.url,
                    name: item.name,
                    description: item.description
                }));
                const localList = getPluginList();
                const localUrls = localList.map(p => p.url);
                const remoteUrls = remoteList.map(p => p.url);
                const added = remoteList.filter(p => !localUrls.includes(p.url)).map(p => ({ url: p.url, name: p.name, description: p.description }));
                const removed = localList.filter(p => !remoteUrls.includes(p.url)).map(p => ({ url: p.url, name: p.name || p.url.split('/').pop(), description: p.description || '' }));
                if (added.length > 0 || removed.length > 0) saveUpdateInfo(remoteDate, added, removed);
            })
            .catch(() => {});
    }

    function addCategoryButtons() {
        const categories = [...new Set(pluginList.map(p => tr(p.category || 'Разное')))].sort();
        categories.forEach(cat => {
            Lampa.SettingsApi.addParam({
                component: 'multi_plugin',
                param: { type: 'button' },
                field: { name: cat },
                onChange: () => showCategory(cat)
            });
        });
    }

    Lampa.SettingsApi.addComponent({
        component: 'multi_plugin',
        icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="16" height="16" rx="2" stroke="#fff" stroke-width="2"/><rect x="8" y="8" width="8" height="8" rx="1" stroke="#fff" stroke-width="2"/></svg>',
        name: Lampa.Lang.translate('mp_title')
    });

    Lampa.SettingsApi.addParam({
        component: 'multi_plugin',
        param: { type: 'button' },
        field: { name: Lampa.Lang.translate('mp_updated') + getUpdateInfo().date },
        onChange: showInfo
    });

    Lampa.SettingsApi.addParam({
        component: 'multi_plugin',
        param: { type: 'button' },
        field: { name: Lampa.Lang.translate('mp_sync_plugins') },
        onChange: confirmAndSync
    });

    Lampa.SettingsApi.addParam({
        component: 'multi_plugin',
        param: { type: 'button' },
        field: { name: Lampa.Lang.translate('mp_load_online_only') },
        onChange: confirmAndLoadOnline
    });

    Lampa.SettingsApi.addParam({
        component: 'multi_plugin',
        param: { type: 'title' },
        field: { name: Lampa.Lang.translate('mp_management') }
    });

    Lampa.SettingsApi.addParam({
        component: 'multi_plugin',
        param: { type: 'button' },
        field: { name: Lampa.Lang.translate('mp_current_plugins') },
        onChange: showEnabledPlugins
    });

    Lampa.SettingsApi.addParam({
        component: 'multi_plugin',
        param: { type: 'button' },
        field: { name: Lampa.Lang.translate('mp_export_to_lampa') },
        onChange: exportToLampa
    });

    Lampa.SettingsApi.addParam({
        component: 'multi_plugin',
        param: { type: 'button' },
        field: { name: Lampa.Lang.translate('mp_disable_all') },
        onChange: disableAllPlugins
    });

    Lampa.SettingsApi.addParam({
        component: 'multi_plugin',
        param: { type: 'button' },
        field: { name: Lampa.Lang.translate('mp_reload_lampa') },
        onChange: function () {
            const prev = Lampa.Controller.enabled().name;
            Lampa.Modal.open({
                title: Lampa.Lang.translate('mp_reload_lampa'),
                align: 'center',
                html: $('<div class="about">' + Lampa.Lang.translate('mp_reload_message') + '</div>'),
                buttons: [
                    { name: Lampa.Lang.translate('mp_cancel'), onSelect: function () { Lampa.Modal.close(); Lampa.Controller.toggle(prev); } },
                    { name: Lampa.Lang.translate('mp_ok'), onSelect: function () { Lampa.Modal.close(); window.location.reload(); } }
                ]
            });
        }
    });

    Lampa.SettingsApi.addParam({
        component: 'multi_plugin',
        param: { type: 'title' },
        field: { name: Lampa.Lang.translate('mp_category_plugins') }
    });

    Lampa.Listener.follow('app', function (e) {
        if (e.type === 'ready') {
            pluginList = getPluginList();
            checkUpdatesOnStart();
            if (pluginList.length === 0) {
                synchronize();
            } else {
                loadEnabledPlugins();
                addCategoryButtons();
            }
        }
    });

    console.log('Мультиплагин v4');
})();
