import { useEffect, useState, useRef, useCallback } from "react";

import { useMemo } from "react";

const Sparkles = ({ count = 4 }: { count?: number }) => {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${15 + Math.random() * 70}%`,
      top: `${15 + Math.random() * 70}%`,
      delay: `${Math.random() * 6}s`,
      duration: `${8 + Math.random() * 4}s`, // más lento = más elegante
      size: Math.random() > 0.5 ? 16 : 12,
    }));
  }, [count]);

  return (
    <>
      <style>{`
        @keyframes smoothTwinkle {
          0% {
            opacity: 0;
            transform: scale(0.85);
          }
          40% {
            opacity: 0.35;
            transform: scale(1);
          }
          60% {
            opacity: 0.35;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(0.85);
          }
        }

        .star-fluid {
          animation-name: smoothTwinkle;
          animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          animation-iteration-count: infinite;
          animation-fill-mode: both;
          will-change: transform, opacity;
          filter: blur(0.3px); /* suaviza aún más */
        }
      `}</style>

      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {particles.map((p) => (
          <svg
            key={p.id}
            width={p.size}
            height={p.size}
            viewBox="0 0 24 24"
            className="absolute text-[#d4af37] star-fluid"
            style={{
              left: p.left,
              top: p.top,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          >
            <path
              d="M12 0C12 0 12 10.5 24 12C12 13.5 12 24 12 24C12 24 12 13.5 0 12C12 10.5 12 0 12 0Z"
              fill="currentColor"
            />
          </svg>
        ))}
      </div>
    </>
  );
};


/* ─── Decorative Line ─── */
const DecoLine = ({ wide = false }: { wide?: boolean }) => (
  <div className={`deco-line ${wide ? "deco-line-wide" : ""} my-6`} />
);

/* ─── Photo Section ─── */
const PhotoSection = ({ index }: { index: number }) => (
<div className="photo-section scroll-reveal h-screen w-full overflow-hidden">    {
<img 
  src={`/foto${index}.webp`} 
  alt={`Foto ${index} de Vicky`} 
  className="w-full h-full object-cover object-center"
/>}
    <div className="text-center opacity-30">
      <div className="w-16 h-16 mx-auto mb-3 rounded-full border border-primary/20 flex items-center justify-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary/40">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="m21 15-5-5L5 21" />
        </svg>
      </div>
      <p className="text-xs tracking-widest uppercase text-muted-foreground/50 font-body">Foto {index}</p>
    </div>
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

/* ─── Music Player con Fade In ─── */
const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  // Usamos una referencia para guardar el temporizador del fade in
  const fadeInterval = useRef<NodeJS.Timeout | null>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    const audio = audioRef.current;

    if (isPlaying) {
      // Si pausamos, limpiamos cualquier fade in que estuviera a medias y pausamos de una
      if (fadeInterval.current) clearInterval(fadeInterval.current);
      audio.pause();
      setIsPlaying(false);
    } else {
      // Arrancamos el audio totalmente silenciado
      audio.volume = 0; 
      
      audio.play().then(() => {
        setIsPlaying(true);

        // --- LÓGICA DEL FADE IN DE 4 SEGUNDOS ---
        const duration = 4000; // 4 segundos en milisegundos
        const stepTime = 100; // Cada cuántos ms actualizamos el volumen
        const steps = duration / stepTime; // Total de pasitos (40 pasos)
        const volumeStep = 1 / steps; // Cuánto sube el volumen por paso

        // Limpiamos intervalos viejos por las dudas
        if (fadeInterval.current) clearInterval(fadeInterval.current);

        // Iniciamos la subida gradual
        fadeInterval.current = setInterval(() => {
          if (audio.volume < 1 - volumeStep) {
            audio.volume += volumeStep;
          } else {
            // Cuando ya llegó al tope, lo clavamos en 1 y cortamos el intervalo
            audio.volume = 1;
            if (fadeInterval.current) clearInterval(fadeInterval.current);
          }
        }, stepTime);

      }).catch((error) => {
        console.log("El navegador bloqueó el autoplay", error);
        setIsPlaying(false);
      });
    }
  };

  // Limpiamos la memoria si el usuario cierra la página rápido
  useEffect(() => {
    return () => {
      if (fadeInterval.current) clearInterval(fadeInterval.current);
    };
  }, []);

  return (
    <>
      <audio ref={audioRef} src="/audio.mp3" loop preload="auto" />

      <button
        onClick={togglePlay}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-white/70 backdrop-blur-md border border-[#d4af37]/50 shadow-[0_0_15px_rgba(212,175,55,0.3)] flex items-center justify-center text-[#d4af37] text-xl transition-all duration-300 hover:scale-110 hover:bg-white"
      >
        {isPlaying ? "❚❚" : "▶"}
      </button>
    </>
  );
};
/* ─── Countdown Box ─── */
const CountdownBox = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center">
    <div className="w-16 h-16 border border-[#d4af37]/90 rounded-sm flex items-center justify-center bg-background/40 backdrop-blur-sm">
      <span className="text-2xl font-display text-foreground">{String(value).padStart(2, "0")}</span>
    </div>
<span className="text-xs uppercase tracking-[0.2em] text-black mt-2 font-body font-semibold">
{label}</span>
  </div>
);

/* ─── Main Page ─── */
const Index = () => {
  const eventDate = new Date("2026-04-25T21:00:00");
  const timeLeft = useCountdown(eventDate);
  useScrollReveal();

  // EDITABLE: Cambiar estos links
  const googleMapsLink = "https://www.google.com/maps/place/Espacio+Mu%C3%B1iz/@-33.0940855,-64.3082128,17z/data=!4m6!3m5!1s0x95cdffa6d142114d:0x36b081ce084d3897!8m2!3d-33.0940855!4d-64.3082128!16s%2Fg%2F11c56r4cpv?entry=ttu&g_ep=EgoyMDI2MDMxNS4wIKXMDSoASAFQAw%3D%3D"; // ← Pegar link de Google Maps
  const whatsappLink = "https://wa.me/5493583640081?text=Holaaa, %20Confirmo%20asistencia%20a%20los%20XV%20de%20Vicky"; // ← Editar número y mensaje

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
    <MusicPlayer />
      {/* ═══ PORTADA ═══ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden">

        {/* IMAGEN DE FONDO */}
        <img
          src="/portada.webp" // ← poné acá la foto de Vicky en /public
          alt="Vicky"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* OVERLAY para opacidad */}
<div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/40" />
        <div className="scroll-reveal relative z-10">
<p className="text-xs uppercase tracking-[0.4em] text-gray-200 drop-shadow-md font-body mb-8">
  Te invito a celebrar
</p>

<DecoLine />

<h1 className="text-5xl md:text-7xl font-display font-light text-white drop-shadow-md mt-6 leading-tight">
  Mis XV
</h1>

<p className="text-6xl md:text-8xl font-display italic text-[#d4af37] mt-2">
  Vicky
</p>

<DecoLine />

<p className="text-sm uppercase tracking-[0.3em] text-gray-200 drop-shadow-md font-body mt-8">
  25 de abril de 2026
</p>
        </div>
      </section>
{/* ═══ FRASE EMOTIVA ═══ */}
      <section className="relative pt-16 pb-2 px-8 text-center overflow-hidden">
        <Sparkles count={6} />
        <div className="scroll-reveal max-w-md mx-auto">
          <DecoLine />
          
          <p className="text-2xl md:text-3xl font-body italic text-foreground leading-relaxed my-6">
            "Tu presencia hará esta noche aún más especial, te espero."
          </p>
          
          <DecoLine />
        </div>
      </section>

      {/* ═══ CUENTA REGRESIVA ═══ */}
      <section className="relative pt-2 pb-14 px-6 text-center overflow-hidden">
        <Sparkles count={8} />
        <div className="scroll-reveal">
          
          <p className="text-sm uppercase tracking-[0.2em] text-black/80 font-body font-semibold mb-6">
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

{/* ═══ FOTO 2 ═══ */}
<PhotoSection index={2} />

{/* ═══ DATOS DEL EVENTO ═══ */}
<section className="relative py-24 px-8 text-center overflow-hidden">
  <Sparkles count={6} />

  <div className="scroll-reveal max-w-sm mx-auto">

    {/* TARJETA */}
    <div className="bg-white/40 backdrop-blur-md border border-primary/20 rounded-xl p-10 shadow-lg">

      <p className="text-sm uppercase tracking-[0.2em] text-black/80 font-body font-semibold mb-10">
        Detalles de la Fiesta
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

      {/* BOTÓN MAPS */}
      <a
        href={googleMapsLink}
        target="_blank"
        rel="noopener noreferrer"
        className="block py-4 px-8 border border-primary/30 rounded-lg text-sm uppercase tracking-[0.25em] text-foreground font-body transition-all duration-300 hover:bg-primary/10 hover:border-primary/50 hover:shadow-md hover:scale-[1.02]"
      >
        Cómo llegar
      </a>

    </div>

    {/* SEPARACIÓN Y DECOLINE */}
    <div className="py-10">
      <DecoLine />
    </div>

    {/* BOTÓN CONFIRMAR ASISTENCIA (DORADO) */}
    
    <p className="text-lg font-semibold text-primary mt-8 py-3 tracking-wide">
Hacé click para confirmar!    </p>
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="block py-4 px-8 border-2 border-[#d4af37] bg-[#d4af37]/5 rounded-lg text-sm uppercase tracking-[0.25em] text-[#d4af37] font-semibold font-body transition-all duration-300 hover:bg-[#d4af37] hover:text-white hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] hover:scale-[1.02]"
    >
      Confirmar asistencia
    </a>

    <p className="text-lg font-semibold text-primary mt-6 tracking-wide">
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
<p className="text-2xl md:text-2xl font-body italic text-foreground leading-relaxed mt-8 mb-6"> Mi mejor regalo es tu presencia, pero si deseas hacerme un presente podés depositar dinero en este alias:
          </p>
<div className="py-4 px-8 border border-primary/25 rounded-sm bg-background/40 backdrop-blur-sm inline-block">
  <p className="text-xl font-display tracking-widest text-primary">vicky.corbett1</p>
  <p className="text-xl font-body text-primary/70 mt-2">Victoria Corbett Vaschetti</p>
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

          <p className="text-3xl font-display italic text-primary mt-10 mb-4">
            Vicky
          </p>

<p className="text-xl md:text-2xl font-body italic text-foreground leading-relaxed mt-8 mb-6">  Te espero para compartir una noche inolvidable ✨
</p>
          <div className="mt-12">
            <DecoLine />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
