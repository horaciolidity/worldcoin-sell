import { useState, useEffect } from "react";
import world1 from "../assets/world1.jpeg";
import world2 from "../assets/world2.jpeg";
import world3 from "../assets/world3.jpeg";

const images = [world1, world2, world3];

export default function WorldcoinCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = () => setCurrent((prev) => (prev + 1) % images.length);
  const prev = () => setCurrent((prev) => (prev - 1 + images.length) % images.length);

  // Auto-play cada 4 s
  useEffect(() => {
    if (paused) return;
    const interval = setInterval(next, 4000);
    return () => clearInterval(interval);
  }, [current, paused]);

  return (
    <div
      className="relative w-full max-w-4xl mx-auto mb-20 overflow-hidden rounded-2xl shadow-2xl select-none bg-black/20 backdrop-blur-sm"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Contenedor del carrusel */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${current * 100}%)`,
          width: `${images.length * 100}%`,
        }}
      >
        {images.map((img, i) => (
          <div key={i} className="w-full flex-shrink-0 flex items-center justify-center">
            <img
              src={img}
              alt={`Worldcoin ${i + 1}`}
              className="w-full max-h-[380px] object-contain rounded-2xl bg-gradient-to-b from-gray-950 to-gray-900"
            />
          </div>
        ))}
      </div>

      {/* Flechas */}
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

      {/* Dots inferiores */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <div
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full cursor-pointer transition-all ${
              current === i ? "bg-white scale-125" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
