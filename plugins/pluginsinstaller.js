(function () {
    'use strict'


    const DEFAULT_URL = 'https://addonslmp.github.io/sources/plugins_example.js'
    const STORAGE_KEY = 'external_installer_plugins'
    const SOURCE_KEY = 'external_installer'
    const URL_STORAGE_KEY = 'external_installer_source_url'
    const INSTALLED_COLOR = '#02e602'


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
            ru: 'В категории "%s" нет плагинов',
            uk: 'У категорії "%s" немає плагінів',
            en: 'No plugins in category "%s"'
        },
        pi_install: {
            ru: 'Установить',
            uk: 'Встановити',
            en: 'Install'
        },
        pi_remove: {
            ru: 'Удалить',
            uk: 'Видалити',
            en: 'Remove'
        },
        pi_invalid_url: {
            ru: 'Неверный URL',
            uk: 'Неправильний URL',
            en: 'Invalid URL'
        },
        pi_source_set_reload: {
            ru: 'Ссылка установлена. Перезагрузка…',
            uk: 'Посилання встановлено. Перезавантаження…',
            en: 'URL set. Reloading…'
        },
        pi_categories_title: {
            ru: 'Категории',
            uk: 'Категорії',
            en: 'Categories'
        }
    });


    function tr(value) {
        if (!value) return '';
        if (typeof value === 'string') return value;
        const lang = Lampa.Storage.get('language', 'ru');
        return value[lang] || value.ru || '';
    }


    let plugins = []


    function getSourceUrl() {
        return Lampa.Storage.get(URL_STORAGE_KEY, DEFAULT_URL)
    }


    function loadRemoteList() {
        return fetch(getSourceUrl(), { cache: 'no-cache' })
            .then(r => r.text())
            .then(text => {
                const match = text.match(/pluginsList\s*=\s*(\[[\s\S]*?\])/)
                if (!match) return []
                const list = eval(match[1])
                plugins = list
                Lampa.Storage.set(STORAGE_KEY, list, true)
                return list
            })
            .catch(() => {
                plugins = Lampa.Storage.get(STORAGE_KEY, [])
                return plugins
            })
    }


    function getInstalled() {
        return Lampa.Plugins.get() || []
    }


    function isInstalled(url) {
        return getInstalled().some(p => p.url === url)
    }


    function installPlugin(p) {
        if (isInstalled(p.url)) return
        Lampa.Plugins.add({
            url: p.url,
            name: tr(p.name) || p.url.split('/').pop(),
            status: 1,
            source: SOURCE_KEY
        })
        Lampa.Plugins.save()
        Lampa.Noty.show(Lampa.Lang.translate('pi_plugin_installed'))
    }


    function removePlugin(p) {
        const installed = getInstalled()
        const target = installed.find(x => x.url === p.url && x.source === SOURCE_KEY)
        if (!target) return
        Lampa.Plugins.remove(target)
        Lampa.Plugins.save()
        Lampa.Noty.show(Lampa.Lang.translate('pi_plugin_removed'))
    }


    function showPluginMenu(category, plugin) {
        const installed = isInstalled(plugin.url)
        Lampa.Select.show({
            title: tr(plugin.name),
            items: [
                {
                    title: installed ? Lampa.Lang.translate('pi_remove') : Lampa.Lang.translate('pi_install'),
                    action: installed ? 'remove' : 'install'
                }
            ],
            onSelect: function (item) {
                if (item.action === 'install') {
                    installPlugin(plugin)
                } else {
                    removePlugin(plugin)
                }
                Lampa.Select.close()
                setTimeout(() => showCategory(category), 0)
            },
            onBack: function () {
                setTimeout(() => showCategory(category), 0)
            }
        })
    }


    function showCategory(category) {
        const categoryPlugins = plugins.filter(p => tr(p.category) === category)
        if (!categoryPlugins.length) {
            Lampa.Noty.show(Lampa.Lang.translate('pi_no_plugins').replace('%s', category))
            return
        }
        const items = categoryPlugins.map(p => ({
            title: tr(p.name),
            subtitle: tr(p.description) || '',
            plugin: p
        }))
        Lampa.Select.show({
            title: tr(category),
            items: items,
            onSelect: function (item) {
                showPluginMenu(category, item.plugin)
            },
            onBack: function () {
                Lampa.Controller.toggle('settings_component')
            }
        })
    }


    function buildMenu() {
        const categories = [...new Set(plugins.map(p => tr(p.category)))]
        categories.forEach(cat => {
            Lampa.SettingsApi.addParam({
                component: 'external_installer',
                param: { type: 'button' },
                field: { name: cat },
                onChange: () => showCategory(cat)
            })
        })
    }


    Lampa.SettingsApi.addComponent({
        component: 'external_installer',
        icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="6" width="16" height="12" rx="4" stroke="#fff" stroke-width="2"/><circle cx="9.5" cy="12" r="1.4" fill="#fff"/><circle cx="14.5" cy="12" r="1.4" fill="#fff"/><path d="M8 2v4M16 2v4" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>',
        name: Lampa.Lang.translate('pi_title')
    })


    Lampa.SettingsApi.addParam({
        component: 'external_installer',
        param: { type: 'button' },
        field: { name: Lampa.Lang.translate('pi_source_plugins') },
        onChange: function () {
            const currentUrl = Lampa.Storage.get(URL_STORAGE_KEY, DEFAULT_URL)
            Lampa.Input.edit({
                title: Lampa.Lang.translate('pi_source_plugins'),
                free: true,
                nosave: true,
                nomic: true,
                value: currentUrl
            }, (value) => {
                if (value && value.startsWith('http')) {
                    Lampa.Storage.set(URL_STORAGE_KEY, value)
                    Lampa.Noty.show(Lampa.Lang.translate('pi_source_set_reload'))
                    setTimeout(() => {
                        window.location.reload()
                    }, 3000)
                } else {
                    Lampa.Noty.show(Lampa.Lang.translate('pi_invalid_url'))
                }
            })
        }
    })


    Lampa.SettingsApi.addParam({
        component: 'external_installer',
        param: { type: 'title' },
        field: { name: Lampa.Lang.translate('pi_categories_title') }
    })


    Lampa.Listener.follow('app', e => {
        if (e.type === 'ready') {
            loadRemoteList().then(buildMenu)
        }
    })


    console.log('External Plugin Installer loaded')
})();
