import React from 'react';
import {
	AbsoluteFill,
	Easing,
	Img,
	Interactive,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {OrnamentBand, Rosette} from '../components/Ornament';
import {HERO_IMG} from '../data';
import {body, clamp, display} from '../theme';

export type TourPromoProps = {
	city: string;
	venue: string;
	day: string;
	month: string;
	year: string;
	countdown: string;
	stop: number;
	total: number;
};

export const TOUR_DURATION = 120;
const outExpo = Easing.bezier(0.16, 1, 0.3, 1);

/** Цифры, прокручивающиеся как барабан игрового автомата */
const SlotDigits: React.FC<{value: string; size: number; startFrame: number}> = ({value, size, startFrame}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const lineH = size * 0.95;
	return (
		<div style={{display: 'flex'}}>
			{value.split('').map((ch, col) => {
				const digit = Number.isNaN(Number(ch)) ? -1 : Number(ch);
				const s = spring({frame: frame - startFrame - col * 5, fps, config: {damping: 16, stiffness: 60, mass: 1.1}});
				if (digit < 0) {
					// Не цифра («?») — мерцает
					return (
						<div key={col} style={{height: lineH, fontFamily: display, fontSize: size, lineHeight: `${lineH}px`, color: '#FF91AD', opacity: s * (0.6 + 0.4 * Math.abs(Math.sin(frame * 0.35 + col)))}}>
							{ch}
						</div>
					);
				}
				const stops = 20 + digit;
				return (
					<div key={col} style={{height: lineH, overflow: 'hidden'}}>
						<div style={{translate: `0px ${-s * stops * lineH}px`}}>
							{Array.from({length: stops + 1}).map((_, k) => (
								<div key={k} style={{height: lineH, fontFamily: display, fontSize: size, lineHeight: `${lineH}px`, color: '#FF91AD'}}>
									{k % 10}
								</div>
							))}
						</div>
					</div>
				);
			})}
		</div>
	);
};

export const TourPromo: React.FC<TourPromoProps> = ({city, venue, day, month, year, countdown, stop, total}) => {
	const frame = useCurrentFrame();
	const {fps, width, height} = useVideoConfig();
	const portrait = height > width;
	const unit = Math.min(width, height * 1.78);

	// Длинные названия переносим по дефису
	const cityLines = city.length > 10 && city.includes('-') ? [city.slice(0, city.indexOf('-') + 1), city.slice(city.indexOf('-') + 1)] : [city];
	const longest = Math.max(...cityLines.map((l) => l.length));
	const cityArea = portrait ? width * 0.86 : width * 0.54;
	const citySize = Math.min(cityArea / (longest * 0.86), height * (portrait ? 0.14 : 0.24));

	const typed = Math.floor(interpolate(frame, [38, 70], [0, venue.length], clamp));
	const cursorOn = frame < 78 ? Math.floor(frame / 4) % 2 === 0 : false;
	const pill = spring({frame: frame - 62, fps, config: {damping: 9, stiffness: 160}});
	let idx = 0;

	return (
		<AbsoluteFill style={{backgroundColor: '#000', overflow: 'hidden', fontFamily: body, color: '#F1EADF'}}>
			{/* Бордовая панель */}
			<AbsoluteFill
				style={{
					backgroundColor: '#4A0711',
					clipPath: `inset(0 ${interpolate(frame, [0, 18], [100, 0], {...clamp, easing: outExpo})}% 0 0)`,
				}}
			/>
			{/* Фото дуотоном */}
			<AbsoluteFill
				style={{
					left: portrait ? 0 : '45%',
					top: portrait ? '35%' : 0,
					opacity: interpolate(frame, [10, 40], [0, 0.35], clamp),
					mixBlendMode: 'luminosity',
					scale: String(interpolate(frame, [10, TOUR_DURATION], [1.2, 1.05], clamp)),
				}}
			>
				<Img src={HERO_IMG} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1) contrast(1.3)'}} />
			</AbsoluteFill>
			<AbsoluteFill style={{background: portrait ? 'linear-gradient(180deg, #4A0711 30%, rgba(74,7,17,0.2) 100%)' : 'linear-gradient(90deg, #4A0711 40%, rgba(74,7,17,0.2) 100%)'}} />

			{/* Розетка за датой */}
			<div
				style={{
					position: 'absolute',
					right: portrait ? -unit * 0.25 : -unit * 0.08,
					top: portrait ? -unit * 0.2 : unit * 0.02,
					opacity: 0.45,
				}}
			>
				<Rosette
					size={unit * (portrait ? 0.9 : 0.6)}
					progress={interpolate(frame, [8, 60], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)})}
					rotation={interpolate(frame, [0, TOUR_DURATION], [-30, 10], {...clamp, easing: outExpo})}
					color="#FF91AD"
				/>
			</div>

			{/* Номер остановки — это действительно последовательность тура */}
			<Interactive.Div
				name="Stop number"
				style={{
					position: 'absolute',
					left: '6%',
					top: '8%',
					fontSize: unit * 0.024,
					fontWeight: 700,
					letterSpacing: '0.04em',
					opacity: interpolate(frame, [12, 30], [0, 1], clamp),
					translate: interpolate(frame, [12, 34], ['-30px 0px', '0px 0px'], {...clamp, easing: outExpo}),
				}}
			>
				{String(stop).padStart(2, '0')} / {String(total).padStart(2, '0')} · 1st World Tour 2026
			</Interactive.Div>

			{/* Дата */}
			<div
				style={{
					position: 'absolute',
					right: portrait ? undefined : '6%',
					left: portrait ? '6%' : undefined,
					top: portrait ? '15%' : '8%',
					display: 'flex',
					flexDirection: 'column',
					alignItems: portrait ? 'flex-start' : 'flex-end',
				}}
			>
				<SlotDigits value={day} size={unit * (portrait ? 0.3 : 0.19)} startFrame={6} />
				<div
					style={{
						fontFamily: display,
						fontSize: unit * 0.045,
						marginTop: unit * 0.01,
						opacity: interpolate(frame, [30, 48], [0, 1], clamp),
						translate: `0px ${interpolate(frame, [30, 52], [30, 0], {...clamp, easing: outExpo})}px`,
					}}
				>
					{month}
				</div>
				<div
					style={{
						fontFamily: display,
						fontSize: unit * 0.045,
						color: 'transparent',
						WebkitTextStroke: '1.5px #FF91AD',
						opacity: interpolate(frame, [38, 56], [0, 1], clamp),
					}}
				>
					{year}
				</div>
			</div>

			{/* Город */}
			<div style={{position: 'absolute', left: '6%', bottom: portrait ? '24%' : '30%'}}>
				{cityLines.map((line, li) => (
					<div key={li} style={{display: 'flex', overflow: 'hidden', lineHeight: 1.02}}>
						{line.split('').map((ch) => {
							const i = idx++;
							const s = spring({frame: frame - 14 - i * 2, fps, config: {damping: 14, stiffness: 130}});
							return (
								<span
									key={i}
									style={{
										fontFamily: display,
										fontSize: citySize,
										display: 'inline-block',
										translate: `0px ${(1 - s) * citySize * 1.1}px`,
										rotate: `${(1 - s) * 12}deg`,
									}}
								>
									{ch}
								</span>
							);
						})}
					</div>
				))}
			</div>

			{/* Площадка: печатается */}
			<div
				style={{
					position: 'absolute',
					left: '6%',
					right: '6%',
					bottom: portrait ? '17%' : '20%',
					fontSize: unit * (portrait ? 0.034 : 0.028),
					fontWeight: 500,
				}}
			>
				{venue.slice(0, typed)}
				<span style={{opacity: cursorOn ? 1 : 0, color: '#FF91AD'}}>▌</span>
			</div>

			{/* Сколько осталось */}
			<div
				style={{
					position: 'absolute',
					left: '6%',
					bottom: portrait ? '9%' : '9%',
					backgroundColor: '#FF91AD',
					color: '#000',
					fontWeight: 900,
					fontSize: unit * 0.026,
					padding: `${unit * 0.008}px ${unit * 0.02}px`,
					borderRadius: 999,
					scale: String(pill),
					rotate: `${(1 - pill) * -12}deg`,
					transformOrigin: '0% 50%',
				}}
			>
				{countdown}
			</div>

			{/* Лента орнамента */}
			<div style={{position: 'absolute', left: 0, right: 0, bottom: unit * 0.012, opacity: 0.85}}>
				<OrnamentBand
					width={width}
					height={unit * 0.04}
					progress={interpolate(frame, [20, 90], [0, 1], clamp)}
					color="#FF91AD"
					offset={frame * 1.2}
				/>
			</div>
		</AbsoluteFill>
	);
};
