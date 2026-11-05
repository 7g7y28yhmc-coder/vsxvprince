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
import {Rosette} from '../components/Ornament';
import {HERO_IMG, TOUR_LOGO} from '../data';
import {body, clamp, display} from '../theme';

export type HeroProps = {
	/** Кадр, на котором был клик (−1000 = клика не было) */
	burstFrame: number;
	/** Точка клика, 0..1 */
	burstX: number;
	burstY: number;
};

/** После интро плеер прыгает сюда и крутит бесшовную петлю длиной LOOP. */
export const HERO_LOOP_START = 120;
export const HERO_LOOP = 180;
export const HERO_DURATION = HERO_LOOP_START + HERO_LOOP;

const TAU = Math.PI * 2;
const outExpo = Easing.bezier(0.16, 1, 0.3, 1);
const MARQUEE = 'АКТАУ 07.11 ✦ ШЫМКЕНТ 14.11 ✦ АЛМАТЫ 21.11 ✦ УСТЬ-КАМЕНОГОРСК — SOON ✦ 1ST WORLD TOUR 2026 ✦ ';

export const HeroIntro: React.FC<HeroProps> = ({burstFrame, burstX, burstY}) => {
	const frame = useCurrentFrame();
	const {fps, width, height} = useVideoConfig();
	const portrait = height > width * 1.05;
	const unit = Math.min(width, height * 1.7);

	// Фаза бесшовной петли 0..1
	const t = frame - HERO_LOOP_START;
	const phase = (((t % HERO_LOOP) + HERO_LOOP) % HERO_LOOP) / HERO_LOOP;

	// Реакция на клик
	const b = frame - burstFrame;
	const bursting = b >= 0 && b < 40;
	const shake = bursting ? interpolate(b, [0, 3, 26], [0, 1, 0], clamp) : 0;

	const split =
		interpolate(frame, [26, 80], [46, 3], {...clamp, easing: outExpo}) +
		Math.sin(phase * TAU * 3) * 2 +
		shake * 34;

	const lines = portrait ? ['VSXV', 'PRINCE'] : ['VSXVPRINCE'];
	const fontSize = portrait ? width * 0.175 : width * 0.098;
	let globalIndex = 0;

	const renderName = (color: string, dx: number, blend?: React.CSSProperties['mixBlendMode']) => {
		globalIndex = 0;
		return (
			<div
				style={{
					position: 'absolute',
					inset: 0,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					translate: `${dx}px 0px`,
					mixBlendMode: blend,
				}}
			>
				{lines.map((line) => (
					<div key={line} style={{display: 'flex', lineHeight: 0.92}}>
						{line.split('').map((ch) => {
							const i = globalIndex++;
							const start = 26 + i * 3;
							const s = spring({frame: frame - start, fps, config: {damping: 11, stiffness: 140, mass: 0.9}});
							const land = interpolate(frame - start, [7, 10, 18], [1, 0.82, 1], clamp);
							const breathe = Math.sin(phase * TAU * 2 + i * 0.7) * unit * 0.004;
							const jx = Math.sin(i * 12.9898 + b * 1.7) * shake * unit * 0.018;
							const jy = Math.cos(i * 78.233 + b * 1.3) * shake * unit * 0.018;
							return (
								<span
									key={i}
									style={{
										fontFamily: display,
										fontSize,
										color,
										display: 'inline-block',
										translate: `${jx}px ${(1 - s) * -height * 0.7 + breathe + jy}px`,
										rotate: `${(1 - s) * (i % 2 ? -28 : 28)}deg`,
										scale: `${1 + (1 - land) * 0.25} ${land}`,
										transformOrigin: '50% 100%',
										opacity: frame >= start ? 1 : 0,
									}}
								>
									{ch}
								</span>
							);
						})}
					</div>
				))}
			</div>
		);
	};

	const flash =
		interpolate(frame, [28, 30, 44], [0, 0.22, 0], clamp) + (bursting ? interpolate(b, [0, 2, 12], [0, 0.28, 0], clamp) : 0);

	return (
		<AbsoluteFill style={{backgroundColor: '#000', overflow: 'hidden', fontFamily: body}}>
			{/* Фото артиста */}
			<AbsoluteFill
				style={{
					opacity: interpolate(frame, [14, 60], [0, 0.62], clamp),
					scale: String(
						interpolate(frame, [14, HERO_LOOP_START], [1.28, 1.08], {...clamp, easing: outExpo}) +
							Math.sin(phase * TAU) * 0.012 +
							shake * 0.02,
					),
					filter: `blur(${interpolate(frame, [14, 60], [26, 0], clamp)}px) grayscale(0.35) contrast(1.12)`,
				}}
			>
				<Img src={HERO_IMG} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 30%'}} />
			</AbsoluteFill>

			{/* Розетка-орнамент */}
			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', mixBlendMode: 'screen'}}>
				<Rosette
					size={unit * (portrait ? 1.25 : 0.95)}
					progress={interpolate(frame, [6, 70], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)})}
					rotation={phase * 45 + shake * 6}
					color="#FF91AD"
					style={{opacity: 0.32 + shake * 0.4}}
				/>
			</AbsoluteFill>

			{/* Затемнения */}
			<AbsoluteFill
				style={{
					background:
						'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.92) 100%), linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 60%, #000 100%)',
				}}
			/>

			{/* Красная черта */}
			<Interactive.Div
				name="Slash"
				style={{
					position: 'absolute',
					left: '8%',
					right: '8%',
					top: '50%',
					height: 4,
					backgroundColor: '#C8102E',
					transformOrigin: '0% 50%',
					scale: `${interpolate(frame, [0, 20], [0, 1], {...clamp, easing: outExpo})} 1`,
					opacity: interpolate(frame, [20, 40], [1, 0], clamp),
				}}
			/>

			{/* Имя с RGB-сдвигом */}
			<AbsoluteFill style={{translate: `0px ${portrait ? -height * 0.1 : -unit * 0.04}px`}}>
				{renderName('#C8102E', split, 'screen')}
				{renderName('#FF91AD', -split, 'screen')}
				{renderName('#F1EADF', 0)}
			</AbsoluteFill>

			{/* Логотип тура */}
			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
				<Interactive.Div
					name="Tour logo"
					style={{
						marginBottom: portrait ? height * 0.5 : unit * 0.3,
						opacity: interpolate(frame, [70, 96], [0, 1], clamp),
						translate: interpolate(frame, [70, 100], ['0px 40px', '0px 0px'], {...clamp, easing: outExpo}),
					}}
				>
					<Img src={TOUR_LOGO} style={{width: unit * (portrait ? 0.5 : 0.24)}} />
				</Interactive.Div>
			</AbsoluteFill>

			{/* Бегущая строка с датами */}
			<div
				style={{
					position: 'absolute',
					left: '-5%',
					right: '-5%',
					bottom: portrait ? '9%' : '7%',
					rotate: '-2deg',
					backgroundColor: '#FF91AD',
					overflow: 'hidden',
					translate: `0px ${interpolate(frame, [84, 110], [unit * 0.3, 0], {...clamp, easing: outExpo})}px`,
				}}
			>
				<div
					style={{
						display: 'flex',
						width: 'max-content',
						translate: `${-phase * 50}% 0px`,
						padding: `${unit * 0.008}px 0`,
					}}
				>
					{[0, 1].map((k) => (
						<span
							key={k}
							style={{
								fontFamily: display,
								fontSize: unit * (portrait ? 0.045 : 0.022),
								color: '#000',
								whiteSpace: 'pre',
							}}
						>
							{MARQUEE + MARQUEE}
						</span>
					))}
				</div>
			</div>

			{/* Ударная волна от клика */}
			{bursting
				? [0, 5, 10].map((delay) => {
						const p = interpolate(b - delay, [0, 26], [0, 1], {...clamp, easing: outExpo});
						return (
							<div
								key={delay}
								style={{
									position: 'absolute',
									left: burstX * width,
									top: burstY * height,
									width: unit * 0.9,
									height: unit * 0.9,
									marginLeft: -unit * 0.45,
									marginTop: -unit * 0.45,
									borderRadius: '50%',
									border: `${Math.max(1, 10 * (1 - p))}px solid ${delay === 5 ? '#C8102E' : '#FF91AD'}`,
									scale: String(p),
									opacity: b - delay < 0 ? 0 : 1 - p,
								}}
							/>
						);
					})
				: null}
			{bursting
				? Array.from({length: 14}).map((_, i) => {
						const a = (i / 14) * TAU + 0.3;
						const p = interpolate(b, [0, 30], [0, 1], {...clamp, easing: outExpo});
						const r = unit * (0.08 + p * (0.3 + (i % 3) * 0.08));
						return (
							<div
								key={`s${i}`}
								style={{
									position: 'absolute',
									left: burstX * width + Math.cos(a) * r,
									top: burstY * height + Math.sin(a) * r,
									width: unit * 0.014,
									height: unit * 0.014,
									backgroundColor: i % 2 ? '#FF91AD' : '#F1EADF',
									rotate: `${45 + p * 180}deg`,
									opacity: 1 - p,
								}}
							/>
						);
					})
				: null}

			{/* Вспышка + зерно */}
			<AbsoluteFill style={{backgroundColor: '#fff', opacity: flash, pointerEvents: 'none'}} />
			<AbsoluteFill style={{opacity: 0.09, mixBlendMode: 'overlay', translate: `${(frame % 3) * 7}px ${(frame % 5) * 5}px`}}>
				<svg width="100%" height="100%">
					<filter id="grain">
						<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
					</filter>
					<rect width="100%" height="100%" filter="url(#grain)" />
				</svg>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
