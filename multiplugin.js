(function () {
    'use strict';


    if (typeof fetch === 'undefined') {
        window.fetch = function (url) {
            return new Promise(function (resolve, reject) {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', url, true);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        if (xhr.status >= 200 && xhr.status < 300) {
                            var response = {
                                ok: true,
                                status: xhr.status,
                                statusText: xhr.statusText,
                                text: function () { return Promise.resolve(xhr.responseText); },
                                json: function () {
                                    try { return Promise.resolve(JSON.parse(xhr.responseText)); }
                                    catch (e) { return Promise.reject(e); }
                                }
                            };
                            resolve(response);
                        } else {
                            reject(new Error('HTTP error ' + xhr.status));
                        }
                    }
                };
                xhr.onerror = function () { reject(new Error('Network error')); };
                xhr.send();
            });
        };
    }


    Lampa.Lang.add({
        mp_title: { ru: 'Мультиплагин', uk: 'Мультиплагін', en: 'Multiplugin' },
        mp_updated: { ru: 'Обновлено: ', uk: 'Оновлено: ', en: 'Updated: ' },
        mp_sync_plugins: { ru: 'Синхронизировать плагины', uk: 'Синхронізувати плагіни', en: 'Sync Plugins' },
        mp_load_online_only: { ru: 'Установить только онлайн', uk: 'Встановити тільки онлайн', en: 'Install only online' },
        mp_management: { ru: 'Управление', uk: 'Керування', en: 'Management' },
        mp_installed_plugins: { ru: 'Установленные плагины', uk: 'Встановлені плагіни', en: 'Installed Plugins' },
        mp_no_installed_plugins: { ru: 'Нет установленных плагинов', uk: 'Немає встановлених плагінів', en: 'No installed plugins' },
        mp_plugin_removed: { ru: 'Плагин удалён', uk: 'Плагін видалено', en: 'Plugin removed' },
        mp_disable_all: { ru: 'Удалить все плагины', uk: 'Видалити всі плагіни', en: 'Remove All Plugins' },
        mp_reload_lampa: { ru: 'Перезагрузить Lampa', uk: 'Перезавантажити Lampa', en: 'Reload Lampa' },
        mp_update_info: { ru: 'Информация об обновлении', uk: 'Інформація про оновлення', en: 'Update Information' },
        mp_last_update: { ru: 'Последнее обновление: ', uk: 'Останнє оновлення: ', en: 'Last Update: ' },
        mp_added: { ru: 'Добавлено:', uk: 'Додано:', en: 'Added:' },
        mp_removed: { ru: 'Удалено:', uk: 'Видалено:', en: 'Removed:' },
        mp_no_changes: { ru: 'Новых изменений нет', uk: 'Нових змін немає', en: 'No new changes' },
        mp_sync_complete: { ru: 'Синхронизация завершена', uk: 'Синхронізація завершена', en: 'Sync completed' },
        mp_confirm_sync: { ru: 'Синхронизировать актуальные плагины с облака?', uk: 'Синхронізувати актуальні плагіни з хмари?', en: 'Sync latest plugins from cloud?' },
        mp_confirm_online: { ru: 'Установить только плагины категории "Онлайн"?', uk: 'Встановити тільки плагіни категорії "Онлайн"?', en: 'Install only "Online" category plugins?' },
        mp_confirm_disable_all: { ru: 'Вы уверены? Все установленные плагины будут удалены', uk: 'Ви впевнені? Усі встановлені плагіни будуть видалені', en: 'Are you sure? All installed plugins will be removed' },
        mp_reload_message: { ru: 'Перезапустить приложение?', uk: 'Перезавантажити додаток?', en: 'Restart application?' },
        mp_ok: { ru: 'OK', uk: 'OK', en: 'OK' },
        mp_cancel: { ru: 'Отмена', uk: 'Скасувати', en: 'Cancel' },
        mp_no_updates_found: { ru: 'Обновлений не найдено', uk: 'Оновлень не знайдено', en: 'No updates found' },
        mp_install_plugins: { ru: 'Установка плагинов', uk: 'Встановлення плагінів', en: 'Install Plugins' },
        mp_all_plugins_removed: { ru: 'Все плагины удалены. Перезагрузите Lampa', uk: 'Усі плагіни видалено. Перезавантажте Lampa', en: 'All plugins removed. Reload Lampa' },
        pi_install: { ru: 'Установить', uk: 'Встановити', en: 'Install' },
        pi_remove: { ru: 'Удалить', uk: 'Видалити', en: 'Remove' },
        pi_cancel: { ru: 'Отмена', uk: 'Скасувати', en: 'Cancel' },
        pi_plugin_installed: { ru: 'Плагин установлен', uk: 'Плагін встановлено', en: 'Plugin installed' },
        pi_plugin_removed: { ru: 'Плагин удалён', uk: 'Плагін видалено', en: 'Plugin removed' }
    });


    var syncUrl = 'https://addonslmp.github.io/sources/plugins_mp.json';
    var STORAGE_KEY = 'multi_plugins_list';
    var ENABLED_KEY = 'multi_enabled_plugins';
    var INFO_KEY = 'multi_last_update';
    var INSTALLED_KEY = 'multi_installed_plugins';
    var SOURCE_KEY = 'multiplugin';
    var INSTALLED_COLOR = '#8bc34a';


    var pluginList = [];


    function translateObj(obj) {
        if (!obj) return '';
        if (typeof obj === 'string') return obj;
        var lang = Lampa.Storage.get('language', 'ru');
        return obj[lang] || obj.ru || obj.en || '';
    }


    function getCategories(list) {
        var cats = [];
        var i;
        for (i = 0; i < list.length; i++) {
            var cat = translateObj(list[i].category) || 'Разное';
            var found = false;
            var j;
            for (j = 0; j < cats.length; j++) {
                if (cats[j] === cat) {
                    found = true;
                    break;
                }
            }
            if (!found) cats.push(cat);
        }
        return cats;
    }


    function savePluginList(list) {
        Lampa.Storage.set(STORAGE_KEY, list);
        pluginList = list;
    }


    function getPluginList() {
        return Lampa.Storage.get(STORAGE_KEY, []);
    }


    function saveUpdateInfo(date, added, removed) {
        var info = { date: date || '—', added: added || [], removed: removed || [] };
        Lampa.Storage.set(INFO_KEY, info, true);
    }


    function getUpdateInfo() {
        return Lampa.Storage.get(INFO_KEY, { date: '—', added: [], removed: [] });
    }


    function showInfo() {
        var info = getUpdateInfo();
        if (info.added.length === 0 && info.removed.length === 0) {
            Lampa.Noty.show(Lampa.Lang.translate('mp_no_updates_found'));
            return;
        }
        var html = '<div class="about" style="text-align:left">';
        html += '<div><b>' + Lampa.Lang.translate('mp_last_update') + '</b> ' + info.date + '</div><br>';
        if (info.added.length) {
            html += '<b>' + Lampa.Lang.translate('mp_added') + '</b><br>';
            var i;
            for (i = 0; i < info.added.length; i++) {
                var p = info.added[i];
                var name = translateObj(p.name) || p.url.split('/').pop();
                html += '• <b>' + name + '</b><br>';
                if (p.description) html += '<div style="color:#bfbfbf; font-size:0.9em; margin-left:18px;">' + translateObj(p.description) + '</div>';
                html += '<br>';
            }
            html += '<br>';
        }
        if (info.removed.length) {
            html += '<b>' + Lampa.Lang.translate('mp_removed') + '</b><br>';
            var i;
            for (i = 0; i < info.removed.length; i++) {
                var p = info.removed[i];
                var name = translateObj(p.name) || p.url.split('/').pop();
                html += '• <b>' + name + '</b><br>';
                if (p.description) html += '<div style="color:#bfbfbf; font-size:0.9em; margin-left:18px;">' + translateObj(p.description) + '</div>';
                html += '<br>';
            }
            html += '<br>';
        }
        html += '</div>';
        var prev = Lampa.Controller.enabled().name;
        Lampa.Modal.open({
            title: Lampa.Lang.translate('mp_update_info'),
            align: 'center',
            html: $(html),
            buttons: [{ name: Lampa.Lang.translate('mp_ok'), onSelect: function () { Lampa.Modal.close(); Lampa.Controller.toggle(prev); } }]
        });
    }


    function disableAllPlugins() {
        var prev = Lampa.Controller.enabled().name;


        Lampa.Modal.open({
            title: Lampa.Lang.translate('mp_disable_all'),
            align: 'center',
            html: $('<div class="about">' + Lampa.Lang.translate('mp_confirm_disable_all') + '</div>'),
            buttons: [
                {
                    name: Lampa.Lang.translate('mp_cancel'),
                    onSelect: function () {
                        Lampa.Modal.close();
                        Lampa.Controller.toggle(prev);
                    }
                },
                {
                    name: Lampa.Lang.translate('pi_remove'),
                    onSelect: function () {
                        Lampa.Modal.close();


                        var urls = Lampa.Storage.get(INSTALLED_KEY, []);
                        var allPlugins = Lampa.Plugins.get() || [];


                        if (urls.length === 0) {
                            Lampa.Controller.toggle(prev);
                            return;
                        }


                        for (var i = 0; i < urls.length; i++) {
                            for (var j = 0; j < allPlugins.length; j++) {
                                if (allPlugins[j].url === urls[i]) {
                                    Lampa.Plugins.remove(allPlugins[j]);
                                    break;
                                }
                            }
                        }


                        Lampa.Plugins.save();
                        Lampa.Storage.set(INSTALLED_KEY, []);


                        Lampa.Noty.show(
                            Lampa.Lang.translate('mp_all_plugins_removed'),
                            INSTALLED_COLOR,
                            6000
                        );


                        Lampa.Controller.toggle(prev);
                    }
                }
            ]
        });
    }


    function confirmAndSync() {
        var prev = Lampa.Controller.enabled().name;
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
        var prev = Lampa.Controller.enabled().name;
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
                    var newList = [];
                    var i;
                    for (i = 0; i < data.plugins.length; i++) {
                        var item = data.plugins[i];
                        newList.push({
                            url: item.url,
                            name: item.name,
                            description: item.description,
                            category: item.category
                        });
                    }
                    savePluginList(newList);


                    var plugins = Lampa.Plugins.get() || [];


                    for (i = 0; i < newList.length; i++) {
                        var p = newList[i];
                        var cat = translateObj(p.category).toLowerCase();


                        if (cat === 'онлайн' || cat === 'online') {
                            var existsInstalled = isInstalled(p.url);


                            if (!existsInstalled) {
                                Lampa.Plugins.add({
                                    url: p.url,
                                    name: translateObj(p.name) || p.url.split('/').pop(),
                                    status: 1,
                                    source: SOURCE_KEY
                                });


                                addInstalledFromMulti(p.url);
                            }
                        }
                    }


                    Lampa.Plugins.save();
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
                    var remoteDate = data.updateDate || '—';
                    var newList = [];
                    var i;
                    for (i = 0; i < data.plugins.length; i++) {
                        var item = data.plugins[i];
                        newList.push({
                            url: item.url,
                            name: item.name,
                            description: item.description,
                            category: item.category
                        });
                    }
                    var prevList = getPluginList();
                    var prevUrls = [];
                    for (i = 0; i < prevList.length; i++) {
                        prevUrls.push(prevList[i].url);
                    }
                    var newUrls = [];
                    for (i = 0; i < newList.length; i++) {
                        newUrls.push(newList[i].url);
                    }
                    var added = [];
                    for (i = 0; i < newList.length; i++) {
                        var found = false;
                        var j;
                        for (j = 0; j < prevUrls.length; j++) {
                            if (prevUrls[j] === newList[i].url) {
                                found = true;
                                break;
                            }
                        }
                        if (!found) added.push(newList[i]);
                    }
                    var removed = [];
                    for (i = 0; i < prevList.length; i++) {
                        var found = false;
                        var j;
                        for (j = 0; j < newUrls.length; j++) {
                            if (newUrls[j] === prevList[i].url) {
                                found = true;
                                break;
                            }
                        }
                        if (!found) removed.push(prevList[i]);
                    }
                    savePluginList(newList);
                    var oldEnabled = Lampa.Storage.get(ENABLED_KEY, []);
                    var validEnabled = [];
                    for (i = 0; i < oldEnabled.length; i++) {
                        var found = false;
                        var j;
                        for (j = 0; j < newUrls.length; j++) {
                            if (newUrls[j] === oldEnabled[i]) {
                                found = true;
                                break;
                            }
                        }
                        if (found) validEnabled.push(oldEnabled[i]);
                    }
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
                    var remoteDate = data.updateDate || '—';
                    var remotePlugins = data.plugins;
                    var remoteList = [];
                    var i;
                    for (i = 0; i < remotePlugins.length; i++) {
                        remoteList.push({ url: remotePlugins[i].url, name: remotePlugins[i].name, description: remotePlugins[i].description });
                    }
                    var localList = getPluginList();
                    var localUrls = [];
                    for (i = 0; i < localList.length; i++) {
                        localUrls.push(localList[i].url);
                    }
                    var remoteUrls = [];
                    for (i = 0; i < remoteList.length; i++) {
                        remoteUrls.push(remoteList[i].url);
                    }
                    var added = [];
                    for (i = 0; i < remoteList.length; i++) {
                        var found = false;
                        var j;
                        for (j = 0; j < localUrls.length; j++) {
                            if (localUrls[j] === remoteList[i].url) {
                                found = true;
                                break;
                            }
                        }
                        if (!found) added.push(remoteList[i]);
                    }
                    var removed = [];
                    for (i = 0; i < localList.length; i++) {
                        var found = false;
                        var j;
                        for (j = 0; j < remoteUrls.length; j++) {
                            if (remoteUrls[j] === localList[i].url) {
                                found = true;
                                break;
                            }
                        }
                        if (!found) removed.push(localList[i]);
                    }
                    if (added.length > 0 || removed.length > 0) saveUpdateInfo(remoteDate, added, removed);
                } catch (e) {
                    console.error('Check on start error:', e);
                }
            })
            .catch(function () {});
    }


    function migrateEnabledPlugins() {
        if (Lampa.Storage.get('multi_enabled_migrated')) return;


        var enabled = Lampa.Storage.get(ENABLED_KEY, []);
        if (!enabled || !enabled.length) {
            Lampa.Storage.set('multi_enabled_migrated', true);
            return;
        }


        var installed = Lampa.Storage.get(INSTALLED_KEY, []);
        var plugins = Lampa.Plugins.get() || [];


        enabled.forEach(function(url) {
            var existsInstalled = installed.indexOf(url) !== -1;
            var existsLampa = plugins.some(function(p) { return p.url === url; });


            if (!existsInstalled && !existsLampa) {
                Lampa.Plugins.add({ url: url, status: 1 });
                installed.push(url);
            }
        });


        Lampa.Plugins.save();
        Lampa.Storage.set(INSTALLED_KEY, installed);
        Lampa.Storage.set(ENABLED_KEY, []);
        Lampa.Storage.set('multi_enabled_migrated', true);
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
            param: { type: 'title' },
            field: { name: Lampa.Lang.translate('mp_management') }
        });


        Lampa.SettingsApi.addParam({
            component: 'multi_plugin',
            param: { type: 'button' },
            field: { name: Lampa.Lang.translate('mp_install_plugins') },
            onChange: showInstallPlugins
        });


        Lampa.SettingsApi.addParam({
            component: 'multi_plugin',
            param: { type: 'button' },
            field: { name: Lampa.Lang.translate('mp_installed_plugins') },
            onChange: showInstalledPlugins
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
                var prev = Lampa.Controller.enabled().name;
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
    }


    function showInstallPlugins() {
        var categories = getCategories(pluginList);


        var items = [];
        var i;
        for (i = 0; i < categories.length; i++) {
            items.push({
                title: categories[i],
                category: categories[i]
            });
        }


        Lampa.Select.show({
            title: Lampa.Lang.translate('mp_install_plugins'),
            items: items,
            onSelect: function(item){
                showInstallCategory(item.category);
            },
            onBack: function(){
                Lampa.Controller.toggle('settings_component');
            }
        });
    }


    function showInstallCategory(category) {
        var plugins = [];
        var i;
        for (i = 0; i < pluginList.length; i++) {
            if (translateObj(pluginList[i].category) === category) {
                plugins.push(pluginList[i]);
            }
        }


        var items = [];
        for (i = 0; i < plugins.length; i++) {
            var p = plugins[i];
            var installed = isInstalled(p.url);
            var title = installed
                ? '<span style="color:' + INSTALLED_COLOR + '">' + (translateObj(p.name) || p.url.split('/').pop()) + '</span>'
                : translateObj(p.name) || p.url.split('/').pop();


            items.push({
                title: title,
                subtitle: translateObj(p.description) || '',
                url: p.url,
                plugin: p,
                installed: installed
            });
        }


        Lampa.Select.show({
            title: category,
            items: items,
            onSelect: function(item){
                showPluginActions(item.plugin, item.installed, category);
            },
            onBack: function(){
                showInstallPlugins();
            }
        });
    }


    function showPluginActions(plugin, isInstalled, category) {
        var actions = [];


        if (isInstalled) {
            actions.push({
                title: Lampa.Lang.translate('pi_remove'),
                onSelect: function () {
                    removePlugin(plugin.url);
                    showInstallCategory(category);
                }
            });
        } else {
            actions.push({
                title: Lampa.Lang.translate('pi_install'),
                onSelect: function () {
                    installPlugin(plugin);
                    showInstallCategory(category);
                }
            });
        }


        actions.push({
            title: Lampa.Lang.translate('pi_cancel'),
            onSelect: function () {
                showInstallCategory(category);
            }
        });


        Lampa.Select.show({
            title: translateObj(plugin.name) || plugin.url.split('/').pop(),
            items: actions,
            onBack: function () {
                showInstallCategory(category);
            }
        });
    }


    function installPlugin(p) {
        var url = p.url;
        if (isInstalled(url)) return;


        Lampa.Plugins.add({
            url: url,
            name: translateObj(p.name) || url.split('/').pop(),
            status: 1,
            source: SOURCE_KEY
        });


        Lampa.Plugins.save();


        addInstalledFromMulti(url);


        Lampa.Noty.show(Lampa.Lang.translate('pi_plugin_installed'));
    }


    function removePlugin(url) {
        var installed = getInstalled();
        var plugin = null;
        var i;
        for (i = 0; i < installed.length; i++) {
            if (installed[i].url === url) {
                plugin = installed[i];
                break;
            }
        }
        if (plugin) {
            Lampa.Plugins.remove(plugin);
            Lampa.Plugins.save();


            removeInstalledFromMulti(url);


            Lampa.Noty.show(Lampa.Lang.translate('pi_plugin_removed'));
        }
    }


    function getInstalled() {
        return Lampa.Plugins.get() || [];
    }


    function isInstalled(url) {
        var installed = getInstalled();
        var i;
        for (i = 0; i < installed.length; i++) {
            if (installed[i].url === url) return true;
        }
        return false;
    }


    function getInstalledFromMulti() {
        return Lampa.Storage.get(INSTALLED_KEY, []);
    }


    function addInstalledFromMulti(url) {
        var list = Lampa.Storage.get(INSTALLED_KEY, []);
        var i;


        for (i = 0; i < list.length; i++) {
            if (list[i] === url) return;
        }


        list.push(url);
        Lampa.Storage.set(INSTALLED_KEY, list);
    }


    function removeInstalledFromMulti(url) {
        var list = Lampa.Storage.get(INSTALLED_KEY, []);
        var newList = [];
        var i;


        for (i = 0; i < list.length; i++) {
            if (list[i] !== url) newList.push(list[i]);
        }


        Lampa.Storage.set(INSTALLED_KEY, newList);
    }


    function showInstalledPlugins() {
        var urls = getInstalledFromMulti();


        if (!urls || urls.length === 0) {
            Lampa.Noty.show(Lampa.Lang.translate('mp_no_installed_plugins'));


            Lampa.Controller.toggle('settings_component');


            return;
        }


        var items = [];
        var i;


        for (i = 0; i < urls.length; i++) {
            var url = urls[i];
            var name = url.split('/').pop().replace('.js','');


            var j;
            for (j = 0; j < pluginList.length; j++) {
                if (pluginList[j].url === url) {
                    name = translateObj(pluginList[j].name) || name;
                    break;
                }
            }


            items.push({
                title: '<span style="color:' + INSTALLED_COLOR + '">' + name + '</span>',
                subtitle: url,
                url: url,
                name: name
            });
        }


        Lampa.Select.show({
            title: Lampa.Lang.translate('mp_installed_plugins'),
            items: items,
            onSelect: function(item){
                showInstalledActions(item);
            },
            onBack: function(){
                Lampa.Controller.toggle('settings_component');
            }
        });
    }


    function showInstalledActions(item) {
        Lampa.Select.show({
            title: item.name,
            items: [
                {
                    title: Lampa.Lang.translate('pi_remove'),
                    onSelect: function () {
                        var list = getInstalled();
                        var i;
                        for (i = 0; i < list.length; i++) {
                            if (list[i].url === item.url) {
                                Lampa.Plugins.remove(list[i]);
                                Lampa.Plugins.save();
                                break;
                            }
                        }
                        removeInstalledFromMulti(item.url);
                        Lampa.Noty.show(Lampa.Lang.translate('mp_plugin_removed'));
                        showInstalledPlugins();
                    }
                },
                {
                    title: Lampa.Lang.translate('pi_cancel'),
                    onSelect: function () {
                        showInstalledPlugins();
                    }
                }
            ],
            onBack: function () {
                showInstalledPlugins();
            }
        });
    }


    pluginList = getPluginList();
    checkUpdatesOnStart();
    migrateEnabledPlugins();


    registerSettings();


    console.log('Мультиплагин v5 — стабильная версия без showCategory()');
})();
