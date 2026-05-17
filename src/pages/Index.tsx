  import { useEffect, useState, useRef, useCallback } from "react";
  import { useMemo } from "react";
const ConfirmationModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [hasFamily, setHasFamily] = useState(false);
  const [companionCount, setCompanionCount] = useState(1);
  const [companions, setCompanions] = useState([{ nombre: "", apellido: "" }]);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setIsSubmitted(false);
        setHasFamily(false);
        setCompanionCount(1);
        setCompanions([{ nombre: "", apellido: "" }]);
      }, 300);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const count = parseInt(e.target.value);
    setCompanionCount(count);
    
    setCompanions(prev => {
      const newArr = [...prev];
      if (count > prev.length) {
        for (let i = prev.length; i < count; i++) {
          newArr.push({ nombre: "", apellido: "" });
        }
      } else {
        newArr.splice(count);
      }
      return newArr;
    });
  };

  const handleCompanionChange = (index: number, field: "nombre" | "apellido", value: string) => {
    const newCompanions = [...companions];
    newCompanions[index][field] = value;
    setCompanions(newCompanions);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const form = e.currentTarget;
    const actionUrl = form.action;

    const mainNombre = form.querySelector<HTMLInputElement>('input[name="entry.922961004"]')?.value || "";
    const mainApellido = form.querySelector<HTMLInputElement>('input[name="entry.1397999760"]')?.value || "";
    const mainEmail = form.querySelector<HTMLInputElement>('input[name="entry.1737060455"]')?.value || "";
    const mainTelefono = form.querySelector<HTMLInputElement>('input[name="entry.1964299961"]')?.value || "";

    try {
      // 1. Enviamos el titular
      const formDataTitular = new FormData();
      formDataTitular.append("entry.922961004", mainNombre);
      formDataTitular.append("entry.1397999760", mainApellido);
      formDataTitular.append("entry.1737060455", mainEmail);
      formDataTitular.append("entry.1964299961", mainTelefono);

      await fetch(actionUrl, { method: 'POST', body: formDataTitular, mode: 'no-cors' });
      
      // 2. Enviamos a los acompañantes
      if (hasFamily) {
        for (const companion of companions) {
          if (companion.nombre.trim() !== "" || companion.apellido.trim() !== "") {
            const formDataCompanion = new FormData();
            formDataCompanion.append("entry.922961004", companion.nombre);
            formDataCompanion.append("entry.1397999760", companion.apellido);
            formDataCompanion.append("entry.1737060455", `Acompañante de ${mainNombre} ${mainApellido}`);
            formDataCompanion.append("entry.1964299961", mainTelefono); 
            
            await fetch(actionUrl, { method: 'POST', body: formDataCompanion, mode: 'no-cors' });
          }
        }
      }
      
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      setTimeout(() => {
        onClose();
      }, 3500);

    } catch (error) {
      console.error("Error al enviar el formulario", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full relative border-2 border-[#E81E62]/30 shadow-[0_0_30px_rgba(232,30,98,0.3)] max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-black/40 hover:text-[#E81E62] transition-colors text-3xl">✕</button>
        
        {isSubmitted ? (
          <div className="text-center py-6 transition-opacity duration-500">
            <div className="w-16 h-16 bg-[#E81E62]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#E81E62]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="text-4xl font-display text-[#E81E62] mb-2">¡Gracias!</h3>
            <p className="text-xl text-gray-600 font-body">Gracias por confirmar tu asistencia.</p>
          </div>
        ) : (
          <>
            <h3 className="text-4xl font-display text-[#E81E62] mb-2 text-center">Asistiré</h3>
            <p className="text-base text-center text-gray-500 mb-6 uppercase tracking-widest font-body">Por favor completa tus datos</p>
            
            <form 
              action="https://docs.google.com/forms/d/1rDrucdR_DIgcldOQt9oVG_Hr1iA4JCnOPh270_bYYc4/formResponse"
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <input name="entry.922961004" type="text" placeholder="Tu Nombre" required className="w-full p-4 text-xl font-medium bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#E81E62] text-black" />
              <input name="entry.1397999760" type="text" placeholder="Tu Apellido" required className="w-full p-4 text-xl font-medium bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#E81E62] text-black" />
              <input name="entry.1737060455" type="email" placeholder="Tu Email" required className="w-full p-4 text-xl font-medium bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#E81E62] text-black" />
              <input name="entry.1964299961" type="tel" placeholder="Tu Teléfono" required className="w-full p-4 text-xl font-medium bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#E81E62] text-black" />

              <div className="flex items-center gap-4 py-2 border-t border-gray-200 mt-6 pt-6">
                <input 
                  type="checkbox" 
                  id="hasFamily"
                  checked={hasFamily}
                  onChange={(e) => setHasFamily(e.target.checked)}
                  className="w-8 h-8 accent-[#E81E62] rounded cursor-pointer shrink-0"
                />
                <label htmlFor="hasFamily" className="text-gray-800 font-body text-xl cursor-pointer select-none font-semibold leading-tight">
                  Asistiré con grupo familiar
                </label>
              </div>

              {hasFamily && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-4 p-5 bg-[#E81E62]/5 border border-[#E81E62]/20 rounded-xl mt-4">
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base font-bold text-[#E81E62] uppercase tracking-widest">¿Cuántos son?</span>
                    <select 
                      value={companionCount} 
                      onChange={handleCountChange}
                      className="p-3 px-6 text-xl font-bold bg-white border border-[#E81E62]/30 rounded-xl focus:outline-none focus:border-[#E81E62] text-black shadow-sm"
                    >
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-4 pt-2 border-t border-[#E81E62]/10">
                    {companions.map((companion, index) => (
                      <div key={index} className="flex gap-3">
                        <input 
                          type="text"
                          placeholder={`Nombre ${index + 1}`}
                          required={hasFamily}
                          value={companion.nombre}
                          onChange={(e) => handleCompanionChange(index, "nombre", e.target.value)}
                          className="w-1/2 p-4 text-xl font-medium bg-white border border-[#E81E62]/20 rounded-xl focus:outline-none focus:border-[#E81E62] focus:ring-2 focus:ring-[#E81E62]/20 text-black placeholder:text-gray-400 placeholder:font-normal shadow-sm"
                        />
                        <input 
                          type="text"
                          placeholder={`Apellido ${index + 1}`}
                          required={hasFamily}
                          value={companion.apellido}
                          onChange={(e) => handleCompanionChange(index, "apellido", e.target.value)}
                          className="w-1/2 p-4 text-xl font-medium bg-white border border-[#E81E62]/20 rounded-xl focus:outline-none focus:border-[#E81E62] focus:ring-2 focus:ring-[#E81E62]/20 text-black placeholder:text-gray-400 placeholder:font-normal shadow-sm"
                        />
                      </div>
                    ))}
                  </div>

                </div>
              )}
              
              <button 
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-5 mt-6 text-2xl rounded-xl font-bold tracking-[0.2em] transition-all shadow-xl text-white ${
                  isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-[#E81E62] hover:bg-[#c21851] active:scale-95"
                }`}
              >
                {isSubmitting ? "ENVIANDO..." : "CONFIRMAR"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
  const Sparkles = ({ count = 4 }: { count?: number }) => {
    const particles = useMemo(() => {
      return Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${15 + Math.random() * 70}%`,
        top: `${15 + Math.random() * 70}%`,
        delay: `${Math.random() * 6}s`,
        duration: `${3 + Math.random() * 2}s`, // más lento = más elegante
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
          
          /* Forzamos las líneas decorativas a rosa en caso de que tengan estilos CSS externos */
          .deco-line, .deco-line-wide {
            background-color: #e56399 !important;
            border-color: #E81E62 !important;
          }
        `}</style>

        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {particles.map((p) => (
            <svg
              key={p.id}
              width={p.size}
              height={p.size}
              viewBox="0 0 24 24"
              className="absolute text-[#E81E62] star-fluid"
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


const DecoLine = ({ wide = false }: { wide?: boolean }) => (
  <div className="flex justify-center my-6">
    <div
      className="relative"
      style={{
        width: wide ? "120px" : "60px",
        height: "1px",
        background: "linear-gradient(to right, transparent, #e796a2, transparent)",
      }}
    >
      {/* Glow suave */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#f4acb7",
          filter: "blur(6px)",
          opacity: 0.4,
        }}
      />
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

  /* ─── Countdown Box ─── */
  const CountdownBox = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 border border-[#e796a2]/90 rounded-sm flex items-center justify-center bg-background/40 backdrop-blur-sm">
        <span className="text-2xl font-display text-foreground">{String(value).padStart(2, "0")}</span>
      </div>
      <span className="text-xs uppercase tracking-[0.2em] text-black mt-2 font-body font-semibold">
        {label}
      </span>
    </div>
  );

  /* ─── Main Page ─── */
  const Index = () => {
    const eventDate = new Date("2026-07-25T20:00:00");
    const timeLeft = useCountdown(eventDate);
    useScrollReveal();

    // EDITABLE: Cambiar estos links
    const googleMapsLink = "https://www.google.com/maps/place/Espacio+Mu%C3%B1iz/@-33.0940855,-64.3082128,17z/data=!4m6!3m5!1s0x95cdffa6d142114d:0x36b081ce084d3897!8m2!3d-33.0940855!4d-64.3082128!16s%2Fg%2F11c56r4cpv?entry=ttu&g_ep=EgoyMDI2MDMxNS4wIKXMDSoASAFQAw%3D%3D"; // ← Pegar link de Google Maps
// Estado para controlar si el formulario está abierto o cerrado
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
      <div className="min-h-screen bg-background overflow-x-hidden">
      {/* MODAL DE CONFIRMACIÓN (Invisible hasta que se haga clic) */}
        <ConfirmationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
          
        
{/* ═══ PORTADA ═══ */}
<section
  className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden"
  style={{
    backgroundImage: "url('/fondo.webp')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat"
  }}
>
  {/* Glow de fondo */}
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="absolute top-10 left-1/2 -translate-x-1/2 opacity-40">
      <DecoLine wide />
    </div>
    <div className="w-[500px] h-[500px] bg-[#E81E62]/10 rounded-full blur-[120px]" />
  </div>

  <Sparkles count={10} />

  {/* CONTENEDOR CON MARCO */}
<div className="scroll-reveal relative z-10 px-12 py-24 md:px-20 md:py-32 max-w-xl w-full min-h-[650px] md:min-h-[750px] flex flex-col justify-center">    {/* Marco dorado MÁS FINO y más grande */}
    <div
      className="absolute inset-0 rounded-2xl pointer-events-none"
      style={{
        border: "0.4px solid rgba(200, 177, 103, 0.35)", // más fino
        boxShadow: `
          0 0 6px rgba(212,175,55,0.12),
          inset 0 0 12px rgba(212,175,55,0.05)
        `
      }}
    />

    {/* Contenido */}
<div className="relative z-10">
  <p
    className="text-xs uppercase tracking-[0.4em] text-black font-body mb-4"
    style={{ textShadow: "0 1px 2px rgba(255,255,255,0.6)" }}
  >
    Te invito a celebrar
  </p>

  <DecoLine />

  <h1
    className="text-5xl md:text-7xl font-display font-medium text-white mt-4 leading-tight"
    style={{
      textShadow: "0 13px 10px rgba(0,0,0,0.25)"
    }}
  >
    Mis XV
  </h1>

  <p className="relative text-6xl md:text-8xl font-display italic text-[#f4acb7] mt-2">
    <span className="relative z-10">Angelina</span>

    <span className="absolute inset-0 text-[#e56399] blur-[8px] opacity-40 scale-105">
      Angelina
    </span>
  </p>

  <DecoLine />

  <p
    className="text-sm uppercase tracking-[0.3em] text-black font-body mt-6"
    style={{ textShadow: "0 1px 2px rgba(255,255,255,0.6)" }}
  >
    25 de julio de 2026
  </p>
</div>
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
                </div>
        </section>
        {/* ═══ DIVISOR FLORAL ═══ */}
<div className="relative flex justify-center py-0 overflow-hidden">
  <img
    src="/divisionbarGrande.webp"
    alt=""
    className="
      w-[320px]
      md:w-[500px]
      opacity-90
      pointer-events-none
      select-none
      drop-shadow-[0_6px_18px_rgba(232,30,98,0.08)]
    "
  />
</div>

        {/* ═══ CUENTA REGRESIVA ═══ */}
        <section className="relative pt-2 pb-14 px-6 text-center overflow-hidden">
          <Sparkles count={6} />
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

 {/* ═══ DATOS DEL EVENTO ═══ */}
<section className="relative py-24 px-8 text-center overflow-hidden">
  <Sparkles count={6} />

<div className="scroll-reveal max-w-md mx-auto">
    {/* TARJETA */}
    <div className="relative">
      {/* GLOW DE FONDO */}
      <div className="absolute inset-0 -z-10 blur-2xl opacity-20 bg-gradient-to-br from-[#E81E62]/20 via-pink-200/20 to-transparent rounded-3xl" />

      {/* CONTENEDOR TARJETA */}
    <div className="relative bg-white/30 backdrop-blur-xl border border-[#E81E62]/20 rounded-2xl p-10 pb-28 shadow-[0_10px_40px_rgba(232,30,98,0.15)]">
        
        <p className="text-base uppercase tracking-[0.25em] text-black/80 font-body font-semibold mb-12">
          Detalles de la Fiesta
        </p>

        <div className="space-y-6 mb-16">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground font-body">
              Fecha
            </p>
            <p className="text-2xl font-display text-foreground mt-2">
              25 de Julio de 2026
            </p>
          </div>

          <div className="flex justify-center my-2">
            <div
              style={{
                width: "50px",
                height: "1px",
                background:
                  "linear-gradient(to right, transparent, #E81E62, transparent)",
                opacity: 0.6,
              }}
            />
          </div>

          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground font-body">
              Horario
            </p>
            <p className="text-2xl font-display text-foreground mt-2">
              20:00 hs
            </p>
          </div>

          <div className="flex justify-center my-2">
            <div
              style={{
                width: "50px",
                height: "1px",
                background:
                  "linear-gradient(to right, transparent, #E81E62, transparent)",
                opacity: 0.6,
              }}
            />
          </div>

          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground font-body">
              Lugar
            </p>
            <p className="text-xl font-display text-foreground mt-1 leading-relaxed">
              Francisco Muñiz 2900
              <br />
              Espacio Muñiz
            </p>
          </div>
        </div>

<img
  src="/rosachica.webp"
  alt="Rosa decorativa"
  className="
    absolute 
    bottom-10 left-1/2 -translate-x-1/2
    w-[200px]
    opacity-90
    drop-shadow-[0_10px_25px_rgba(232,30,98,0.25)]
  "
/>

  </div>
</div>

    {/* SEPARACIÓN */}
    <div className="py-8">
      <DecoLine />
    </div>

{/* BOTÓN CONFIRMAR */}
<div className="flex flex-col items-center text-center">

  <p className="text-2xl font-semibold text-[#f4acb7] mt-6 tracking-wide">
    Hacé click para confirmar
  </p>

  {/* CAMBIO: Quitamos el <a> y ponemos este <button> */}
  <button
    onClick={() => setIsModalOpen(true)}
    className="
      mt-3 px-8 py-3 
      rounded-xl
      border-2 border-[#f4acb7] bg-[#ffafcc]/5 
      text-[#f4acb7]
      text-base uppercase tracking-[0.15em] font-semibold
      transition-all duration-300
      hover:bg-[#E81E62] hover:text-white 
      hover:shadow-md hover:scale-105
    "
  >
    Confirmar asistencia
  </button>

  <p className="text-xl text-[#f4acb7] mt-5 tracking-wide">
    Confirmar asistencia hasta el 10 de julio
  </p>

  <div className="relative flex justify-center py-5 overflow-hidden">
    <img
      src="/divisionbarGrande.png"
      alt=""
      className="w-[400px] md:w-[850px] max-w-none opacity-90 pointer-events-none select-none drop-shadow-[0_6px_18px_rgba(232,30,98,0.08)]"
    />
  </div>
</div>
  </div>

        </section>
              <div className="py-5">
              <DecoLine />
            </div>
        {/* ═══ CIERRE + MÚSICA ═══ */}
        <section className="relative py-20 px-8 text-center overflow-hidden">
          <Sparkles count={13} />
          <div className="scroll-reveal">

            <p className="text-3xl font-display italic text-[#f4acb7] mt-10 mb-4">
              Angelina
            </p>

            <p className="text-xl md:text-2xl font-body italic text-foreground leading-relaxed mt-8 mb-6">  
              Te espero para compartir una noche inolvidable 
            </p>

            </div>
        </section>
                      <DecoLine />
<ConfirmationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
      
    );
  };

  export default Index;