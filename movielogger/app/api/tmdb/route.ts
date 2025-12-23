import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    if (!query) {
        return NextResponse.json(
            { error: "Query parameter is required" },
            { status: 400 }
        );
    }

    try {
        const res = await fetch(
            `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(
                query
            )}&include_adult=false&language=en-US&page=1`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
                    accept: "application/json",
                },
            }
        );

        if (!res.ok) {
            return NextResponse.json(
                { error: "Failed to fetch data from TMDB" },
                { status: res.status }
            );
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
