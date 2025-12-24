import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    if (!id) {
        return NextResponse.json(
            { error: "Person ID is required" },
            { status: 400 }
        );
    }

    try {
        const [personRes, creditsRes] = await Promise.all([
            fetch(
                `https://api.themoviedb.org/3/person/${id}?language=en-US`,
                {
                    headers: {
                        Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
                        accept: "application/json",
                    },
                }
            ),
            fetch(
                `https://api.themoviedb.org/3/person/${id}/combined_credits?language=en-US`,
                {
                    headers: {
                        Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
                        accept: "application/json",
                    },
                }
            ),
        ]);

        if (!personRes.ok || !creditsRes.ok) {
            return NextResponse.json(
                { error: "Failed to fetch person data from TMDB" },
                { status: personRes.status || creditsRes.status }
            );
        }

        const [person, credits] = await Promise.all([
            personRes.json(),
            creditsRes.json(),
        ]);
        interface CreditItem {
            id: number;
            vote_count?: number;
            [key: string]: unknown;
        }
        const allCredits: CreditItem[] = [...(credits.cast || []), ...(credits.crew || [])];
        const uniqueCredits = Array.from(
            new Map(allCredits.map((item: CreditItem) => [item.id, item])).values()
        );
        const sortedCredits = uniqueCredits.sort((a: CreditItem, b: CreditItem) => 
            (b.vote_count || 0) - (a.vote_count || 0)
        );

        return NextResponse.json({
            id: person.id,
            name: person.name,
            profile_path: person.profile_path,
            known_for_department: person.known_for_department,
            credits: sortedCredits,
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
