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
            .innerJoin(user, eq(suggestion.friendId, user.id))
            .where(
                and(
                    eq(suggestion.userId, session.user.id),
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

        const id = nanoid();
        await db.insert(suggestion).values({
            id,
            userId: friendId,
            friendId: session.user.id,
            tmdbId,
            mediaType,
            title,
            year,
            poster,
            status: "pending",
        });

        // Fetch recipient details to send email
        const [recipient] = await db.select().from(user).where(eq(user.id, friendId));

        if (recipient && recipient.email) {
            const { Resend } = await import("resend");
            const resend = new Resend(process.env.RESEND_API_KEY);

            await resend.emails.send({
                from: "MovieLogger <info@movielogger.adasrhanatia.xyz>",
                to: recipient.email,
                subject: `${session.user.name} suggested a ${mediaType === 'tv' ? 'TV show' : 'movie'}`,
                html: `
                    <!DOCTYPE html>
                    <html>
                    <body style="margin: 0; padding: 20px; background-color: #000000; font-family: sans-serif;">
                        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #000000; width: 100%;">
                            <tr>
                                <td align="center">
                                    <div style="max-width: 480px; margin: 0 auto; background-color: #111111; padding: 24px; text-align: center;">
                                        <div style="font-size: 24px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px; margin-bottom: 24px;">
                                            MovieLogger
                                        </div>
                                        <div style="margin-bottom: 20px;">
                                            <img src="${poster ? (poster.startsWith('http') ? poster : `https://image.tmdb.org/t/p/w500${poster}`) : 'https://movielogger.adasrhanatia.xyz/placeholder-poster.jpg'}" alt="${title}" style="width: 120px; height: 180px; object-fit: cover; box-shadow: 0 4px 12px rgba(0,0,0,0.5);">
                                        </div>
                                        <h1 style="font-size: 20px; font-weight: 600; color: #ffffff; margin: 0 0 12px 0; letter-spacing: -0.3px;">
                                            ${session.user.name} suggested a ${mediaType === 'tv' ? 'TV show' : 'movie'}
                                        </h1>
                                        <p style="font-size: 15px; color: #888888; line-height: 1.5; margin: 0 0 24px 0;">
                                            ${session.user.name} thinks you'll like <strong>${title}</strong> (${year}). Check it out on MovieLogger.
                                        </p>
                                        <div>
                                            <a href="https://movie-logger-two.vercel.app/" style="background-color: #000000; color: #ffffff; padding: 12px 28px; border-radius: 9999px; font-weight: 600; font-size: 14px; text-decoration: none; display: inline-block; border: 1px solid #ffffff;">
                                                View Suggestion
                                            </a>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </body>
                    </html>
                `
            });
        }

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
