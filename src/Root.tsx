import React from 'react';
import {Composition, Folder} from 'remotion';
import {HERO_DURATION, HeroIntro} from './compositions/HeroIntro';
import {MUSIC_LOOP, MusicPulse} from './compositions/MusicPulse';
import {PRODUCT_DURATION, ProductReveal} from './compositions/ProductReveal';
import {TOUR_DURATION, TourPromo} from './compositions/TourPromo';
import {BURST_DURATION, ClickBurst, PageWipe, WIPE_DURATION} from './compositions/Transitions';
import {MERCH} from './data';

// Те же композиции, что крутятся на сайте в <Player>, — их можно открыть в Studio
// (npm run studio) и отрендерить в mp4 для соцсетей.
export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Folder name="Site">
				<Composition
					id="HeroIntro"
					component={HeroIntro}
					durationInFrames={HERO_DURATION}
					fps={30}
					width={1920}
					height={1080}
					defaultProps={{burstFrame: -1000, burstX: 0.5, burstY: 0.5}}
				/>
				<Composition
					id="TourPromo"
					component={TourPromo}
					durationInFrames={TOUR_DURATION}
					fps={30}
					width={1920}
					height={1080}
					defaultProps={{
						city: 'Алматы',
						venue: 'Дворец спорта им. Балуана Шолака',
						day: '21',
						month: 'ноября',
						year: '2026',
						countdown: 'через 16 дней',
						stop: 3,
						total: 4,
					}}
				/>
				<Composition
					id="MerchReel"
					component={ProductReveal}
					durationInFrames={PRODUCT_DURATION}
					fps={30}
					width={1080}
					height={1350}
					defaultProps={{
						kind: 'Худи',
						name: '«VERNЫЙ»',
						specs: ['Оверсайз', 'Чёрный, белое лого', 'M, L, XL'],
						image: MERCH[2].image,
						bg: '#7A0C1C',
					}}
				/>
				<Composition
					id="MusicPulse"
					component={MusicPulse}
					durationInFrames={MUSIC_LOOP}
					fps={30}
					width={1920}
					height={640}
					defaultProps={{platform: 'Spotify', color: '#1ED760', changeFrame: 0}}
				/>
				<Composition id="PageWipe" component={PageWipe} durationInFrames={WIPE_DURATION} fps={30} width={1920} height={1080} defaultProps={{label: 'Мерч'}} />
				<Composition id="ClickBurst" component={ClickBurst} durationInFrames={BURST_DURATION} fps={30} width={240} height={240} />
			</Folder>
			<Folder name="Social">
				<Composition
					id="TourStory"
					component={TourPromo}
					durationInFrames={TOUR_DURATION}
					fps={30}
					width={1080}
					height={1920}
					defaultProps={{
						city: 'Актау',
						venue: 'BS Arena',
						day: '07',
						month: 'ноября',
						year: '2026',
						countdown: 'через 2 дня',
						stop: 1,
						total: 4,
					}}
				/>
			</Folder>
		</>
	);
};
