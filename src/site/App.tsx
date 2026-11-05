import {Player, type PlayerRef} from '@remotion/player';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {HERO_DURATION, HERO_LOOP_START, HeroIntro} from '../compositions/HeroIntro';
import {MUSIC_LOOP, MusicPulse} from '../compositions/MusicPulse';
import {PRODUCT_DURATION, ProductReveal} from '../compositions/ProductReveal';
import {TOUR_DURATION, TourPromo} from '../compositions/TourPromo';
import {BURST_DURATION, ClickBurst, PageWipe, WIPE_COVER_FRAME, WIPE_DURATION} from '../compositions/Transitions';
import {MERCH, MUSIC, SOCIALS, TOUR, countdown, splitDate} from '../data';
import {useElementSize, useInView, useMedia, useReducedMotion, useWindowSize} from './hooks';

type Go = (target: string, label: string) => void;

const NAV = [
	{id: 'tour', label: 'Тур'},
	{id: 'merch', label: 'Мерч'},
	{id: 'music', label: 'Музыка'},
	{id: 'contacts', label: 'Контакты'},
];

const common = {fps: 30, acknowledgeRemotionLicense: true} as const;

// ---------------------------------------------------------------------------

const Header: React.FC<{go: Go}> = ({go}) => {
	const [solid, setSolid] = useState(false);
	useEffect(() => {
		const on = () => setSolid(window.scrollY > 40);
		on();
		window.addEventListener('scroll', on, {passive: true});
		return () => window.removeEventListener('scroll', on);
	}, []);
	return (
		<header className={`header ${solid ? 'is-solid' : ''}`}>
			<button className="wordmark" onClick={() => go('top', 'VSXVPRINCE')} aria-label="Наверх">
				VERNЫЙ
			</button>
			<nav className="nav" aria-label="Разделы">
				{NAV.map((n) => (
					<button key={n.id} onClick={() => go(n.id, n.label)}>
						{n.label}
					</button>
				))}
			</nav>
		</header>
	);
};

// ---------------------------------------------------------------------------

const Hero: React.FC<{go: Go}> = ({go}) => {
	const [wrapRef, size] = useElementSize<HTMLDivElement>();
	const player = useRef<PlayerRef>(null);
	const reduced = useReducedMotion();
	const [burst, setBurst] = useState({burstFrame: -1000, burstX: 0.5, burstY: 0.5});
	const ready = size.w > 0 && size.h > 0;
	const next = TOUR.find((s) => s.date && countdown(s.date) !== 'прошёл') ?? TOUR[0];
	const nd = splitDate(next.date);

	// После интро — бесконечная бесшовная петля
	useEffect(() => {
		const p = player.current;
		if (!p) return;
		const onEnd = () => {
			p.seekTo(HERO_LOOP_START);
			p.play();
		};
		p.addEventListener('ended', onEnd);
		return () => p.removeEventListener('ended', onEnd);
	}, [ready]);

	const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
		if (reduced || (e.target as HTMLElement).closest('a,button')) return;
		const r = e.currentTarget.getBoundingClientRect();
		setBurst({
			burstFrame: player.current?.getCurrentFrame() ?? 0,
			burstX: (e.clientX - r.left) / r.width,
			burstY: (e.clientY - r.top) / r.height,
		});
	};

	return (
		<section id="top" className="hero" ref={wrapRef} onPointerDown={onPointerDown} data-noburst>
			{ready ? (
				<Player
					ref={player}
					component={HeroIntro}
					inputProps={burst}
					durationInFrames={HERO_DURATION}
					compositionWidth={size.w}
					compositionHeight={size.h}
					initialFrame={reduced ? 150 : 0}
					autoPlay={!reduced}
					clickToPlay={false}
					doubleClickToFullscreen={false}
					spaceKeyToPlayOrPause={false}
					style={{width: '100%', height: '100%'}}
					{...common}
				/>
			) : null}
			<h1 className="sr-only">VSXVPRINCE — 1st World Tour 2026</h1>
			<div className="hero-cta">
				<p className="hero-next">
					<span className="hero-next-city">
						{next.city}, {Number(nd.day)} {nd.month}
					</span>
					<span>{next.venue}</span>
				</p>
				<div className="row">
					{next.tickets ? (
						<a className="btn" href={next.tickets} target="_blank" rel="noopener">
							Купить билеты
						</a>
					) : null}
					<button className="btn btn-ghost" onClick={() => go('tour', 'Тур')}>
						Все даты тура
					</button>
				</div>
			</div>
			<p className="hero-hint" aria-hidden>
				Кликни по экрану
			</p>
		</section>
	);
};

