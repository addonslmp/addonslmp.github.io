(function () {
    'use strict';

    const DEFAULT_URL = 'https://addonslmp.github.io/sources/plugins_example.json';
    const STORAGE_KEY = 'external_installer_plugins';
    const SOURCE_KEY = 'external_installer';
    const URL_STORAGE_KEY = 'external_installer_source_url';
    const INSTALLED_COLOR = '#02e602';

    Lampa.Lang.add({
        pi_title: {
            ru: 'Сторонние плагины',
            uk: 'Сторонні плагіни',
            en: 'Third-party Plugins'
        },
        pi_source_plugins: {
            ru: 'Ссылка на список плагинов',
            uk: 'Посилання на список плагінів',
            en: 'Plugins List URL'
        },
        pi_plugin_installed: {
            ru: 'Плагин установлен',
            uk: 'Плагін встановлено',
            en: 'Plugin Installed'
        },
        pi_plugin_removed: {
            ru: 'Плагин удалён',
            uk: 'Плагін видалено',
            en: 'Plugin Removed'
        },
        pi_no_plugins: {
            ru: 'Список плагинов пуст',
            uk: 'Список плагінів порожній',
            en: 'Plugins list is empty'
        },
        pi_invalid_url: {
            ru: 'Некорректная ссылка',
            uk: 'Некоректне посилання',
            en: 'Invalid URL'
        },
        pi_source_set_reload: {
            ru: 'Источник изменён. Перезагрузка через 3 секунды...',
            uk: 'Джерело змінено. Перезавантаження через 3 секунди...',
            en: 'Source changed. Reloading in 3 seconds...'
        },
        pi_categories_title: {
            ru: 'Категории',
            uk: 'Категорії',
            en: 'Categories'
        }
    });

    let plugins = [];
    let currentSourceUrl = Lampa.Storage.get(URL_STORAGE_KEY, DEFAULT_URL);

    function getSourceUrl() {
        return currentSourceUrl;
    }

    function loadRemoteList() {
        return fetch(getSourceUrl(), { cache: 'no-cache' })
            .then(function (r) { return r.json(); })
            .then(function (data) {
                const list = Array.isArray(data.plugins) ? data.plugins : [];
                plugins = list;
                Lampa.Storage.set(STORAGE_KEY, list, true);
                return list;
            })
            .catch(function () {
                plugins = Lampa.Storage.get(STORAGE_KEY, []);
                return plugins;
            });
    }

    function isInstalled(url) {
        return Lampa.Plugins.get().some(function (p) { return p.url === url && p.status === 1; });
    }

    function installPlugin(plugin) {
        if (isInstalled(plugin.url)) {
            Lampa.Noty.show(Lampa.Lang.translate('pi_plugin_installed'));
            return;
        }
        Lampa.Plugins.add({
            url: plugin.url,
            name: tr(plugin.name) || plugin.url.split('/').pop(),
            status: 1,
            source: SOURCE_KEY
        });
        Lampa.Plugins.save();
        Lampa.Noty.show(Lampa.Lang.translate('pi_plugin_installed'));
    }

    function removePlugin(url) {
        Lampa.Plugins.remove(url);
        Lampa.Plugins.save();
        Lampa.Noty.show(Lampa.Lang.translate('pi_plugin_removed'));
    }

    function buildMenu() {
        if (plugins.length === 0) {
            Lampa.Noty.show(Lampa.Lang.translate('pi_no_plugins'));
            return;
        }

        const categories = {};
        plugins.forEach(function (plugin) {
            const cat = tr(plugin.category || 'Разное');
            if (!categories[cat]) categories[cat] = [];
            categories[cat].push(plugin);
        });

        Object.keys(categories).sort().forEach(function (cat) {
            Lampa.SettingsApi.addParam({
                component: 'external_installer',
                param: { type: 'title' },
                field: { name: cat }
            });

            categories[cat].forEach(function (plugin) {
                const installed = isInstalled(plugin.url);
                Lampa.SettingsApi.addParam({
                    component: 'external_installer',
                    param: { type: 'button' },
                    field: {
                        name: tr(plugin.name) || plugin.url.split('/').pop(),
                        description: tr(plugin.description) || '',
                        color: installed ? INSTALLED_COLOR : null
                    },
                    onChange: function () {
                        if (installed) {
                            removePlugin(plugin.url);
                        } else {
                            installPlugin(plugin);
                        }
                        // Перерисовка после изменения
                        Lampa.SettingsApi.reloadComponent('external_installer');
                    }
                });
            });
        });
    }

    Lampa.SettingsApi.addComponent({
        component: 'external_installer',
        icon: '<svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h10v2H7v-2z"/></svg>',
        name: Lampa.Lang.translate('pi_title')
    });

    Lampa.SettingsApi.addParam({
        component: 'external_installer',
        param: { type: 'input' },
        field: {
            name: Lampa.Lang.translate('pi_source_plugins'),
            value: currentSourceUrl,
            description: currentSourceUrl === DEFAULT_URL ? 'По умолчанию' : ''
        },
        onChange: function (value) {
            if (value && value.startsWith('http')) {
                Lampa.Storage.set(URL_STORAGE_KEY, value);
                currentSourceUrl = value;
                Lampa.Noty.show(Lampa.Lang.translate('pi_source_set_reload'));
                setTimeout(function () {
                    window.location.reload();
                }, 3000);
            } else {
                Lampa.Noty.show(Lampa.Lang.translate('pi_invalid_url'));
            }
        }
    });

    Lampa.SettingsApi.addParam({
        component: 'external_installer',
        param: { type: 'title' },
        field: { name: Lampa.Lang.translate('pi_categories_title') }
    });

    Lampa.Listener.follow('app', function (e) {
        if (e.type === 'ready') {
            loadRemoteList().then(buildMenu);
        }
    });

    console.log('External Plugin Installer loaded');
})();
