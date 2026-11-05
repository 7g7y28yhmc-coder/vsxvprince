import React from 'react';

// Мотив «қошқар мүйіз» (бараньи рога) — как на ковре из хиро-фото.
const HORN =
	'M 0 -6 C 0 -30 14 -46 32 -46 C 48 -46 56 -32 50 -20 C 45 -10 32 -12 32 -22 C 32 -28 38 -31 42 -27';
const QUADS: Array<[number, number]> = [
	[1, 1],
	[-1, 1],
	[1, -1],
	[-1, -1],
];

export const HornMotif: React.FC<{
	progress: number;
	color: string;
	strokeWidth?: number;
}> = ({progress, color, strokeWidth = 6}) => (
	<g fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
		{QUADS.map(([sx, sy]) => (
			<path
				key={`${sx}${sy}`}
				d={HORN}
				transform={`scale(${sx},${sy})`}
				pathLength={1}
				strokeDasharray={1}
				strokeDashoffset={1 - progress}
			/>
		))}
		<path d="M0 -12 L12 0 L0 12 L-12 0Z" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - progress} />
	</g>
);

/** Круглая розетка из 8 мотивов. Симметрия 45° — удобно для бесшовного вращения. */
export const Rosette: React.FC<{
	size: number;
	progress: number;
	rotation: number;
	color: string;
	style?: React.CSSProperties;
}> = ({size, progress, rotation, color, style}) => (
	<svg width={size} height={size} viewBox="-500 -500 1000 1000" style={style}>
		<g transform={`rotate(${rotation})`}>
			<circle r={470} fill="none" stroke={color} strokeWidth={3} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - progress} />
			<circle r={430} fill="none" stroke={color} strokeWidth={1.5} strokeDasharray="4 14" opacity={progress} />
			{Array.from({length: 8}).map((_, i) => (
				<g key={i} transform={`rotate(${i * 45}) translate(0 -330) scale(1.4)`}>
					<HornMotif progress={progress} color={color} strokeWidth={5} />
				</g>
			))}
			{Array.from({length: 16}).map((_, i) => (
				<g key={`d${i}`} transform={`rotate(${i * 22.5}) translate(0 -200)`} opacity={progress}>
					<path d="M0 -14 L10 0 L0 14 L-10 0Z" fill={color} />
				</g>
			))}
			<g transform="scale(2.4)">
				<HornMotif progress={progress} color={color} strokeWidth={4} />
			</g>
		</g>
	</svg>
);

/** Горизонтальная лента орнамента. */
export const OrnamentBand: React.FC<{
	width: number;
	height: number;
	progress: number;
	color: string;
	offset?: number;
}> = ({width, height, progress, color, offset = 0}) => {
	const step = height * 1.6;
	const count = Math.ceil(width / step) + 2;
	return (
		<svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{display: 'block'}}>
			<line x1={0} x2={width * progress} y1={2} y2={2} stroke={color} strokeWidth={2} />
			<line x1={width} x2={width * (1 - progress)} y1={height - 2} y2={height - 2} stroke={color} strokeWidth={2} />
			{Array.from({length: count}).map((_, i) => (
				<g key={i} transform={`translate(${i * step - (offset % step)} ${height / 2}) scale(${height / 140})`}>
					<HornMotif progress={Math.min(1, Math.max(0, progress * 1.6 - i * 0.04))} color={color} strokeWidth={7} />
				</g>
			))}
		</svg>
	);
};
