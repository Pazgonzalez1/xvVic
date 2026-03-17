import { useEffect, useState, useRef, useCallback } from "react";

/* ─── Sparkles Component ─── */
const Sparkles = ({ count = 8 }: { count?: number }) => {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: `${Math.random() * 4}s`,
    duration: `${3 + Math.random() * 3}s`,
    size: Math.random() > 0.7 ? "sparkle sparkle-lg" : "sparkle",
  }));

  return (
    <>
      {particles.map((p) => (
        <div
          key={p.id}
          className={p.size}
          style={{
            left: p.left,
            top: p.top,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </>
  );
};

/* ─── Decorative Line ─── */
const DecoLine = ({ wide = false }: { wide?: boolean }) => (
  <div className={`deco-line ${wide ? "deco-line-wide" : ""} my-6`} />
);

/* ─── Photo Section ─── */
const PhotoSection = ({ index }: { index: number }) => (
  <div className="photo-section scroll-reveal">
    <img
      src={`/placeholder.svg`}
      alt={`Foto ${index} de Vicky`}
      className="bg-champagne"
      style={{ objectFit: "cover" }}
    />
    {/* Reemplazar src con la foto real, ej: src="/foto1.jpg" */}
  </div>
);

/* ─── Countdown Hook ─── */
const useCountdown = (targetDate: Date) => {
  const calcTimeLeft = useCallback(() => {
    const diff = targetDate.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState(calcTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calcTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [calcTimeLeft]);

  return timeLeft;
};

/* ─── Scroll Reveal Hook ─── */
const useScrollReveal = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll(".scroll-reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
};

/* ─── Music Player ─── */
const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Cambiar la URL del src por tu canción mp3 o link */}
      <audio ref={audioRef} loop>
        <source src="" type="audio/mpeg" />
        {/* Pegar acá el link del mp3: src="tu-cancion.mp3" */}
      </audio>
      <button
        onClick={togglePlay}
        className="w-14 h-14 rounded-full border border-primary/30 flex items-center justify-center transition-all duration-300 hover:border-primary/60 hover:shadow-lg bg-background/50 backdrop-blur-sm"
        aria-label={isPlaying ? "Pausar" : "Reproducir"}
      >
        {isPlaying ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-primary ml-0.5">
            <polygon points="5,3 19,12 5,21" />
          </svg>
        )}
      </button>
      <p className="text-xs text-muted-foreground tracking-widest uppercase">Música</p>
    </div>
  );
};

/* ─── Countdown Box ─── */
const CountdownBox = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center">
    <div className="w-16 h-16 border border-primary/25 rounded-sm flex items-center justify-center bg-background/40 backdrop-blur-sm">
      <span className="text-2xl font-display text-foreground">{String(value).padStart(2, "0")}</span>
    </div>
    <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-2 font-body">{label}</span>
  </div>
);

/* ─── Main Page ─── */
const Index = () => {
  const eventDate = new Date("2026-04-25T21:00:00");
  const timeLeft = useCountdown(eventDate);
  useScrollReveal();

  // EDITABLE: Cambiar estos links
  const googleMapsLink = "https://maps.google.com"; // ← Pegar link de Google Maps
  const whatsappLink = "https://wa.me/5491100000000?text=Hola!%20Confirmo%20asistencia%20a%20los%20XV%20de%20Vicky"; // ← Editar número y mensaje

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">

      {/* ═══ PORTADA ═══ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden">
        <Sparkles count={12} />
        <div className="scroll-reveal">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground font-body mb-8">
            Te invito a celebrar
          </p>
          <DecoLine />
          <h1 className="text-5xl md:text-7xl font-display font-light text-foreground mt-6 leading-tight">
            Mis XV
          </h1>
          <p className="text-6xl md:text-8xl font-display italic text-primary mt-2">
            Vicky
          </p>
          <DecoLine />
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground font-body mt-8">
            25 de abril de 2026
          </p>
        </div>
      </section>

      {/* ═══ FOTO 1 ═══ */}
      <PhotoSection index={1} />

      {/* ═══ FRASE EMOTIVA ═══ */}
      <section className="relative py-24 px-8 text-center overflow-hidden">
        <Sparkles count={6} />
        <div className="scroll-reveal max-w-md mx-auto">
          <DecoLine />
          <p className="text-xl md:text-2xl font-body italic text-foreground leading-relaxed mt-8 mb-8">
            "Tu presencia hará esta noche aún más especial, te espero."
          </p>
          <DecoLine />
        </div>
      </section>

      {/* ═══ FOTO 2 ═══ */}
      <PhotoSection index={2} />

      {/* ═══ CUENTA REGRESIVA ═══ */}
      <section className="relative py-24 px-6 text-center overflow-hidden">
        <Sparkles count={8} />
        <div className="scroll-reveal">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground font-body mb-10">
            Faltan
          </p>
          <div className="flex justify-center gap-4">
            <CountdownBox value={timeLeft.days} label="Días" />
            <CountdownBox value={timeLeft.hours} label="Horas" />
            <CountdownBox value={timeLeft.minutes} label="Min" />
            <CountdownBox value={timeLeft.seconds} label="Seg" />
          </div>
        </div>
      </section>

      {/* ═══ FOTO 3 ═══ */}
      <PhotoSection index={3} />

      {/* ═══ DATOS DEL EVENTO ═══ */}
      <section className="relative py-24 px-8 text-center overflow-hidden">
        <Sparkles count={6} />
        <div className="scroll-reveal max-w-sm mx-auto">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground font-body mb-10">
            Ceremonia & Fiesta
          </p>

          <div className="space-y-6 mb-10">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-body">Fecha</p>
              <p className="text-lg font-display text-foreground mt-1">25 de Abril de 2026</p>
            </div>
            <div className="deco-line mx-auto" style={{ width: "30px" }} />
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-body">Horario</p>
              <p className="text-lg font-display text-foreground mt-1">21:00 hs a 04:00 hs</p>
            </div>
            <div className="deco-line mx-auto" style={{ width: "30px" }} />
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-body">Lugar</p>
              <p className="text-lg font-display text-foreground mt-1">Espacio Muñiz</p>
            </div>
          </div>

          {/* Botones */}
          <div className="flex flex-col gap-3 mt-10">
            <a
              href={googleMapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block py-3 px-6 border border-primary/30 rounded-sm text-sm uppercase tracking-[0.2em] text-foreground font-body transition-all duration-300 hover:bg-primary/10 hover:border-primary/50"
            >
              Cómo llegar
            </a>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block py-3 px-6 bg-primary/10 border border-primary/20 rounded-sm text-sm uppercase tracking-[0.2em] text-foreground font-body transition-all duration-300 hover:bg-primary/20"
            >
              Confirmar asistencia
            </a>
          </div>

          <p className="text-xs text-muted-foreground font-body mt-6 tracking-wide">
            Confirmar asistencia hasta el 10 de abril
          </p>
        </div>
      </section>

      {/* ═══ FOTO 4 ═══ */}
      <PhotoSection index={4} />

      {/* ═══ REGALO ═══ */}
      <section className="relative py-24 px-8 text-center overflow-hidden">
        <Sparkles count={5} />
        <div className="scroll-reveal max-w-sm mx-auto">
          <DecoLine />
          <p className="text-base font-body italic text-foreground leading-relaxed mt-8 mb-6">
            Mi mejor regalo es tu presencia, pero si deseas hacerme un presente podés depositar dinero en este alias:
          </p>
          <div className="py-4 px-8 border border-primary/25 rounded-sm bg-background/40 backdrop-blur-sm inline-block">
            <p className="text-xl font-display tracking-widest text-primary">emiliapxv</p>
          </div>
          <DecoLine />
        </div>
      </section>

      {/* ═══ FOTO 5 ═══ */}
      <PhotoSection index={5} />

      {/* ═══ CIERRE + MÚSICA ═══ */}
      <section className="relative py-24 px-8 text-center overflow-hidden">
        <Sparkles count={10} />
        <div className="scroll-reveal">
          <DecoLine wide />
          <p className="text-3xl font-display italic text-primary mt-10 mb-4">Vicky</p>
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground font-body mb-12">
            Mis XV Años
          </p>
          <MusicPlayer />
          <div className="mt-12">
            <DecoLine />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
