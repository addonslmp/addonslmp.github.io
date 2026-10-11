(function () {
    "use strict";

    Lampa.Lang.add({
        mp_title: { ru: "Мультиплагин", uk: "Мультиплагін", en: "Multiplugin" },
        mp_updated: { ru: "Обновлено: ", uk: "Оновлено: ", en: "Updated: " },
        mp_sync_plugins: { ru: "Синхронизировать плагины", uk: "Синхронізувати плагіни", en: "Sync Plugins" },
        mp_load_online_only: {
            ru: "Установить только онлайн",
            uk: "Встановити тільки онлайн",
            en: "Install only online",
        },
        mp_management: { ru: "Управление", uk: "Керування", en: "Management" },
        mp_installed_plugins: { ru: "Установленные плагины", uk: "Встановлені плагіни", en: "Installed Plugins" },
        mp_no_installed_plugins: {
            ru: "Нет установленных плагинов",
            uk: "Немає встановлених плагінів",
            en: "No installed plugins",
        },
        mp_plugin_removed: { ru: "Плагин удалён", uk: "Плагін видалено", en: "Plugin removed" },
        mp_disable_all: { ru: "Удалить все плагины", uk: "Видалити всі плагіни", en: "Remove All Plugins" },
        mp_reload_lampa: { ru: "Перезагрузить Lampa", uk: "Перезавантажити Lampa", en: "Reload Lampa" },
        mp_update_info: { ru: "Информация об обновлении", uk: "Інформація про оновлення", en: "Update Information" },
        mp_last_update: { ru: "Последнее обновление: ", uk: "Останнє оновлення: ", en: "Last Update: " },
        mp_added: { ru: "Добавлено:", uk: "Додано:", en: "Added:" },
        mp_removed: { ru: "Удалено:", uk: "Видалено:", en: "Removed:" },
        mp_no_changes: { ru: "Изменений нет", uk: "Змін немає", en: "No changes" },
        mp_sync_complete: { ru: "Синхронизация завершена", uk: "Синхронізація завершена", en: "Sync completed" },
        mp_confirm_sync: {
            ru: "Синхронизировать актуальные плагины с облака?",
            uk: "Синхронізувати актуальні плагіни з хмари?",
            en: "Sync latest plugins from cloud?",
        },
        mp_confirm_online: {
            ru: 'Установить только плагины категории "Онлайн"?',
            uk: 'Встановити тільки плагіни категорії "Онлайн"?',
            en: 'Install only "Online" category plugins?',
        },
        mp_confirm_disable_all: {
            ru: "Вы уверены? Все установленные плагины будут удалены",
            uk: "Ви впевнені? Усі встановлені плагіни будуть видалені",
            en: "Are you sure? All installed plugins will be removed",
        },
        mp_reload_message: {
            ru: "Перезапустить приложение?",
            uk: "Перезавантажити додаток?",
            en: "Restart application?",
        },
        mp_ok: { ru: "OK", uk: "OK", en: "OK" },
        mp_cancel: { ru: "Отмена", uk: "Скасувати", en: "Cancel" },
        mp_install_plugins: { ru: "Установка плагинов", uk: "Встановлення плагінів", en: "Install Plugins" },
        mp_all_plugins_removed: {
            ru: "Все плагины удалены. Перезагрузите Lampa",
            uk: "Усі плагіни видалено. Перезавантажте Lampa",
            en: "All plugins removed. Reload Lampa",
        },
        pi_install: { ru: "Установить", uk: "Встановити", en: "Install" },
        pi_remove: { ru: "Удалить", uk: "Видалити", en: "Remove" },
        pi_cancel: { ru: "Отмена", uk: "Скасувати", en: "Cancel" },
        pi_plugin_installed: { ru: "Плагин установлен", uk: "Плагін встановлено", en: "Plugin installed" },
        pi_plugin_removed: { ru: "Плагин удалён", uk: "Плагін видалено", en: "Plugin removed" },
        mp_captcha_warning: {
            ru: "Внимание! Массовая установка плагинов может привести к нестабильной работе приложения.<br><br>Некоторые плагины могут конфликтовать друг с другом, вызывать ошибки, зависания или поломку интерфейса.<br>Рекомендуется устанавливать только необходимые плагины и проверять их совместимость.",
            uk: "Увага! Масове встановлення плагінів може призвести до нестабільної роботи програми.<br><br>Деякі плагіни можуть конфліктувати між собою, викликати помилки, зависання або порушення роботи інтерфейсу.<br>Рекомендується встановлювати лише необхідні плагіни та перевіряти їх сумісність.",
            en: "Warning! Installing many plugins at once may cause application instability.<br><br>Some plugins may conflict with each other, causing errors, freezes, or interface breakage.<br>It is recommended to install only necessary plugins and check their compatibility.",
        },
        mp_sync_required: {
            ru: "Синхронизируйте список плагинов",
            uk: "Синхронізуйте список плагінів",
            en: "Sync the plugin list",
        },
        mp_and_more: {
            ru: "... и ещё ",
            uk: "... і ще ",
            en: "... and ",
        },
        mp_author: {
            ru: "Автор:",
            uk: "Автор:",
            en: "Author:",
        },
        mp_dont_show_again: {
            ru: "Больше не показывать",
            uk: "Більше не показувати",
            en: "Don't show again",
        },
    });

    var syncUrl = "https://addonslmp.github.io/sources/plugins_mp.json";
    var STORAGE_KEY = "multi_plugins_list";
    var INFO_KEY = "multi_last_update";
    var INSTALLED_KEY = "multi_installed_plugins";
    var SOURCE_KEY = "multiplugin";
    var INSTALLED_COLOR = "#8bc34a";
    var UPDATE_SEEN_KEY = "multi_update_seen";
    var SYNCED_ONCE_KEY = "multi_plugins_synced_once";
    var HIDE_INSTALL_WARNING_KEY = "mp_hide_install_warning";

    var pluginList = [];

    function translateObj(obj) {
        if (!obj) return "";
        if (typeof obj === "string") return obj;
        var lang = Lampa.Storage.get("language", "ru");
        return obj[lang] || obj.ru || obj.uk || obj.en || '';
    }

    function getCategories(list) {
        var cats = [];
        var i;
        for (i = 0; i < list.length; i++) {
            var cat = translateObj(list[i].category) || "Разное";
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
        var info = {
            date: date || "—",
            added: added || [],
            removed: removed || []
        };
        Lampa.Storage.set(INFO_KEY, info, true);
        Lampa.Storage.set(UPDATE_SEEN_KEY, false);
    }

    var MP_STYLE_ID = "mp-flat-modal-style";

    function mpInjectFlatStyle() {
        if (document.getElementById(MP_STYLE_ID)) return;

        var css = "" +
            ".mp-flat-modal{" +
                "--mp-card:rgba(128,128,128,.22);--mp-card-focus:rgba(128,128,128,.38);" +
                "--mp-accent:#0a84ff;--mp-add:#30d158;--mp-remove:#ff453a;--mp-warn:#ff9f0a;" +
            "}" +
            ".mp-flat-modal .modal__title{font-weight:600;}" +
            ".mp-flat-modal .about{line-height:1.45;}" +

            ".mp-flat{text-align:left;color:inherit;box-sizing:border-box;font-size:1.44em;}" +
            ".mp-flat__date{font-size:.86em;line-height:1.35;margin-bottom:14px;}" +
            ".mp-flat__date b{font-weight:500;}" +
            ".mp-flat__dim{opacity:.65;}" +
            ".mp-flat__section{font-weight:600;font-size:.95em;margin:0 0 8px;display:flex;align-items:center;}" +
            ".mp-flat__section:before{content:'';width:4px;height:1em;border-radius:2px;margin-right:8px;background:var(--mp-accent);}" +
            ".mp-flat__section--add:before{background:var(--mp-add);}" +
            ".mp-flat__section--remove:before{background:var(--mp-remove);}" +
            ".mp-flat__item{background:var(--mp-card);border-radius:4px;padding:9px 12px;margin-bottom:6px;}" +
            ".mp-flat__name{line-height:1.3;font-weight:600;}" +
            ".mp-flat__desc{opacity:.65;font-size:.88em;line-height:1.3;margin-top:3px;}" +
            ".mp-flat__more{opacity:.65;font-size:.9em;margin:2px 0 16px 2px;}" +
            ".mp-flat__empty{opacity:.65;}" +

            ".mp-flat__warn{" +
                "background:var(--mp-card);border-radius:4px;padding:12px 14px;" +
                "border-left:4px solid var(--mp-warn);line-height:1.45;font-size:1em;" +
            "}" +

            ".mp-dont-show{display:inline-flex;align-items:center;justify-content:center;" +
                "padding:.7em 1.1em;border-radius:4px;background:var(--mp-card);}" +
            ".mp-dont-show.focus{background:var(--mp-card-focus);}" +
            ".mp-dont-show .mp-check-box{width:1.3em;height:1.3em;border-radius:4px;margin-right:.7em;" +
                "display:flex;align-items:center;justify-content:center;flex-shrink:0;box-sizing:border-box;" +
                "font-size:.85em;line-height:1;color:#fff;background:transparent;border:2px solid rgba(128,128,128,.85);}" +
            ".mp-dont-show .mp-check-box.mp-checked{background:#fff;border-color:#fff;color:#000;}" +
            ".mp-dont-show.focus .mp-check-box:not(.mp-checked){border-color:currentColor;}" +
            ".mp-dont-show .mp-check-label{line-height:1.25em;white-space:nowrap;}" +

            ".mp-toast{position:fixed;top:1.6em;left:50%;transform:translate(-50%,-160%);opacity:0;z-index:99999;" +
                "display:flex;align-items:center;max-width:80%;box-sizing:border-box;" +
                "background:rgba(28,28,30,.85);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);" +
                "color:#f2f2f7;border-radius:14px;padding:.75em 1.3em .75em 0;" +
                "font-size:1.28em;line-height:1.3;pointer-events:none;box-shadow:none;" +
                "transition:transform .25s ease,opacity .25s ease;}" +
            ".mp-toast--show{transform:translate(-50%,0);opacity:1;}" +
            ".mp-toast__bar{width:4px;align-self:stretch;border-radius:2px;margin:.1em .9em .1em .75em;background:#98989f;flex-shrink:0;}" +
            ".mp-toast--success .mp-toast__bar{background:#30d158;}" +
            ".mp-toast--error .mp-toast__bar{background:#ff453a;}" +
            ".mp-toast--warn .mp-toast__bar{background:#ff9f0a;}" +
            ".mp-toast--info .mp-toast__bar{background:#0a84ff;}" +

            "body.mp-mute-noty .noty{display:none!important;}";

        var style = document.createElement("style");
        style.id = MP_STYLE_ID;
        style.textContent = css;
        document.head.appendChild(style);
    }

    function mpMarkModal() {
        try {
            $(".modal").last().addClass("mp-flat-modal");
        } catch (e) {}
    }

    function mpOpenModal(params) {
        mpInjectFlatStyle();
        Lampa.Modal.open(params);
        mpMarkModal();
    }

    var mpNotyMuted = false;
    var mpNotyOrig = null;
    var mpNotyMuteTimer = null;

    function mpMuteLampaNoty(ms) {
        try {
            mpInjectFlatStyle();

            if (!mpNotyOrig && Lampa.Noty && typeof Lampa.Noty.show === "function") {
                mpNotyOrig = Lampa.Noty.show;
                Lampa.Noty.show = function () {
                    if (mpNotyMuted) return;
                    return mpNotyOrig.apply(this, arguments);
                };
            }

            mpNotyMuted = true;
            $("body").addClass("mp-mute-noty");
            $(".noty").remove();

            clearTimeout(mpNotyMuteTimer);
            mpNotyMuteTimer = setTimeout(function () {
                mpNotyMuted = false;
                $("body").removeClass("mp-mute-noty");
            }, ms || 3000);
        } catch (e) {}
    }

    var mpToastTimer = null;
    var mpToastRemoveTimer = null;

    function mpNotify(text, type, time) {
        mpInjectFlatStyle();
        type = type || "info";
        time = time || 3000;

        clearTimeout(mpToastTimer);
        clearTimeout(mpToastRemoveTimer);
        $(".mp-toast").remove();

        var el = $('<div class="mp-toast mp-toast--' + type + '"><div class="mp-toast__bar"></div><div class="mp-toast__text"></div></div>');
        el.find(".mp-toast__text").text(text);
        $("body").append(el);

        setTimeout(function () {
            el.addClass("mp-toast--show");
        }, 20);

        mpToastTimer = setTimeout(function () {
            el.removeClass("mp-toast--show");
            mpToastRemoveTimer = setTimeout(function () {
                el.remove();
            }, 300);
        }, time);
    }

    function mpFlatItem(p) {
        var name = translateObj(p.name) || p.url.split("/").pop();
        var category = translateObj(p.category);
        if (category) name += " (" + category + ")";

        var html = '<div class="mp-flat__item"><div class="mp-flat__name">' + name + "</div>";
        if (p.description) {
            html += '<div class="mp-flat__desc">' + translateObj(p.description) + "</div>";
        }
        return html + "</div>";
    }

    function mpFlatSection(list, titleKey, modifier) {
        if (!list.length) return "";
        var limit = 5;
        var count = Math.min(list.length, limit);

        var html = '<div class="mp-flat__section mp-flat__section--' + modifier + '">' +
            Lampa.Lang.translate(titleKey).replace(/:\s*$/, "") + "</div>";

        for (var i = 0; i < count; i++) html += mpFlatItem(list[i]);

        if (list.length > limit) {
            html += '<div class="mp-flat__more">' + Lampa.Lang.translate("mp_and_more") + (list.length - limit) + "</div>";
        } else {
            html += '<div style="height:10px"></div>';
        }
        return html;
    }

    function getUpdateInfo() {
        return Lampa.Storage.get(INFO_KEY, { date: "—", added: [], removed: [] });
    }

    function showInfo() {
        var info = getUpdateInfo();
        Lampa.Storage.set(UPDATE_SEEN_KEY, true);

        var html = '<div class="mp-flat">';
        html += '<div class="mp-flat__date"><span class="mp-flat__dim">' + Lampa.Lang.translate("mp_last_update") + "</span><b>" + info.date + "</b></div>";
        html += mpFlatSection(info.added, "mp_added", "add");
        html += mpFlatSection(info.removed, "mp_removed", "remove");

        if (!info.added.length && !info.removed.length) {
            html += '<div class="mp-flat__empty">' + Lampa.Lang.translate("mp_no_changes") + "</div>";
        }
        html += "</div>";

        var prev = Lampa.Controller.enabled().name;
        mpOpenModal({
            title: Lampa.Lang.translate("mp_update_info"),
            align: "center",
            size: "medium",
            html: $(html),
            onBack: function () {
                Lampa.Modal.close();
                if (prev) Lampa.Controller.toggle(prev);
            },
        });
    }

    function disableAllPlugins() {
        var prev = Lampa.Controller.enabled().name;

        mpOpenModal({
            title: Lampa.Lang.translate("mp_disable_all"),
            align: "center",
            html: $('<div class="about">' + Lampa.Lang.translate("mp_confirm_disable_all") + "</div>"),
            buttons: [
                {
                    name: Lampa.Lang.translate("mp_cancel"),
                    onSelect: function () {
                        Lampa.Modal.close();
                        Lampa.Controller.toggle(prev);
                    },
                },
                {
                    name: Lampa.Lang.translate("pi_remove"),
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

                        mpNotify(Lampa.Lang.translate("mp_all_plugins_removed"), "error", 4000);

                        Lampa.Controller.toggle(prev);
                    },
                },
            ],
        });
    }

    function confirmAndSync() {
        var prev = Lampa.Controller.enabled().name;
        mpOpenModal({
            title: Lampa.Lang.translate("mp_sync_plugins"),
            align: "center",
            html: $('<div class="about">' + Lampa.Lang.translate("mp_confirm_sync") + "</div>"),
            buttons: [
                {
                    name: Lampa.Lang.translate("mp_cancel"),
                    onSelect: function () {
                        Lampa.Modal.close();
                        Lampa.Controller.toggle(prev);
                    },
                },
                {
                    name: Lampa.Lang.translate("mp_ok"),
                    onSelect: function () {
                        Lampa.Modal.close();
                        synchronize(function () {
                            Lampa.Controller.toggle(prev);
                        });
                    },
                },
            ],
        });
    }

    function confirmAndLoadOnline() {
        var prev = Lampa.Controller.enabled().name;
        mpOpenModal({
            title: Lampa.Lang.translate("mp_load_online_only"),
            align: "center",
            html: $('<div class="about">' + Lampa.Lang.translate("mp_confirm_online") + "</div>"),
            buttons: [
                {
                    name: Lampa.Lang.translate("mp_cancel"),
                    onSelect: function () {
                        Lampa.Modal.close();
                        Lampa.Controller.toggle(prev);
                    },
                },
                {
                    name: Lampa.Lang.translate("mp_ok"),
                    onSelect: function () {
                        Lampa.Modal.close();
                        loadOnlyOnline(function () {
                            Lampa.Controller.toggle(prev);
                        });
                    },
                },
            ],
        });
    }

    function loadOnlyOnline(callback) {
        Lampa.Loading.start();

        $.getJSON(syncUrl, function (data) {
            try {
                if (!Array.isArray(data.plugins)) throw new Error("Invalid data");
                var newList = [];
                var i;
                for (i = 0; i < data.plugins.length; i++) {
                    var item = data.plugins[i];
                    newList.push({
                        url: item.url,
                        name: item.name,
                        description: item.description,
                        category: item.category,
                        author: item.author,
                    });
                }
                savePluginList(newList);

                for (i = 0; i < newList.length; i++) {
                    var p = newList[i];
                    var cat = translateObj(p.category).toLowerCase();

                    if (cat === "онлайн" || cat === "online") {
                        var existsInstalled = isInstalled(p.url);

                        if (!existsInstalled) {
                            Lampa.Plugins.add({
                                url: p.url,
                                name: translateObj(p.name) || p.url.split("/").pop(),
                                author: p.author || "",
                                status: 1,
                                source: SOURCE_KEY,
                            });

                            addInstalledFromMulti(p.url);
                        }
                    }
                }

                Lampa.Plugins.save();

                setTimeout(function () {
                    if (callback) callback();
                    Lampa.Controller.toggle("settings_component");
                }, 100);
            } catch (e) {
                console.error("Load online error:", e);
                mpNotify("Ошибка загрузки", "error");
            } finally {
                Lampa.Loading.stop();
            }
        }).fail(function () {
            mpNotify("Ошибка загрузки", "error");
            Lampa.Loading.stop();
            if (callback) callback();
        });
    }

    function synchronize(callback) {
        Lampa.Loading.start();

        $.getJSON(syncUrl, function (data) {
            try {
                if (!Array.isArray(data.plugins)) throw new Error("Invalid data");
                var remoteDate = data.updateDate || "—";
                var newList = [];
                var i;
                for (i = 0; i < data.plugins.length; i++) {
                    var item = data.plugins[i];
                    newList.push({
                        url: item.url,
                        name: item.name,
                        description: item.description,
                        category: item.category,
                        author: item.author,
                    });
                }

                var prevList = getPluginList();
                var syncedOnce = Lampa.Storage.get(SYNCED_ONCE_KEY, false);

                if (!syncedOnce && prevList && prevList.length > 0) {
                    Lampa.Storage.set(SYNCED_ONCE_KEY, true);
                    syncedOnce = true;
                }

                if (!syncedOnce) {
                    savePluginList(newList);
                    saveUpdateInfo(remoteDate, [], []);
                    Lampa.Storage.set(SYNCED_ONCE_KEY, true);
                    mpNotify(Lampa.Lang.translate("mp_sync_complete"), "success");
                    if (callback) callback();
                    Lampa.Loading.stop();
                    return;
                }

                var prevUrls = prevList.map(function (p) { return p.url; });
                var newUrls = newList.map(function (p) { return p.url; });

                var currentInfo = getUpdateInfo();
                var sameDate = currentInfo.date === remoteDate;

                if (sameDate) {
                    savePluginList(newList);
                    mpNotify(Lampa.Lang.translate("mp_sync_complete"), "success");
                    if (callback) callback();
                    Lampa.Loading.stop();
                    return;
                }

                var added = newList.filter(function (p) {
                    return prevUrls.indexOf(p.url) === -1;
                });

                var removed = prevList.filter(function (p) {
                    return newUrls.indexOf(p.url) === -1;
                });

                savePluginList(newList);
                saveUpdateInfo(remoteDate, added, removed);

                mpNotify(Lampa.Lang.translate("mp_sync_complete"), "success");
            } catch (e) {
                console.error("Sync error:", e);
                mpNotify("Ошибка синхронизации", "error");
            } finally {
                Lampa.Loading.stop();
                if (callback) callback();
            }
        }).fail(function () {
            mpNotify("Ошибка синхронизации", "error");
            Lampa.Loading.stop();
            if (callback) callback();
        });
    }

    function checkUpdatesOnStart() {
        $.getJSON(syncUrl, function (data) {
            try {
                if (!Array.isArray(data.plugins)) return;
                var remoteDate = data.updateDate || "—";
                var remotePlugins = data.plugins;
                var remoteList = [];
                var i;
                for (i = 0; i < remotePlugins.length; i++) {
                    remoteList.push({
                        url: remotePlugins[i].url,
                        name: remotePlugins[i].name,
                        description: remotePlugins[i].description,
                        category: remotePlugins[i].category,
                        author: remotePlugins[i].author,
                    });
                }

                var localList = getPluginList();
                if (!localList || localList.length === 0) return;

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
                    if (localUrls.indexOf(remoteList[i].url) === -1) {
                        added.push(remoteList[i]);
                    }
                }

                var removed = [];
                for (i = 0; i < localList.length; i++) {
                    if (remoteUrls.indexOf(localList[i].url) === -1) {
                        removed.push(localList[i]);
                    }
                }

                if (added.length > 0 || removed.length > 0) {
                    saveUpdateInfo(remoteDate, added, removed);
                }
            } catch (e) {
                console.error("Check on start error:", e);
            }
        }).fail(function () {});
    }

    function registerSettings() {
        Lampa.SettingsApi.addComponent({
            component: "multi_plugin",
            icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="16" height="16" rx="2" stroke="#fff" stroke-width="2"/><rect x="8" y="8" width="8" height="8" rx="1" stroke="#fff" stroke-width="2"/></svg>',
            name: Lampa.Lang.translate("mp_title"),
        });

        Lampa.SettingsApi.addParam({
            component: "multi_plugin",
            param: { type: "button" },
            field: { name: Lampa.Lang.translate("mp_updated") + getUpdateInfo().date },
            onChange: showInfo,
        });

        Lampa.SettingsApi.addParam({
            component: "multi_plugin",
            param: { type: "button" },
            field: { name: Lampa.Lang.translate("mp_sync_plugins") },
            onChange: confirmAndSync,
        });

        Lampa.SettingsApi.addParam({
            component: "multi_plugin",
            param: { type: "button" },
            field: { name: Lampa.Lang.translate("mp_load_online_only") },
            onChange: confirmAndLoadOnline,
        });

        Lampa.SettingsApi.addParam({
            component: "multi_plugin",
            param: { type: "title" },
            field: { name: Lampa.Lang.translate("mp_management") },
        });

        Lampa.SettingsApi.addParam({
            component: "multi_plugin",
            param: { type: "button" },
            field: { name: Lampa.Lang.translate("mp_install_plugins") },
            onChange: openCaptchaGate,
        });

        Lampa.SettingsApi.addParam({
            component: "multi_plugin",
            param: { type: "button" },
            field: { name: Lampa.Lang.translate("mp_installed_plugins") },
            onChange: showInstalledPlugins,
        });

        Lampa.SettingsApi.addParam({
            component: "multi_plugin",
            param: { type: "button" },
            field: { name: Lampa.Lang.translate("mp_disable_all") },
            onChange: disableAllPlugins,
        });

        Lampa.SettingsApi.addParam({
            component: "multi_plugin",
            param: { type: "button" },
            field: { name: Lampa.Lang.translate("mp_reload_lampa") },
            onChange: function () {
                var prev = Lampa.Controller.enabled().name;
                mpOpenModal({
                    title: Lampa.Lang.translate("mp_reload_lampa"),
                    align: "center",
                    html: $('<div class="about">' + Lampa.Lang.translate("mp_reload_message") + "</div>"),
                    buttons: [
                        {
                            name: Lampa.Lang.translate("mp_cancel"),
                            onSelect: function () {
                                Lampa.Modal.close();
                                Lampa.Controller.toggle(prev);
                            },
                        },
                        {
                            name: Lampa.Lang.translate("mp_ok"),
                            onSelect: function () {
                                Lampa.Modal.close();
                                window.location.reload();
                            },
                        },
                    ],
                });
            },
        });
    }

    function openCaptchaGate() {
        if (Lampa.Storage.get(HIDE_INSTALL_WARNING_KEY, false)) {
            showInstallPlugins();
            return;
        }

        if (Lampa.Storage.get("mp_install_shown", false)) {
            showInstallPlugins();
            return;
        }

        var hideWarning = false;
        var prev = null;
        try {
            prev = Lampa.Controller.enabled().name;
        } catch (e) {}

        var html = $(
            '<div class="mp-flat">' +
                '<div class="mp-flat__warn">' + Lampa.Lang.translate("mp_captcha_warning") + "</div>" +
                '<div style="display:flex;justify-content:center;width:100%;margin-top:1.2em;">' +
                    '<div class="selector mp-dont-show">' +
                        '<div class="mp-check-box"></div>' +
                        '<div class="mp-check-label">' + Lampa.Lang.translate("mp_dont_show_again") + "</div>" +
                    "</div>" +
                "</div>" +
            "</div>"
        );

        mpOpenModal({
            title: Lampa.Lang.translate("mp_install_plugins"),
            align: "center",
            size: "medium",
            html: html,
            buttons: [
                {
                    name: "OK",
                    onSelect: function () {
                        Lampa.Modal.close();
                        Lampa.Storage.set("mp_install_shown", true);
                        if (hideWarning) {
                            Lampa.Storage.set(HIDE_INSTALL_WARNING_KEY, true);
                        }
                        setTimeout(function () {
                            showInstallPlugins();
                        }, 300);
                    },
                },
            ],
            onBack: function () {
                Lampa.Modal.close();
                if (prev) Lampa.Controller.toggle(prev);
            },
        });

        setTimeout(function () {
            var row = $(".modal .mp-dont-show");
            var box = row.find(".mp-check-box");
            if (!row.length) return;

            var toggling = false;

            function updateCheckVisual() {
                if (hideWarning) {
                    box.addClass("mp-checked").html("✓");
                } else {
                    box.removeClass("mp-checked").html("");
                }
            }

            function toggleCheck() {
                if (toggling) return;
                toggling = true;
                hideWarning = !hideWarning;
                updateCheckVisual();
                setTimeout(function () {
                    toggling = false;
                }, 150);
            }

            row.off("hover:enter.mpdont click.mpdont");
            row.on("hover:enter.mpdont", toggleCheck);
            row.on("click.mpdont", function (e) {
                e.preventDefault();
                e.stopPropagation();
                toggleCheck();
            });

            try {
                var modal = $(".modal");
                var okButton = modal.find(".selector").not(".mp-dont-show").last();
                Lampa.Controller.collectionSet(modal);
                if (okButton.length) Lampa.Controller.collectionFocus(okButton[0], modal);
            } catch (e) {}
        }, 80);
    }

    function showInstallPlugins() {
        if (!pluginList || pluginList.length === 0) {
            mpNotify(Lampa.Lang.translate("mp_sync_required"), "warn");
            Lampa.Controller.toggle("settings_component");
            return;
        }

        var categories = getCategories(pluginList);

        var items = [];
        var i;
        for (i = 0; i < categories.length; i++) {
            items.push({
                title: categories[i],
                category: categories[i],
            });
        }

        Lampa.Select.show({
            title: Lampa.Lang.translate("mp_install_plugins"),
            items: items,
            onSelect: function (item) {
                showInstallCategory(item.category);
            },
            onBack: function () {
                Lampa.Controller.toggle("settings_component");
            },
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
            var name = translateObj(p.name) || p.url.split("/").pop();

            var nameHtml = installed
                ? '<span style="color:' + INSTALLED_COLOR + '">' + name + "</span>"
                : name;

            var title = nameHtml;

            if (p.author) {
                title +=
                    "<br><font color='#aaaaaa'>" +
                    Lampa.Lang.translate("mp_author") +
                    "</font> " +
                    p.author;
            }

            items.push({
                title: title,
                subtitle: translateObj(p.description) || "",
                url: p.url,
                plugin: p,
                installed: installed,
            });
        }

        Lampa.Select.show({
            title: category,
            items: items,
            onSelect: function (item) {
                showPluginActions(item.plugin, item.installed, category);
            },
            onBack: function () {
                showInstallPlugins();
            },
        });
    }

    function showPluginActions(plugin, isInstalled, category) {
        var actions = [];

        if (isInstalled) {
            actions.push({
                title: Lampa.Lang.translate("pi_remove"),
                onSelect: function () {
                    removePlugin(plugin.url);
                    showInstallCategory(category);
                },
            });
        } else {
            actions.push({
                title: Lampa.Lang.translate("pi_install"),
                onSelect: function () {
                    installPlugin(plugin);
                    showInstallCategory(category);
                },
            });
        }

        actions.push({
            title: Lampa.Lang.translate("pi_cancel"),
            onSelect: function () {
                showInstallCategory(category);
            },
        });

        Lampa.Select.show({
            title: translateObj(plugin.name) || plugin.url.split("/").pop(),
            items: actions,
            onBack: function () {
                showInstallCategory(category);
            },
        });
    }

    function installPlugin(p) {
        var url = p.url;
        if (isInstalled(url)) return;

        mpMuteLampaNoty(3500);

        var prev = null;
        try {
            prev = Lampa.Controller.enabled().name;
        } catch (e) {}

        Lampa.Plugins.add({
            url: url,
            name: translateObj(p.name) || url.split("/").pop(),
            author: p.author || "",
            status: 1,
            source: SOURCE_KEY,
        });

        Lampa.Plugins.save();

        addInstalledFromMulti(url);

        mpNotify(Lampa.Lang.translate("pi_plugin_installed"), "success");

        setTimeout(function () {
            try {
                Lampa.Controller.collectionSet();
            } catch (e) {}
            try {
                if (prev) Lampa.Controller.toggle(prev);
            } catch (e) {}
        }, 800);
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

            mpNotify(Lampa.Lang.translate("mp_plugin_removed"), "error");
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
            mpNotify(Lampa.Lang.translate("mp_no_installed_plugins"), "info");
            Lampa.Controller.toggle("settings_component");
            return;
        }

        var items = [];
        var i;

        for (i = 0; i < urls.length; i++) {
            var url = urls[i];
            var name = url.split("/").pop().replace(".js", "");

            var j;
            for (j = 0; j < pluginList.length; j++) {
                if (pluginList[j].url === url) {
                    name = translateObj(pluginList[j].name) || name;
                    break;
                }
            }

            items.push({
                title: '<span style="color:' + INSTALLED_COLOR + '">' + name + "</span>",
                subtitle: url,
                url: url,
                name: name,
            });
        }

        Lampa.Select.show({
            title: Lampa.Lang.translate("mp_installed_plugins"),
            items: items,
            onSelect: function (item) {
                showInstalledActions(item);
            },
            onBack: function () {
                Lampa.Controller.toggle("settings_component");
            },
        });
    }

    function showInstalledActions(item) {
        Lampa.Select.show({
            title: item.name,
            items: [
                {
                    title: Lampa.Lang.translate("pi_remove"),
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
                        mpNotify(Lampa.Lang.translate("mp_plugin_removed"), "error");
                        showInstalledPlugins();
                    },
                },
                {
                    title: Lampa.Lang.translate("pi_cancel"),
                    onSelect: function () {
                        showInstalledPlugins();
                    },
                },
            ],
            onBack: function () {
                showInstalledPlugins();
            },
        });
    }

    function startPlugin() {
        Lampa.Storage.set("mp_install_shown", false);

        pluginList = getPluginList();
        checkUpdatesOnStart();
        registerSettings();
    }

    if (window.appready) {
        startPlugin();
    } else {
        Lampa.Listener.follow("app", function (e) {
            if (e.type === "ready") {
                startPlugin();
            }
        });
    }
})();