// ---------------------------------------------------------------------------

const Tour: React.FC = () => {
	const [sel, setSel] = useState(0);
	const player = useRef<PlayerRef>(null);
	const mobile = useMedia('(max-width: 760px)');
	const reduced = useReducedMotion();
	const [sectionRef, inView] = useInView<HTMLElement>(0.3);
	const started = useRef(false);
	const stop = TOUR[sel];
	const d = splitDate(stop.date);

	useEffect(() => {
		if (inView && !started.current && !reduced) {
			started.current = true;
			player.current?.play();
		}
	}, [inView, reduced]);

	const pick = (i: number) => {
		setSel(i);
		requestAnimationFrame(() => {
			if (reduced) {
				player.current?.seekTo(TOUR_DURATION - 1);
				return;
			}
			player.current?.seekTo(0);
			player.current?.play();
		});
	};

	return (
		<section id="tour" className="section" ref={sectionRef}>
			<h2 className="h2">1st World Tour 2026</h2>
			<div className="tour-grid">
				<div className="stage">
					<Player
						ref={player}
						component={TourPromo}
						inputProps={{
							city: stop.city,
							venue: stop.venue,
							day: d.day,
							month: d.month,
							year: d.year,
							countdown: countdown(stop.date),
							stop: sel + 1,
							total: TOUR.length,
						}}
						durationInFrames={TOUR_DURATION}
						compositionWidth={mobile ? 1080 : 1920}
						compositionHeight={mobile ? 1350 : 1080}
						initialFrame={reduced ? TOUR_DURATION - 1 : 0}
						clickToPlay={false}
						style={{width: '100%', aspectRatio: mobile ? '4 / 5' : '16 / 9'}}
						{...common}
					/>
					<div className="stage-bar">
						{stop.tickets ? (
							<a className="btn" href={stop.tickets} target="_blank" rel="noopener">
								Купить билеты: {stop.city}
							</a>
						) : (
							<span className="muted">Дата и продажа билетов появятся позже</span>
						)}
					</div>
				</div>
				<ol className="stops">
					{TOUR.map((s, i) => {
						const sd = splitDate(s.date);
						return (
							<li key={s.city}>
								<button className={`stop ${i === sel ? 'is-active' : ''}`} onClick={() => pick(i)} aria-pressed={i === sel}>
									<span className="stop-n">{String(i + 1).padStart(2, '0')}</span>
									<span className="stop-city">{s.city}</span>
									<span className="stop-meta">
										{s.date ? `${Number(sd.day)} ${sd.month} · ${countdown(s.date)}` : 'Дата скоро'}
									</span>
								</button>
							</li>
						);
					})}
				</ol>
			</div>
		</section>
	);
};

// ---------------------------------------------------------------------------

const Merch: React.FC = () => {
	const [sel, setSel] = useState(2);
	const player = useRef<PlayerRef>(null);
	const reduced = useReducedMotion();
	const [sectionRef, inView] = useInView<HTMLElement>(0.3);
	const p = MERCH[sel];

	useEffect(() => {
		if (reduced) return;
		if (inView) player.current?.play();
		else player.current?.pause();
	}, [inView, reduced]);

	const pick = (i: number) => {
		setSel(i);
		requestAnimationFrame(() => {
			player.current?.seekTo(reduced ? 90 : 0);
			if (!reduced) player.current?.play();
		});
	};

	return (
		<section id="merch" className="section merch" ref={sectionRef}>
			<h2 className="h2">Мерч</h2>
			<div className="merch-grid">
				<div className="merch-stage">
					<Player
						ref={player}
						component={ProductReveal}
						inputProps={{kind: p.kind, name: p.name, specs: p.specs, image: p.image, bg: p.bg}}
						durationInFrames={PRODUCT_DURATION}
						compositionWidth={1080}
						compositionHeight={1350}
						initialFrame={reduced ? 90 : 0}
						loop
						clickToPlay={false}
						style={{width: '100%', aspectRatio: '4 / 5'}}
						{...common}
					/>
				</div>
				<div className="merch-side">
					<ul className="products">
						{MERCH.map((m, i) => (
							<li key={m.link}>
								<button className={`product ${i === sel ? 'is-active' : ''}`} onClick={() => pick(i)} aria-pressed={i === sel}>
									<img src={m.image} alt="" loading="lazy" />
									<span>
										<span className="product-kind">{m.kind}</span>
										<span className="product-name">{m.name}</span>
									</span>
								</button>
							</li>
						))}
					</ul>
					<div className="product-detail">
						<p className="product-title">
							{p.kind} {p.name}
						</p>
						<p className="muted">{p.specs.join(', ')}</p>
						<div className="row">
							<a className="btn" href={p.link} target="_blank" rel="noopener">
								Купить
							</a>
							<a className="btn btn-ghost" href="https://vsxvprince.com/shop/" target="_blank" rel="noopener">
								Весь мерч
							</a>
						</div>
						<p className="muted small">
							Новинки и наличие —{' '}
							<a className="link" href="https://www.instagram.com/vernyi_storree" target="_blank" rel="noopener">
								@vernyi_storree
							</a>
						</p>
					</div>
				</div>
			</div>
		</section>
	);
};

