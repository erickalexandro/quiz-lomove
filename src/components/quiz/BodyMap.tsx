import { cn } from "@/lib/utils";
import avatarBase from "@/assets/avatar-base.webp";
import painPescoco from "@/assets/pain-pescoco.webp";
import painOmbros from "@/assets/pain-ombros.webp";
import painLombar from "@/assets/pain-lombar.webp";
import painCiatica from "@/assets/pain-ciatica.webp";
import painQuadril from "@/assets/pain-quadril.webp";
import painHernia from "@/assets/pain-hernia.webp";

interface BodyMapProps {
  value?: string | undefined;
  onSelect: (value: string) => void;
}

/**
 * Mapa corporal interativo usando imagens sobrepostas.
 * Exibe o avatar base e sobrepõe a imagem da região de dor selecionada.
 */
export function BodyMap({ value, onSelect }: BodyMapProps) {
  // Mapeamento das imagens de dor por valor selecionado
  const painImages: Record<string, string> = {
    pescoco: painPescoco.url,
    ombros: painOmbros.url,
    lombar: painLombar.url,
    ciatica: painCiatica.url,
    quadril: painQuadril.url,
    hernia: painHernia.url,
  };

  return (
    <div className="relative mb-6 flex justify-center w-full max-w-[180px] mx-auto aspect-[1/2.6]">
      {/* Imagem Base do Avatar */}
      <img
        src={avatarBase?.url}
        alt="Silhueta do corpo humano"
        className="absolute inset-0 w-full h-full object-contain z-0"
      />

      {/* Overlay de Dor (apenas se houver seleção) */}
      {value && painImages[value] && (
        <img
          src={painImages[value]}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-contain z-10 animate-in fade-in duration-300 pointer-events-none"
        />
      )}

      {/* Áreas clicáveis invisíveis (SVG Overlay para precisão) */}
      <svg
        viewBox="0 0 200 520"
        className="absolute inset-0 w-full h-full z-20"
        role="group"
        aria-label="Mapa do corpo — toque na região da dor"
      >
        {/* Pescoço */}
        <rect
          x="75" y="45" width="50" height="45"
          className="fill-transparent cursor-pointer"
          onClick={() => onSelect("pescoco")}
        />
        
        {/* Ombros */}
        <path
          d="M45 80h35v45h-35z M120 80h35v45h-35z"
          className="fill-transparent cursor-pointer"
          onClick={() => onSelect("ombros")}
        />

        {/* Lombar / Parte inferior das costas */}
        <rect
          x="60" y="200" width="80" height="60"
          className="fill-transparent cursor-pointer"
          onClick={() => onSelect("lombar")}
        />

        {/* Quadril */}
        <rect
          x="55" y="270" width="90" height="60"
          className="fill-transparent cursor-pointer"
          onClick={() => onSelect("quadril")}
        />

        {/* Ciática (Perna Direita no avatar) */}
        <path
          d="M100 330l10 160h45l-10-160z"
          className="fill-transparent cursor-pointer"
          onClick={() => onSelect("ciatica")}
        />

        {/* Hérnia (região da coluna média) */}
        <rect
          x="85" y="140" width="30" height="100"
          className="fill-transparent cursor-pointer"
          onClick={() => onSelect("hernia")}
        />
      </svg>
    </div>
  );
}
