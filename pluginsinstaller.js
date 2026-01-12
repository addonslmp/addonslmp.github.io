(function () {
    'use strict'

    const REMOTE_URL = 'https://addonslmp.github.io/sources/plugins_example.js'
    const STORAGE_KEY = 'external_installer_plugins'
    const SOURCE_KEY = 'external_installer'
    const URL_STORAGE_KEY = 'external_installer_source_url'
    const INSTALLED_COLOR = '#02e602'

    let plugins = []

    /* =======================
       Получение источника
    ======================= */
    function getSourceUrl() {
        return Lampa.Storage.get(URL_STORAGE_KEY, REMOTE_URL)
    }

    /* =======================
       Загрузка списка
    ======================= */
    function loadRemoteList() {
        const url = getSourceUrl()

        return fetch(url, { cache: 'no-cache' })
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

    /* =======================
       Утилиты
    ======================= */
    function getInstalled() {
        return Lampa.Plugins.get() || []
    }

    function isInstalled(url) {
        return getInstalled().some(p => p.url === url)
    }

    function getTitle(name, installed) {
        return installed
            ? `<span style="color:${INSTALLED_COLOR}">${name}</span>`
            : name
    }

    function installPlugin(p) {
        if (isInstalled(p.url)) return

        Lampa.Plugins.add({
            url: p.url,
            name: p.name,
            status: 1,
            source: SOURCE_KEY
        })

        Lampa.Plugins.save()
        Lampa.Noty.show('Плагин установлен')
    }

    function removePlugin(p) {
        const installed = getInstalled()
        const target = installed.find(x => x.url === p.url && x.source === SOURCE_KEY)
        if (!target) return

        Lampa.Plugins.remove(target)
        Lampa.Plugins.save()
        Lampa.Noty.show('Плагин удалён')
    }

    /* =======================
       Меню плагина
    ======================= */
    function showPluginMenu(category, plugin) {
        const installed = isInstalled(plugin.url)

        Lampa.Select.show({
            title: plugin.name,
            items: [
                {
                    title: installed ? 'Удалить' : 'Установить',
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

    /* =======================
       Категория
    ======================= */
    function showCategory(category) {
        const categoryPlugins = plugins.filter(p => p.category === category)

        if (!categoryPlugins.length) {
            Lampa.Noty.show(`В категории "${category}" нет плагинов`)
            return
        }

        const items = categoryPlugins.map(p => {
            const installed = isInstalled(p.url)

            return {
                title: getTitle(p.name, installed),
                subtitle: p.description || '',
                plugin: p
            }
        })

        Lampa.Select.show({
            title: category,
            items: items,
            onSelect: function (item) {
                showPluginMenu(category, item.plugin)
            },
            onBack: function () {
                Lampa.Controller.toggle('settings_component')
            }
        })
    }

    /* =======================
       Построение меню
    ======================= */
    function buildMenu() {
        const categories = [...new Set(plugins.map(p => p.category))]

        categories.forEach(cat => {
            Lampa.SettingsApi.addParam({
                component: 'external_installer',
                param: { type: 'button' },
                field: { name: cat },
                onChange: () => showCategory(cat)
            })
        })
    }

    /* =======================
       Инициализация + кнопка «Источник плагинов»
    ======================= */
    Lampa.SettingsApi.addComponent({
        component: 'external_installer',
        icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="6" width="16" height="12" rx="4" stroke="#fff" stroke-width="2"/><circle cx="9.5" cy="12" r="1.4" fill="#fff"/><circle cx="14.5" cy="12" r="1.4" fill="#fff"/><path d="M8 2v4M16 2v4" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>',
        name: 'Сторонние плагины'
    })

    Lampa.SettingsApi.addParam({
        component: 'external_installer',
        param: { type: 'button' },
        field: { name: 'Источник плагинов' },
        onChange: function () {
            const currentUrl = Lampa.Storage.get(URL_STORAGE_KEY, REMOTE_URL)

            Lampa.Input.edit({
                title: 'Источник плагинов',
                free: true,
                nosave: true,
                nomic: true,
                value: currentUrl
            }, (value) => {
                if (value && value.startsWith('http')) {
                    Lampa.Storage.set(URL_STORAGE_KEY, value)
                    Lampa.Noty.show('Источник установлен. Перезагрузка…')
                    setTimeout(() => {
                        window.location.reload()
                    }, 3000)
                } else {
                    Lampa.Noty.show('Неверный URL')
                }
            })
        }
    })

    Lampa.SettingsApi.addParam({
        component: 'external_installer',
        param: { type: 'title' },
        field: { name: 'Категории' }
    })

    Lampa.Listener.follow('app', e => {
        if (e.type === 'ready') {
            loadRemoteList().then(buildMenu)
        }
    })

    console.log('External Plugin Installer loaded')
})()
