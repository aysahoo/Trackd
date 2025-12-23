import { Movie } from "../lib/data";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <div className="relative overflow-hidden aspect-[2/3] squircle-mask squircle-2xl cursor-pointer">
      <img
        src={movie.posterUrl}
        alt={movie.title}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
