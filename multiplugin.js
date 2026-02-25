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
        mp_export_to_lampa: { ru: 'Экспорт включённых', uk: 'Експорт увімкнених', en: 'Export Enabled' },
        mp_export_select: { ru: 'Экспорт → Выбрать плагины', uk: 'Експорт → Обрати плагіни', en: 'Export → Select Plugins' },
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
        mp_cancel: { ru: 'Отмена', uk: 'Скасувати', en: 'Cancel' },
        mp_no_updates_found: {
            ru: 'Обновлений не найдено',
            uk: 'Оновлень не знайдено',
            en: 'No updates found'
        }
    });


    const syncUrl = 'https://addonslmp.github.io/sources/plugins_mp.json';


    const STORAGE_KEY = 'multi_plugins_list';
    const ENABLED_KEY = 'multi_enabled_plugins';
    const INFO_KEY = 'multi_last_update';
    const EXPORT_KEY = 'multi_export_selection';


    let pluginList = [];
    const loadedPlugins = new Set();


    // Вспомогательная функция для перевода объектов {ru: "...", uk: "...", en: "..."}
    function translateObj(obj) {
        if (!obj) return '';
        if (typeof obj === 'string') return obj;
        const lang = Lampa.Storage.get('language', 'ru');
        return obj[lang] || obj.ru || obj.en || '';
    }


    function lazyLoadPlugin(url) {
        if (loadedPlugins.has(url)) return;
        Lampa.Utils.putScriptAsync([url], function () { loadedPlugins.add(url); });
    }


    function loadEnabledPluginsLazy() {
        const enabled = new Set(Lampa.Storage.get(ENABLED_KEY, []));
        const lazy = pluginList
            .filter(function (p) { return enabled.has(p.url); })
            .filter(function (p) { return !loadedPlugins.has(p.url); })
            .map(function (p) { return p.url; });
        if (!lazy.length) return;
        Lampa.Utils.putScriptAsync(lazy, function () {
            lazy.forEach(function (url) { loadedPlugins.add(url); });
        });
    }


    function exportPlugins(urls) {
        if (!urls || !urls.length) {
            Lampa.Noty.show('Плагины не выбраны');
            return;
        }
        const installed = Lampa.Plugins.get() || [];
        let added = 0;
        urls.forEach(function (url) {
            const plugin = pluginList.find(function (p) { return p.url === url; });
            if (!plugin) return;
            const exists = installed.find(function (p) { return p.url === plugin.url; });
            if (exists) return;
            Lampa.Plugins.add({
                url: plugin.url,
                name: translateObj(plugin.name) || plugin.url.split('/').pop(),
                status: 1,
                source: 'multiplugin'
            });
            added++;
        });
        if (added > 0) {
            Lampa.Plugins.save();
            Lampa.Noty.show('Экспортировано: ' + added);
        } else {
            Lampa.Noty.show('Новых плагинов не добавлено');
        }
    }


    function getCategories(list) {
        return [...new Set(list.map(function (p) { return translateObj(p.category) || 'Разное'; }))];
    }


    function showExportCategories() {
        const categories = getCategories(pluginList);
        Lampa.Select.show({
            title: 'Выбор категории для экспорта',
            items: categories.map(function (cat) { return { title: cat, category: cat }; }),
            onSelect: function (item) { showExportCategoryPlugins(item.category); },
            onBack: function () {
                const selected = Lampa.Storage.get(EXPORT_KEY, []);
                if (selected.length) exportPlugins(selected);
                Lampa.Storage.set(EXPORT_KEY, []);
                Lampa.Controller.toggle('settings_component');
            }
        });
    }


    function showExportCategoryPlugins(category) {
        const selected = new Set(Lampa.Storage.get(EXPORT_KEY, []));
        const plugins = pluginList.filter(function (p) { return translateObj(p.category) === category; });
        const items = plugins.map(function (p) {
            return {
                title: translateObj(p.name) || p.url.split('/').pop(),
                subtitle: translateObj(p.description) || '',
                checkbox: true,
                checked: selected.has(p.url),
                url: p.url
            };
        });
        Lampa.Select.show({
            title: category,
            items: items,
            onCheck: function (item) {
                if (item.checked) selected.add(item.url);
                else selected.delete(item.url);
                Lampa.Storage.set(EXPORT_KEY, Array.from(selected));
            },
            onBack: showExportCategories
        });
    }


    function exportSinglePlugin(url) {
        Lampa.Modal.open({
            title: 'Экспорт плагина',
            align: 'center',
            html: $('<div class="about">Экспортировать этот плагин в расширения Lampa?</div>'),
            buttons: [
                { name: 'Отмена', onSelect: function () { Lampa.Modal.close(); } },
                { name: 'Экспорт', onSelect: function () { exportPlugins([url]); Lampa.Modal.close(); } }
            ]
        });
    }


    function exportToLampa() {
        const enabledUrls = Lampa.Storage.get(ENABLED_KEY, []);
        exportPlugins(enabledUrls);
    }


    function confirmExportEnabled() {
        const prev = Lampa.Controller.enabled().name;
        Lampa.Modal.open({
            title: Lampa.Lang.translate('mp_export_to_lampa'),
            align: 'center',
            html: $('<div class="about">' + Lampa.Lang.translate('mp_export_message') + '</div>'),
            buttons: [
                { name: Lampa.Lang.translate('mp_cancel'), onSelect: function () { Lampa.Modal.close(); Lampa.Controller.toggle(prev); } },
                { name: 'Экспорт', onSelect: function () { Lampa.Modal.close(); exportToLampa(); Lampa.Controller.toggle(prev); } }
            ]
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


        // Если обновлений нет — уведомление с переводом
        if (info.added.length === 0 && info.removed.length === 0) {
            Lampa.Noty.show(Lampa.Lang.translate('mp_no_updates_found'));
            return;
        }


        // Если есть — диалоговое окно
        let html = '<div class="about" style="text-align:left">';
        html += '<div><b>' + Lampa.Lang.translate('mp_last_update') + '</b> ' + info.date + '</div><br>';


        if (info.added.length) {
            html += '<b>' + Lampa.Lang.translate('mp_added') + '</b><br>';
            info.added.forEach(function (p) {
                const name = translateObj(p.name) || p.url.split('/').pop();
                html += '• <b>' + name + '</b><br>';
                if (p.description) html += '<div style="color:#bfbfbf; font-size:0.9em; margin-left:18px;">' + translateObj(p.description) + '</div>';
                html += '<br>';
            });
            html += '<br>';
        }


        if (info.removed.length) {
            html += '<b>' + Lampa.Lang.translate('mp_removed') + '</b><br>';
            info.removed.forEach(function (p) {
                const name = translateObj(p.name) || p.url.split('/').pop();
                html += '• <b>' + name + '</b><br>';
                if (p.description) html += '<div style="color:#bfbfbf; font-size:0.9em; margin-left:18px;">' + translateObj(p.description) + '</div>';
                html += '<br>';
            });
            html += '<br>';
        }


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
        const plugins = pluginList.filter(function (p) { return translateObj(p.category) === category; });
        if (plugins.length === 0) {
            Lampa.Noty.show(Lampa.Lang.translate('mp_no_plugins_category').replace('%s', category));
            return;
        }
        const enabled = new Set(Lampa.Storage.get(ENABLED_KEY, []));
        const items = plugins.map(function (p) {
            return {
                title: translateObj(p.name) || p.url.split('/').pop(),
                subtitle: translateObj(p.description) || '',
                checkbox: true,
                checked: enabled.has(p.url),
                url: p.url,
                onContext: function () { exportSinglePlugin(p.url); }
            };
        });
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
        const active = pluginList.filter(function (p) { return enabled.has(p.url); });
        if (active.length === 0) {
            Lampa.Noty.show(Lampa.Lang.translate('mp_no_plugins'));
            return;
        }
        const items = active.map(function (p) {
            return {
                title: translateObj(p.name) || p.url.split('/').pop(),
                subtitle: translateObj(p.description) || '',
                checkbox: true,
                checked: true,
                url: p.url
            };
        });
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


    function confirmAndSync() {
        const prev = Lampa.Controller.enabled().name;
        Lampa.Modal.open({
            title: Lampa.Lang.translate('mp_sync_plugins'),
            align: 'center',
            html: $('<div class="about">' + Lampa.Lang.translate('mp_confirm_sync') + '</div>'),
            buttons: [
                { name: Lampa.Lang.translate('mp_cancel'), onSelect: function () { Lampa.Modal.close(); Lampa.Controller.toggle(prev); } },
                { name: Lampa.Lang.translate('mp_ok'), onSelect: function () { Lampa.Modal.close(); synchronize(function () { Lampa.Controller.toggle(prev); }); } }
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
                { name: Lampa.Lang.translate('mp_ok'), onSelect: function () { Lampa.Modal.close(); loadOnlyOnline(function () { Lampa.Controller.toggle(prev); }); } }
            ]
        });
    }


    function loadOnlyOnline(callback) {
        Lampa.Loading.start();
        fetch(syncUrl, { cache: 'no-cache' })
            .then(function (response) { return response.json(); })
            .then(function (data) {
                try {
                    if (!Array.isArray(data.plugins)) throw new Error('Invalid data');
                    const newList = data.plugins.map(function (item) {
                        return {
                            url: item.url,
                            name: item.name,
                            description: item.description,
                            category: item.category
                        };
                    });
                    savePluginList(newList);
                    const enabledSet = new Set(Lampa.Storage.get(ENABLED_KEY, []));
                    newList.filter(function (p) { return translateObj(p.category) === 'Онлайн' || translateObj(p.category) === 'Online'; }).forEach(function (p) {
                        enabledSet.add(p.url);
                        lazyLoadPlugin(p.url);
                    });
                    Lampa.Storage.set(ENABLED_KEY, Array.from(enabledSet));
                    Lampa.Noty.show(Lampa.Lang.translate('mp_online_enabled'));
                } catch (e) {
                    console.error('Load online error:', e);
                }
            })
            .catch(function () { Lampa.Noty.show('Ошибка загрузки'); })
            .finally(function () { Lampa.Loading.stop(); if (callback) callback(); });
    }


    function synchronize(callback) {
        Lampa.Loading.start();
        fetch(syncUrl, { cache: 'no-cache' })
            .then(function (response) { return response.json(); })
            .then(function (data) {
                try {
                    if (!Array.isArray(data.plugins)) throw new Error('Invalid data');


                    const remoteDate = data.updateDate || '—';
                    const newList = data.plugins.map(function (item) {
                        return {
                            url: item.url,
                            name: item.name,
                            description: item.description,
                            category: item.category
                        };
                    });


                    const prevList = getPluginList();
                    const prevUrls = prevList.map(function (p) { return p.url; });
                    const newUrls = newList.map(function (p) { return p.url; });


                    const added = newList.filter(function (p) { return !prevUrls.includes(p.url); });
                    const removed = prevList.filter(function (p) { return !newUrls.includes(p.url); });


                    savePluginList(newList);


                    const oldEnabled = new Set(Lampa.Storage.get(ENABLED_KEY, []));
                    const validEnabled = Array.from(oldEnabled).filter(function (u) { return newUrls.includes(u); });
                    Lampa.Storage.set(ENABLED_KEY, validEnabled);


                    Lampa.Noty.show(Lampa.Lang.translate('mp_sync_complete'));


                    saveUpdateInfo(remoteDate, added, removed);
                } catch (e) {
                    console.error('Sync error:', e);
                }
            })
            .catch(function () { Lampa.Noty.show('Ошибка синхронизации'); })
            .finally(function () { Lampa.Loading.stop(); if (callback) callback(); });
    }


    function checkUpdatesOnStart() {
        fetch(syncUrl, { cache: 'no-cache' })
            .then(function (r) { return r.json(); })
            .then(function (data) {
                try {
                    if (!Array.isArray(data.plugins)) return;
                    const remoteDate = data.updateDate || '—';
                    const remotePlugins = data.plugins;
                    const remoteList = remotePlugins.map(function (item) {
                        return { url: item.url, name: item.name, description: item.description };
                    });
                    const localList = getPluginList();
                    const localUrls = localList.map(function (p) { return p.url; });
                    const remoteUrls = remoteList.map(function (p) { return p.url; });
                    const added = remoteList.filter(function (p) { return !localUrls.includes(p.url); }).map(function (p) {
                        return { url: p.url, name: p.name, description: p.description };
                    });
                    const removed = localList.filter(function (p) { return !remoteUrls.includes(p.url); }).map(function (p) {
                        return { url: p.url, name: p.name || p.url.split('/').pop(), description: p.description || '' };
                    });
                    if (added.length > 0 || removed.length > 0) saveUpdateInfo(remoteDate, added, removed);
                } catch (e) {
                    console.error('Check on start error:', e);
                }
            })
            .catch(function () {});
    }


    function addCategoryButtons() {
        if (pluginList.length === 0) return;
        const categories = getCategories(pluginList);
        categories.forEach(function (cat) {
            Lampa.SettingsApi.addParam({
                component: 'multi_plugin',
                param: { type: 'button' },
                field: { name: cat },
                onChange: function () { showCategory(cat); }
            });
        });
    }


    function registerSettings() {
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
            param: { type: 'button' },
            field: { name: Lampa.Lang.translate('mp_export_select') },
            onChange: showExportCategories
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
            onChange: confirmExportEnabled
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
    }


    pluginList = getPluginList();
    checkUpdatesOnStart();


    registerSettings();
    addCategoryButtons();


    Lampa.Listener.follow('app', function (e) {
        if (e.type === 'ready') {
            loadEnabledPluginsLazy();
        }
    });


    console.log('Мультиплагин v4');
})();

