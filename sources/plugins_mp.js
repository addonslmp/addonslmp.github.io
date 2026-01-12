const updateDate = '13.01.2026';

const remotePlugins = [
  {
    name: 'MyShows',
    url: 'https://igorek1986.github.io/lampa-plugins/myshows.js',
    description: 'Плагин для синхронизации сервиса MyShows с Lampa.',
    category: 'Разное'
  },
  {
    name: 'Series Skip Intro',
    url: 'https://honeyxcat.github.io/series-skip/series-skip.js',
    description: 'Автоматический пропуск интро и титров в сериалах. Работает только во ВСТРОЕННОМ ПЛЕЕРЕ.',
    category: 'Разное'
  },
  {
    name: 'Anime Skip',
    url: 'https://honeyxcat.github.io/lampa-anime-skip/anime-skip-min.js',
    description: 'Плагин добавляет отметки для пропуска опенингов и эндингов в аниме, используя базу Anime-Skip. Работает только во ВСТРОЕННОМ ПЛЕЕРЕ.',
    category: 'Разное'
  },
  {
    name: 'Online lampac grabber',
    url: 'https://honeyxcat.github.io/lampa-link-online/oooo.js',
    description: 'Плагин ворует онлайн из открытых Lampac.',
    category: 'Разное'
  },
  {
    name: 'Plugin installer',
    url: 'https://addonslmp.github.io/pluginsinstaller.js',
    description: 'Простая установка плагинов из вашего источника.',
    category: 'Разное'
  },
  {
    name: 'Новые категории и подборки фильмов',
    url: 'https://lampaplugins.github.io/store/p.js',
    description: 'Новые категории',
    category: 'Категории'
  },
  {
    name: 'NUM Parser',
    url: 'https://igorek1986.github.io/lampa-plugins/np.js',
    description: 'NUM источник.',
    category: 'Категории'
  },
  {
    name: 'Трейлеры новинок',
    url: 'https://mastermagic98.github.io/l_plugins/upcoming.js',
    description: 'Новые трейлеры фильмов/сериалов.',
    category: 'Категории'
  },
  {
    name: 'LNum категория',
    url: 'https://levende.github.io/lampa-plugins/lnum.js',
    description: 'LNum источник.',
    category: 'Категории'
  },
  {
    name: 'Surs категория',
    url: 'https://aviamovie.github.io/surs.js',
    description: 'Плагин создает уникальные подборки фильмов и сериалов на главной странице по жанрам, стримингам, популярности, просмотрам и кассовым сборам.',
    category: 'Категории'
  },
  {
    name: 'Logo Title',
    url: 'https://mastermagic98.github.io/l_plugins/logo_title.js',
    description: 'Лого фильма вместо названий.',
    category: 'Интерфейс'
  },
  {
    name: 'Новый интерфейс лампы',
    url: 'https://honeyxcat.github.io/lampa_interface/int.js',
    description: 'Стильный интерфейс.',
    category: 'Интерфейс'
  },
  {
    name: 'Apple theme',
    url: 'https://darkestclouds.github.io/plugins/applecation/applecation.min.js',
    description: 'Интерфейс карточек в стиле Apple.',
    category: 'Интерфейс'
  },
  {
    name: 'Torrent Manager',
    url: 'https://lampame.github.io/main/torrentmanager.js',
    description: 'Торрент качалка. Управление торрент клиентом с лампы.',
    category: 'Торрент'
  },
  {
    name: 'PubTorr',
    url: 'https://lampame.github.io/main/pubtorr.js',
    description: 'Публичные парсеры для поиска торрентов.',
    category: 'Торрент'
  },
  {
    name: 'Etor',
    url: 'http://cub.red/plugin/etor',
    description: 'Плагин для появления пунктов Парсер TorrServer в меню настроек для лампы из магазина. Актуально для телевизоров Samsung.',
    category: 'Торрент'
  },
  {
    name: 'Tracks',
    url: 'http://cub.red/plugin/tracks',
    description: 'Плагин для корректного отображения списка озвучек в торрентах.',
    category: 'Торрент'
  },
  {
    name: 'Online_Mod',
    url: 'https://nb557.github.io/plugins/online_mod.js',
    description: 'Онлайн',
    category: 'Онлайн'
  },
  {
    name: 'BWA Online',
    url: 'https://bwa.to/rc',
    description: 'Стабильный онлайн',
    category: 'Онлайн'
  },
  {
    name: '🇺🇦Online (безкоштовно)',
    url: 'http://lampaua.mooo.com/online.js',
    description: 'Онлайн українською мовою',
    category: 'Онлайн'
  },
  {
    name: '🇺🇦Free Bandera Online v2.0.0',
    url: 'https://lampame.github.io/main/bo.js',
    description: 'Спільнота t.me/mmssixxx',
    category: 'Онлайн'
  },
  {
    name: 'IPTV',
    url: 'https://plugin.rootu.top/tv.js',
    description: 'Плагин для просмотра своих плейлистов в Lampa.',
    category: 'IPTV'
  },
  {
    name: '🇺🇦TryzubTV',
    url: 'https://lampame.github.io/main/ttv.js',
    description: 'TryzubTV — новий плагін для Лампи, який додає українські ТВ‑канали у зручному каталозі. Спільнота t.me/mmssixxx',
    category: 'IPTV'
  }
];


