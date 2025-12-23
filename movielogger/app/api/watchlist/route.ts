import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import db from "@/db";
import { watchItem } from "@/db/schema";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    try {
        const items = await db.select()
            .from(watchItem)
            .where(eq(watchItem.userId, session.user.id));

        return NextResponse.json({ success: true, data: items });
    } catch (error) {
        console.error("Failed to fetch watchlist:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch watchlist" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    try {
        const movie = await req.json();

        // Check if already exists
        const existing = await db.select()
            .from(watchItem)
            .where(eq(watchItem.tmdbId, movie.id.toString()))

        await db.insert(watchItem).values({
            id: nanoid(),
            userId: session.user.id,
            tmdbId: movie.id.toString(),
            mediaType: movie.media_type || "movie",
            title: movie.title || movie.name,
            year: (movie.release_date || movie.first_air_date)?.split("-")[0] || null,
            poster: movie.poster_path,
            status: "wishlist", // Defaulting to wishlist when adding from search, user can change later
        });

        return NextResponse.json({ success: true, message: "Added to watchlist" });
    } catch (error) {
        console.error("Failed to add to watchlist:", error);
        return NextResponse.json({ success: false, error: "Failed to add to watchlist" }, { status: 500 });
    }
}
