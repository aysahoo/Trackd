import { NextResponse } from "next/server";

export async function GET() {
    const res = await fetch(
        "https://api.themoviedb.org/3/tv/2287/similar",
        {
            headers: {
                Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
            },
        }
    );

    const data = await res.json();

    return NextResponse.json(data);
}
