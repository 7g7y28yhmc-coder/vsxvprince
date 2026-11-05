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
import {HornMotif} from '../components/Ornament';
import {body, clamp, display} from '../theme';

export type ProductRevealProps = {
	kind: string;
	name: string;
	specs: string[];
	image: string;
	bg: string;
};

export const PRODUCT_DURATION = 180;
const outExpo = Easing.bezier(0.16, 1, 0.3, 1);

export const ProductReveal: React.FC<ProductRevealProps> = ({kind, name, specs, image, bg}) => {
	const frame = useCurrentFrame();
	const {fps, width, height} = useVideoConfig();
	const unit = Math.min(width, height);
	const wipe = interpolate(frame, [8, 34], [0, 135], {...clamp, easing: Easing.bezier(0.7, 0, 0.2, 1)});
	const float = Math.sin((frame / PRODUCT_DURATION) * Math.PI * 2) * unit * 0.008;
	const title = `${kind} ${name}`;

	return (
		<AbsoluteFill style={{backgroundColor: '#000', overflow: 'hidden', fontFamily: body, color: '#F1EADF'}}>
			{/* Цветной фон раскрывается кругом */}
			<AbsoluteFill
				style={{
					backgroundColor: bg,
					clipPath: `circle(${interpolate(frame, [0, 26], [0, 95], {...clamp, easing: outExpo})}% at 50% 42%)`,
				}}
			/>

			{/* Контурный текст на фоне, медленно едет */}
			<AbsoluteFill style={{justifyContent: 'center', opacity: interpolate(frame, [10, 40], [0, 0.22], clamp)}}>
				{[0, 1, 2, 3, 4].map((row) => (
					<div
						key={row}
						style={{
							fontFamily: display,
							fontSize: unit * 0.2,
							lineHeight: 1,
							whiteSpace: 'nowrap',
							color: 'transparent',
							WebkitTextStroke: '2px #F1EADF',
							translate: `${(row % 2 ? -1 : 1) * (frame * 1.4) - unit * 0.6}px 0px`,
						}}
					>
						VERNЫЙ VERNЫЙ VERNЫЙ VERNЫЙ
					</div>
				))}
			</AbsoluteFill>

			{/* Фото товара: диагональная шторка */}
			<AbsoluteFill style={{alignItems: 'center', paddingTop: height * 0.08}}>
				<div
					style={{
						width: unit * 0.74,
						height: unit * 0.74,
						clipPath: `polygon(0% 0%, ${wipe}% 0%, ${wipe - 35}% 100%, 0% 100%)`,
						translate: `0px ${float}px`,
						rotate: `${interpolate(frame, [8, 50], [-5, 0], {...clamp, easing: outExpo})}deg`,
						boxShadow: '0 40px 80px rgba(0,0,0,0.45)',
						overflow: 'hidden',
					}}
				>
					<Img
						src={image}
						style={{
							width: '100%',
							height: '100%',
							objectFit: 'cover',
							scale: String(interpolate(frame, [8, 60], [1.35, 1], {...clamp, easing: outExpo})),
						}}
					/>
				</div>
			</AbsoluteFill>

			{/* Угловые мотивы */}
			<svg
				width={unit * 0.14}
				height={unit * 0.14}
				viewBox="-60 -60 120 120"
				style={{position: 'absolute', right: unit * 0.05, top: unit * 0.04, rotate: `${frame * 0.6}deg`}}
			>
				<HornMotif progress={interpolate(frame, [20, 60], [0, 1], clamp)} color="#F1EADF" strokeWidth={6} />
			</svg>

			{/* Название */}
			<div
				style={{
					position: 'absolute',
					left: unit * 0.07,
					right: unit * 0.07,
					bottom: height * 0.14,
					display: 'flex',
					flexWrap: 'wrap',
					columnGap: unit * 0.025,
					overflow: 'hidden',
				}}
			>
				{(() => {
					let i = 0;
					return title.split(' ').map((word, w) => (
						<span key={w} style={{display: 'inline-flex', whiteSpace: 'nowrap'}}>
							{word.split('').map((ch) => {
								const s = spring({frame: frame - 26 - i++ * 1.2, fps, config: {damping: 15, stiffness: 140}});
								return (
									<span
										key={i}
										style={{
											fontFamily: display,
											fontSize: unit * (title.length > 22 ? 0.06 : 0.075),
											lineHeight: 1.1,
											display: 'inline-block',
											translate: `0px ${(1 - s) * unit * 0.1}px`,
											opacity: s,
										}}
									>
										{ch}
									</span>
								);
							})}
						</span>
					));
				})()}
			</div>

			{/* Характеристики */}
			<div style={{position: 'absolute', left: unit * 0.07, bottom: height * 0.06, display: 'flex', gap: unit * 0.015, flexWrap: 'wrap'}}>
				{specs.map((spec, i) => {
					const s = spring({frame: frame - 46 - i * 5, fps, config: {damping: 12, stiffness: 160}});
					return (
						<div
							key={spec}
							style={{
								border: '2px solid #F1EADF',
								borderRadius: 999,
								padding: `${unit * 0.008}px ${unit * 0.022}px`,
								fontSize: unit * 0.026,
								fontWeight: 700,
								scale: String(s),
								opacity: s,
							}}
						>
							{spec}
						</div>
					);
				})}
			</div>

			<Interactive.Div
				name="Store tag"
				style={{
					position: 'absolute',
					left: unit * 0.07,
					top: unit * 0.05,
					fontSize: unit * 0.024,
					fontWeight: 700,
					opacity: interpolate(frame, [30, 50], [0, 1], clamp),
				}}
			>
				@vernyi_storree
			</Interactive.Div>
		</AbsoluteFill>
	);
};
