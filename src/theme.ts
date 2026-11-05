import {loadFont as loadDela} from '@remotion/google-fonts/DelaGothicOne';
import {loadFont as loadMontserrat} from '@remotion/google-fonts/Montserrat';

// Шрифты грузятся через Remotion — работают и в видео-рендере, и на сайте.
export const display = loadDela('normal', {
	weights: ['400'],
	subsets: ['latin', 'cyrillic'],
}).fontFamily;

export const body = loadMontserrat('normal', {
	weights: ['400', '500', '700', '900'],
	subsets: ['latin', 'cyrillic'],
}).fontFamily;

export const C = {
	black: '#000000',
	oxblood: '#4A0711',
	red: '#C8102E',
	rose: '#FF91AD',
	bone: '#F1EADF',
	ash: '#8C8682',
	cobalt: '#1F3FD1',
} as const;

export const clamp = {
	extrapolateLeft: 'clamp',
	extrapolateRight: 'clamp',
} as const;