// ---------------------------------------------------------------------------

const Music: React.FC = () => {
	const player = useRef<PlayerRef>(null);
	const mobile = useMedia('(max-width: 760px)');
	const reduced = useReducedMotion();
	const [sectionRef, inView] = useInView<HTMLElement>(0.2);
	const [state, setState] = useState({platform: MUSIC[0].name, color: MUSIC[0].color, changeFrame: -1000});
	const timer = useRef<number | undefined>(undefined);

	useEffect(() => {
		if (reduced) return;
		if (inView) player.current?.play();
		else player.current?.pause();
	}, [inView, reduced]);

	const focus = (i: number) => {
		const m = MUSIC[i];
		if (m.name === state.platform) return;
		setState({platform: m.name, color: m.color, changeFrame: reduced ? -1000 : player.current?.getCurrentFrame() ?? 0});
		window.clearTimeout(timer.current);
		timer.current = window.setTimeout(() => setState((s) => ({...s, changeFrame: -1000})), 2600);
	};

	return (
		<section id="music" className="section" ref={sectionRef}>
			<h2 className="h2">Музыка</h2>
			<div className="music-stage">
				<Player
					ref={player}
					component={MusicPulse}
					inputProps={state}
					durationInFrames={MUSIC_LOOP}
					compositionWidth={mobile ? 1080 : 1920}
					compositionHeight={mobile ? 720 : 640}
					loop
					clickToPlay={false}
					style={{width: '100%', aspectRatio: mobile ? '3 / 2' : '3 / 1'}}
					{...common}
				/>
			</div>
			<ul className="platforms">
				{MUSIC.map((m, i) => (
					<li key={m.name}>
						<a
							className={`platform ${m.name === state.platform ? 'is-active' : ''}`}
							href={m.url}
							target="_blank"
							rel="noopener"
							onPointerEnter={() => focus(i)}
							onFocus={() => focus(i)}
							style={{'--c': m.color} as React.CSSProperties}
						>
							Слушать в {m.name}
						</a>
					</li>
				))}
			</ul>
		</section>
	);
};

// ---------------------------------------------------------------------------

const Footer: React.FC<{go: Go}> = ({go}) => (
	<footer id="contacts" className="footer">
		<p className="footer-mark">VERNЫЙ</p>
		<div className="footer-cols">
			<div>
				<p className="footer-h">Соцсети</p>
				<ul>
					{SOCIALS.map((s) => (
						<li key={s.name}>
							<a className="link" href={s.url} target="_blank" rel="noopener">
								{s.name}
							</a>
						</li>
					))}
				</ul>
			</div>
			<div>
				<p className="footer-h">Сайт</p>
				<ul>
					{NAV.slice(0, 3).map((n) => (
						<li key={n.id}>
							<button className="link" onClick={() => go(n.id, n.label)}>
								{n.label}
							</button>
						</li>
					))}
					<li>
						<a className="link" href="https://vsxvprince.com/clips/" target="_blank" rel="noopener">
							Клипы
						</a>
					</li>
				</ul>
			</div>
			<div>
				<p className="footer-h">Концерты и сотрудничество</p>
				<ul>
					<li>
						<a className="link" href="https://vsxvprince.com/contact/" target="_blank" rel="noopener">
							Написать менеджеру
						</a>
					</li>
					<li>
						<a className="link" href="https://vsxvprince.com/privacy-policy/" target="_blank" rel="noopener">
							Политика конфиденциальности
						</a>
					</li>
					<li>
						<a className="link" href="https://vsxvprince.com/oferta/" target="_blank" rel="noopener">
							Оферта
						</a>
					</li>
				</ul>
			</div>
		</div>
		<p className="muted small">© 2026 VSXVPRINCE. Анимации сделаны на Remotion.</p>
	</footer>
);

