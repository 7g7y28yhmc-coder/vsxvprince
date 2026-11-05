import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {HornMotif, Rosette} from '../components/Ornament';
import {clamp, display} from '../theme';

// ---------- Переход между разделами (прозрачный фон, поверх сайта) ----------

export type PageWipeProps = {label: string};
export const WIPE_DURATION = 46;
/** Кадр, на котором экран полностью закрыт — в этот момент сайт прокручивается. */
export const WIPE_COVER_FRAME = 21;

const inOut = Easing.bezier(0.76, 0, 0.24, 1);

export const PageWipe: React.FC<PageWipeProps> = ({label}) => {
	const frame = useCurrentFrame();
	const {fps, width, height} = useVideoConfig();
	const unit = Math.min(width, height * 1.6);
	const panels = [
		{color: '#FF91AD', inAt: 0, outAt: 30},
		{color: '#C8102E', inAt: 3, outAt: 27},
		{color: '#000000', inAt: 6, outAt: 24},
	];
	const fontSize = Math.min((width * 0.8) / (label.length * 0.9), height * 0.22);

	return (
		<AbsoluteFill style={{overflow: 'hidden'}}>
			{panels.map((p) => {
				const enter = interpolate(frame, [p.inAt, p.inAt + 14], [110, 0], {...clamp, easing: inOut});
				const exit = interpolate(frame, [p.outAt, p.outAt + 14], [0, -110], {...clamp, easing: inOut});
				return (
					<AbsoluteFill
						key={p.color}
						style={{
							backgroundColor: p.color,
							translate: `0px ${enter + exit}%`,
							transform: `skewY(${interpolate(enter + exit, [-110, 0, 110], [-6, 0, 6])}deg)`,
						}}
					/>
				);
			})}
			<AbsoluteFill
				style={{
					justifyContent: 'center',
					alignItems: 'center',
					translate: `0px ${interpolate(frame, [24, 38], [0, -110], {...clamp, easing: inOut})}%`,
				}}
			>
				<Rosette
					size={unit * 0.55}
					progress={interpolate(frame, [8, 22], [0, 1], clamp)}
					rotation={frame * 2}
					color="#4A0711"
					style={{position: 'absolute'}}
				/>
				<div style={{display: 'flex', overflow: 'hidden'}}>
					{label.split('').map((ch, i) => {
						const s = spring({frame: frame - 9 - i * 1.5, fps, config: {damping: 14, stiffness: 200}});
						return (
							<span
								key={i}
								style={{
									fontFamily: display,
									fontSize,
									color: '#F1EADF',
									display: 'inline-block',
									whiteSpace: 'pre',
									translate: `0px ${(1 - s) * fontSize}px`,
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

// ---------- Вспышка в точке клика ----------

export const BURST_DURATION = 26;

export const ClickBurst: React.FC = () => {
	const frame = useCurrentFrame();
	const {width} = useVideoConfig();
	const p = interpolate(frame, [0, BURST_DURATION], [0, 1], {...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1)});
	const c = width / 2;
	return (
		<AbsoluteFill>
			<svg width={width} height={width} viewBox={`${-c} ${-c} ${width} ${width}`}>
				<circle r={c * 0.9 * p} fill="none" stroke="#FF91AD" strokeWidth={6 * (1 - p) + 0.5} opacity={1 - p} />
				<circle r={c * 0.6 * p} fill="none" stroke="#C8102E" strokeWidth={3 * (1 - p) + 0.5} opacity={1 - p} />
				{Array.from({length: 8}).map((_, i) => {
					const a = (i / 8) * Math.PI * 2;
					const r = c * (0.2 + p * 0.65);
					return (
						<path
							key={i}
							d="M0 -6 L4 0 L0 6 L-4 0Z"
							fill={i % 2 ? '#F1EADF' : '#FF91AD'}
							transform={`translate(${Math.cos(a) * r} ${Math.sin(a) * r}) rotate(${p * 180}) scale(${1.6 - p})`}
							opacity={1 - p}
						/>
					);
				})}
				<g transform={`scale(${0.25 + p * 0.25}) rotate(${p * 90})`} opacity={1 - p}>
					<HornMotif progress={Math.min(1, p * 2.5)} color="#FF91AD" strokeWidth={8} />
				</g>
			</svg>
		</AbsoluteFill>
	);
};
