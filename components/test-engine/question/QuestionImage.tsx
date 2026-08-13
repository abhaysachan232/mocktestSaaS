import Image from "next/image";

interface QuestionImageProps {
  src: string;
  alt?: string;
}

export default function QuestionImage({
  src,
  alt = "Question image",
}: QuestionImageProps) {
  return (
    <div className="my-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
      <div className="relative min-h-[160px] w-full">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 800px"
          className="object-contain"
        />
      </div>
    </div>
  );
}