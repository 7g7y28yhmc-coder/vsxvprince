import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Rosette} from '../components/Ornament';
import {body, clamp, display} from '../theme';

export type MusicPulseProps = {
	platform: string;
	color: string;
	/** Кадр смены платформы (−1000 = без анимации смены) */
	changeFrame: number;
};

export const MUSIC_LOOP = 180;
const TAU = Math.PI * 2;

export const MusicPulse: React.FC<MusicPulseProps> = ({platform, color, changeFrame}) => {
	const frame = useCurrentFrame();
	const {fps, width, height} = useVideoConfig();
	const ph = (frame % MUSIC_LOOP) / MUSIC_LOOP; // бесшовная петля
	const bars = width > height * 2 ? 72 : 40;
	const barW = width / bars;
	const d = frame - changeFrame;
	const changing = d >= 0 && d < 75;
	const kick = changing ? interpolate(d, [0, 3, 30], [0, 1, 0], clamp) : 0;
	// «Бас»: 4 удара за петлю
	const beat = Math.pow(Math.max(0, Math.cos(ph * TAU * 4)), 8);
	const unit = Math.min(width, height * 2.4);
	const fontSize = Math.min((width * 0.82) / (platform.length * 0.82), height * 0.3);

	return (
		<AbsoluteFill style={{backgroundColor: '#000', overflow: 'hidden', fontFamily: body}}>
			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: 0.25 + beat * 0.15}}>
				<Rosette size={unit * 0.62 * (1 + beat * 0.04 + kick * 0.1)} progress={1} rotation={ph * 45} color={color} />
			</AbsoluteFill>

			{/* Эквалайзер, зеркальный от центра */}
			<AbsoluteFill>
				{Array.from({length: bars}).map((_, i) => {
					const x = i / bars;
					const v =
						0.35 +
						0.25 * Math.sin(ph * TAU * 3 + i * 0.45) +
						0.2 * Math.sin(ph * TAU * 5 - i * 0.23) +
						0.2 * Math.sin(ph * TAU * 2 + x * 9) * Math.cos(ph * TAU * 1 + i);
					const center = 1 - Math.abs(x - 0.5) * 1.4;
					const h = Math.max(0.03, Math.abs(v) * center * (0.75 + beat * 0.35 + kick * 0.5)) * height * 0.42;
					return (
						<div
							key={i}
							style={{
								position: 'absolute',
								left: i * barW + barW * 0.18,
								width: barW * 0.64,
								top: height / 2 - h,
								height: h * 2,
								borderRadius: barW,
								background: `linear-gradient(180deg, ${color} 0%, #FF91AD 50%, ${color} 100%)`,
								opacity: 0.55 + center * 0.4,
							}}
						/>
					);
				})}
			</AbsoluteFill>

			{/* Название платформы */}
			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textShadow: '0 0 30px #000, 0 0 60px #000, 0 6px 0 #000'}}>
				<div style={{display: 'flex'}}>
					{platform.split('').map((ch, i) => {
						const s = changing ? spring({frame: d - i * 1.3, fps, config: {damping: 13, stiffness: 180}}) : 1;
						return (
							<span
								key={i}
								style={{
									fontFamily: display,
									fontSize,
									color: '#F1EADF',
									display: 'inline-block',
									whiteSpace: 'pre',
									translate: `0px ${(1 - s) * fontSize * 0.8}px`,
									rotate: `${(1 - s) * -20}deg`,
									opacity: s,
									scale: String(1 + beat * 0.03),
								}}
							>
								{ch}
							</span>
						);
					})}
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
