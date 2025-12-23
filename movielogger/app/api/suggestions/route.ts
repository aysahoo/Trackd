import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import db from "@/db";
import { suggestion, user } from "@/db/schema";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import { eq, and, desc } from "drizzle-orm";

export async function GET(req: Request) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    try {
        // Fetch suggestions received by the current user
        const suggestions = await db.select({
            id: suggestion.id,
            friendName: user.name,
            friendAvatar: user.image,
            friendId: user.id,
            movieTitle: suggestion.title,
            moviePoster: suggestion.poster,
            tmdbId: suggestion.tmdbId,
            mediaType: suggestion.mediaType,
            year: suggestion.year,
            timestamp: suggestion.createdAt,
            status: suggestion.status
        })
            .from(suggestion)
            .innerJoin(user, eq(suggestion.friendId, user.id)) // Join to get sender details
            .where(
                and(
                    eq(suggestion.userId, session.user.id), // Recipient is current user
                    eq(suggestion.status, "pending")
                )
            )
            .orderBy(desc(suggestion.createdAt));

        return NextResponse.json({
            success: true,
            data: suggestions
        });
    } catch (error) {
        console.error("Failed to fetch suggestions:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch suggestions" }, { status: 500 });
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
        const { friendId, tmdbId, mediaType, title, year, poster } = await req.json();

        if (!friendId || !tmdbId || !title) {
            return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
        }

        // Create suggestion
        // I am the sender (friendId in table), they are the recipient (userId in table)
        const id = nanoid();
        await db.insert(suggestion).values({
            id,
            userId: friendId, // Recipient
            friendId: session.user.id, // Sender
            tmdbId,
            mediaType,
            title,
            year,
            poster,
            status: "pending",
        });

        return NextResponse.json({ success: true, message: "Suggestion sent" });
    } catch (error) {
        console.error("Failed to send suggestion:", error);
        return NextResponse.json({ success: false, error: "Failed to send suggestion" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    try {
        const { id, status } = await req.json();

        if (!id || !["accepted", "dismissed"].includes(status)) {
            return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
        }

        // Verify this suggestion is for the current user
        const existing = await db.select()
            .from(suggestion)
            .where(
                and(
                    eq(suggestion.id, id),
                    eq(suggestion.userId, session.user.id)
                )
            );

        if (existing.length === 0) {
            return NextResponse.json({ success: false, error: "Suggestion not found" }, { status: 404 });
        }

        await db.update(suggestion)
            .set({ status, updatedAt: new Date() })
            .where(eq(suggestion.id, id));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to update suggestion:", error);
        return NextResponse.json({ success: false, error: "Failed to update suggestion" }, { status: 500 });
    }
}
