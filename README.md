Language [English](README.md) | [Українська](README.ua.md) | [Русский](README.ru.md)
---

**Multiplugin** is a collection of installable plugins for **Lampa**.

It loads a list of plugins from a JSON file and allows you to enable or disable them using checkboxes.  
Essentially, it is a plugin manager that simplifies installing extensions.

---

# What it does

* Loads the current list of plugins from JSON
* Displays them by categories
* Allows enabling / disabling plugins
* Loads only selected plugins (**lazy-load**)
* Shows changes when the list is updated
* Allows exporting plugins as standard extensions

Multiplugin **does not contain plugins inside itself**.  
It only connects them via URLs.

---

# Installation

1. **Lampa → Settings**
2. **Extensions**
3. **Add plugin**
4. Paste this link:

```
https://addonslmp.github.io/multiplugin.js
````

After installation a new section **“Multiplugin”** will appear in the settings.

---

# How to use

1. Open the **Multiplugin** section

2. Click **«Synchronize plugins»**

3. Restart **Lampa**
   (there is a restart button inside the plugin)

4. After that, categories will appear in the Multiplugin menu where you can check the plugins you want to enable.

If you want to remove a plugin, simply uncheck it and restart **Lampa**.

---

# «Load Online Only» button

Enables a set of plugins for online streaming.

This is simply a quick way to enable popular plugins without selecting them manually.

---

# Exporting plugins

If you like some plugins, you can **export them as standard extensions**.

There are two export options:

1. **Export → Select plugins** — you can choose plugins in this menu. You can select multiple plugins across different categories.
2. **Export enabled** — installs the plugins that are currently enabled in Multiplugin.

After exporting:

* they work as regular Lampa plugins
* Multiplugin no longer manages them
* they will remain even if you remove Multiplugin
* they can only be removed via **Extensions → plugin list** in the Lampa settings

---

# If something is not working correctly

Usually this helps:

```
Disable all plugins
+
Restart Lampa
```

**Important: plugins that were exported to the **Lampa Extensions** section cannot be disabled through Multiplugin. They must be disabled or removed manually in the extensions settings.**

---

# Plugin list source

The plugin list is stored here:

```
https://addonslmp.github.io/sources/plugins_mp.json
```

Multiplugin loads it during synchronization.

---

# Technical details

Multiplugin consists of three parts:

```
JSON source
      ↓
Multiplugin
      ↓
Lampa plugins
```

### JSON

Contains the list of plugins.

### Multiplugin

Responsible for:

* loading the plugin list
* displaying plugins
* managing enabled plugins

### Lampa

Physically loads the JS files of the plugins.

---

# JSON format

Example entry:

```json
{
  "name": {
    "ru": "Мегаплагин",
    "uk": "Мегаплагін",
    "en": "Megaplugin"
  },
  "url": "https://site/plugin.js",
  "description": {
    "ru": "Описание",
    "uk": "Опис",
    "en": "Description"
  },
  "category": {
    "ru": "Разное",
    "uk": "Різне",
    "en": "Misc"
  }
}
```

Main field:

```
url
```

**URL is the unique identifier of the plugin.**

---

# Lazy-load loading

Multiplugin loads only enabled plugins.

It uses the standard Lampa function:

```javascript
Lampa.Utils.putScriptAsync()
```

Essentially Multiplugin does:

```html
<script src="plugin.js"></script>
```

---

# Duplicate protection

To prevent the same plugin from being loaded multiple times, Multiplugin uses:

```javascript
const loadedPlugins = new Set()
```

Before loading:

```javascript
if (loadedPlugins.has(url)) return;
```

After loading:

```javascript
loadedPlugins.add(url)
```

This is important because the same plugin can appear in multiple categories.

---

# Storage keys

Multiplugin uses several keys in `Lampa.Storage`.

| Key                     | Purpose                            |
| ----------------------- | ---------------------------------- |
| `multi_plugins_list`    | List of plugins received from JSON |
| `multi_enabled_plugins` | List of URLs of enabled plugins    |
| `multi_last_update`     | Information about the last update  |
| `updateCache`           | Plugin loading cache               |

**Notes:**

* All keys start with `multi_` to avoid conflicts with other plugins.
* `updateCache` is a technical loading cache used to avoid reloading old links after synchronization.

---

# Synchronization

The **“Synchronize plugins”** button performs:

1. JSON loading
2. list comparison
3. detection of added / removed plugins
4. Storage update

---

# Categories

Categories are used **only for the interface**.

The same plugin can appear in multiple categories.

Physically it will only be loaded once.

---

# Summary

Multiplugin is simply:

```
plugin list (JSON)
+
enable/disable manager
+
dynamic JS loading
```

It does not modify Lampa and does not interfere with the operation of the plugins themselves.