// ---------------------------------------------------------------------------

/** Переход между разделами — Remotion-плеер поверх страницы */
const WipeOverlay: React.FC<{wipe: {target: string; label: string; key: number} | null; onDone: () => void}> = ({wipe, onDone}) => {
	const player = useRef<PlayerRef>(null);
	const {w, h} = useWindowSize();

	useEffect(() => {
		const p = player.current;
		if (!wipe || !p) return;
		let scrolled = false;
		const onFrame = (e: {detail: {frame: number}}) => {
			if (!scrolled && e.detail.frame >= WIPE_COVER_FRAME) {
				scrolled = true;
				const el = document.getElementById(wipe.target);
				window.scrollTo({top: el ? el.offsetTop : 0, behavior: 'instant'});
			}
		};
		const onEnd = () => onDone();
		p.addEventListener('frameupdate', onFrame);
		p.addEventListener('ended', onEnd);
		p.seekTo(0);
		p.play();
		return () => {
			p.removeEventListener('frameupdate', onFrame);
			p.removeEventListener('ended', onEnd);
		};
	}, [wipe, onDone]);

	return (
		<div className={`wipe ${wipe ? 'is-on' : ''}`} aria-hidden>
			<Player
				ref={player}
				component={PageWipe}
				inputProps={{label: wipe?.label ?? ''}}
				durationInFrames={WIPE_DURATION}
				compositionWidth={Math.max(320, w)}
				compositionHeight={Math.max(320, h)}
				clickToPlay={false}
				style={{width: '100%', height: '100%'}}
				{...common}
			/>
		</div>
	);
};

/** Вспышка в месте любого клика — тоже композиция Remotion */
let burstId = 0;
const ClickBursts: React.FC = () => {
	const reduced = useReducedMotion();
	const [bursts, setBursts] = useState<{id: number; x: number; y: number}[]>([]);
	useEffect(() => {
		if (reduced) return;
		const on = (e: PointerEvent) => {
			if ((e.target as HTMLElement).closest('[data-noburst]')) return;
			const id = ++burstId;
			setBursts((b) => [...b.slice(-5), {id, x: e.clientX, y: e.clientY}]);
			window.setTimeout(() => setBursts((b) => b.filter((x) => x.id !== id)), 1000);
		};
		window.addEventListener('pointerdown', on);
		return () => window.removeEventListener('pointerdown', on);
	}, [reduced]);
	return (
		<>
			{bursts.map((b) => (
				<div key={b.id} className="burst" style={{left: b.x - 120, top: b.y - 120}} aria-hidden>
					<Player
						component={ClickBurst}
						durationInFrames={BURST_DURATION}
						compositionWidth={240}
						compositionHeight={240}
						autoPlay
						style={{width: 240, height: 240}}
						{...common}
					/>
				</div>
			))}
		</>
	);
};

// ---------------------------------------------------------------------------

export const App: React.FC = () => {
	const reduced = useReducedMotion();
	const [wipe, setWipe] = useState<{target: string; label: string; key: number} | null>(null);

	const go = useCallback<Go>(
		(target, label) => {
			if (reduced) {
				document.getElementById(target)?.scrollIntoView();
				return;
			}
			setWipe({target, label, key: Date.now()});
		},
		[reduced],
	);
	const done = useCallback(() => setWipe(null), []);

	return (
		<>
			<Header go={go} />
			<main>
				<Hero go={go} />
				<Tour />
				<Merch />
				<Music />
			</main>
			<Footer go={go} />
			<WipeOverlay wipe={wipe} onDone={done} />
			<ClickBursts />
		</>
	);
};
