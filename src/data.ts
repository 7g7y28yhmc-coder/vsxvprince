// Контент взят с vsxvprince.com. Картинки подгружаются с оригинального сайта —
// для продакшена положите их в public/ и замените на staticFile().
const UP = 'https://vsxvprince.com/wp-content/uploads';

export const HERO_IMG = `${UP}/2026/01/1.jpg`; // фото артиста, 1920×1080
export const VERNYI_LOGO = `${UP}/2025/12/ChatGPT-Image-16-%D0%B4%D0%B5%D0%BA.-2025-%D0%B3.-23_02_50.png`;
export const TOUR_LOGO = `${UP}/2026/01/logo_wt_white-2.png`;

export type TourStop = {
	city: string;
	venue: string;
	date: string | null; // ISO, null = дата ещё не объявлена
	tickets: string | null;
};

export const TOUR: TourStop[] = [
	{city: 'Актау', venue: 'BS Arena', date: '2026-11-07', tickets: 'https://kino.kz/ru/concert/event/11404'},
	{city: 'Шымкент', venue: 'Спортивный комплекс по лёгкой атлетике', date: '2026-11-14', tickets: 'https://kino.kz/ru/concert/event/11013'},
	{city: 'Алматы', venue: 'Дворец спорта им. Балуана Шолака', date: '2026-11-21', tickets: 'https://kino.kz/ru/concert/event/11015'},
	{city: 'Усть-Каменогорск', venue: 'Площадка будет объявлена', date: null, tickets: null},
];

export type Product = {
	name: string;
	kind: string;
	specs: string[];
	image: string;
	bg: string;
	link: string;
};

export const MERCH: Product[] = [
	{
		name: 'VERNЫЙ «University»',
		kind: 'Футболка',
		specs: ['Хлопок 100%', 'Оверсайз', 'Белый'],
		image: `${UP}/elementor/thumbs/hf_20261007_121132_a64d8528-8df0-46ff-bebf-19a5abb809cb-ruienu1yc0ps59t8kcxnt18wtrl2lrxzv4zjqj4utc.png`,
		bg: '#1F3FD1',
		link: 'https://vsxvprince.com/product/futbolka-vernyi-university/',
	},
	{
		name: '«СУ»',
		kind: 'Футболка',
		specs: ['Оверсайз', 'Белый, чёрный', 'M, L, XL'],
		image: `${UP}/elementor/thumbs/ABS06058-rhpz2913r9upqx7fi66hrnbmg4bhtgma9imlc06bk0.jpg`,
		bg: '#B3122B',
		link: 'https://vsxvprince.com/product/futbolka-su-white/',
	},
	{
		name: '«VERNЫЙ»',
		kind: 'Худи',
		specs: ['Оверсайз', 'Чёрный, белое лого', 'M, L, XL'],
		image: `${UP}/elementor/thumbs/ABS06294-rhpz2913r9upqx7fi66hrnbmg4bhtgma9imlc06bk0.jpg`,
		bg: '#7A0C1C',
		link: 'https://vsxvprince.com/product/hudi-vernyi-white-print/',
	},
	{
		name: '«VERNЫЙ»',
		kind: 'Носки',
		specs: ['Белые, чёрное лого', '36–40, 41–44'],
		image: `${UP}/elementor/thumbs/ABS06380-rhpz2913r9upqx7fi66hrnbmg4bhtgma9imlc06bk0.jpg`,
		bg: '#4A0711',
		link: 'https://vsxvprince.com/product/socks-vernyi-white/',
	},
];

export const MUSIC = [
	{name: 'Spotify', color: '#1ED760', url: 'https://open.spotify.com/artist/43cTNOHTq4t7YzHyttQxNf'},
	{name: 'Apple Music', color: '#FA2D48', url: 'https://music.apple.com/kz/artist/v-%24-x-v-prince/1048627624'},
	{name: 'YouTube Music', color: '#FF0033', url: 'https://music.youtube.com/channel/UC7i9M_Hj68UnB4oeCL2rhRw'},
	{name: 'Яндекс Музыка', color: '#FFCC00', url: 'https://music.yandex.ru/artist/3971885'},
	{name: 'VK Музыка', color: '#0077FF', url: 'https://vk.com/artist/4418735602982876004'},
];

export const SOCIALS = [
	{name: 'Instagram', url: 'https://www.instagram.com/prince_vernyi'},
	{name: 'VK', url: 'https://vk.com/asxaprince'},
	{name: 'YouTube', url: 'https://www.youtube.com/@vsxvprincevernyi'},
	{name: 'Telegram', url: 'https://t.me/asxaprince'},
];

const MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

export const splitDate = (iso: string | null) => {
	if (!iso) return {day: '??', month: 'дата скоро', year: '2026'};
	const [y, m, d] = iso.split('-');
	return {day: d, month: MONTHS[Number(m) - 1], year: y};
};

const plural = (n: number, one: string, few: string, many: string) => {
	const m10 = n % 10;
	const m100 = n % 100;
	if (m10 === 1 && m100 !== 11) return one;
	if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
	return many;
};

export const countdown = (iso: string | null, now = new Date()) => {
	if (!iso) return 'скоро';
	const [y, m, d] = iso.split('-').map(Number);
	const target = new Date(y, m - 1, d);
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const days = Math.round((target.getTime() - today.getTime()) / 86400000);
	if (days < 0) return 'прошёл';
	if (days === 0) return 'сегодня';
	if (days === 1) return 'завтра';
	return `через ${days} ${plural(days, 'день', 'дня', 'дней')}`;
};
