import { useState, useEffect } from "react";
import world1 from "../assets/world1.jpeg";
import world2 from "../assets/world2.jpeg";
import world3 from "../assets/world3.jpeg";

const images = [world1, world2, world3];

export default function WorldcoinCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = () => setCurrent((prev) => (prev + 1) % images.length);
  const prev = () =>
    setCurrent((prev) => (prev - 1 + images.length) % images.length);

  // ⏱ Auto-play cada 4s
  useEffect(() => {
    if (paused) return;
    const interval = setInterval(next, 4000);
    return () => clearInterval(interval);
  }, [current, paused]);

  return (
    <div
      className="relative w-full max-w-4xl mx-auto mb-20 overflow-hidden rounded-2xl shadow-2xl select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Imágenes deslizantes */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)`, width: `${images.length * 100}%` }}
      >
        {images.map((img, i) => (
          <div key={i} className="w-full flex-shrink-0">
            <img
              src={img}
              alt={`Worldcoin ${i + 1}`}
              className="w-full h-[420px] object-cover rounded-2xl"
            />
          </div>
        ))}
      </div>

      {/* Botones laterales */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-3 rounded-full transition"
      >
        ❮
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-3 rounded-full transition"
      >
        ❯
      </button>

      {/* Indicadores inferiores */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <div
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3.5 h-3.5 rounded-full cursor-pointer transition-all ${
              current === i ? "bg-white scale-125" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
