import { useQuery } from "@tanstack/react-query";

export interface PersonCredit {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  media_type: string;
  release_date?: string;
  first_air_date?: string;
  character?: string;
  job?: string;
  vote_count?: number;
}

export interface PersonData {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
  credits: PersonCredit[];
}

async function fetchPersonCredits(personId: number): Promise<PersonData> {
  const res = await fetch(`/api/tmdb/person/${personId}`);
  
  if (!res.ok) {
    throw new Error("Failed to fetch person credits");
  }
  
  return res.json();
}

export function usePersonCredits(personId: number | null) {
  return useQuery({
    queryKey: ["person-credits", personId],
    queryFn: () => fetchPersonCredits(personId!),
    enabled: personId !== null,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
