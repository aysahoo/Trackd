import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import db from "@/db";
import { user, friend } from "@/db/schema";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import { eq, and, or, ne } from "drizzle-orm";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(req: Request) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    try {
        const allFriendships = await db.select({
            id: friend.id,
            friendId: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            status: friend.status,
            requesterId: friend.userId,
        })
            .from(friend)
            .innerJoin(user, or(
                and(eq(friend.userId, session.user.id), eq(friend.friendId, user.id)),
                and(eq(friend.friendId, session.user.id), eq(friend.userId, user.id))
            ))
            .where(
                or(
                    eq(friend.userId, session.user.id),
                    eq(friend.friendId, session.user.id)
                )
            );

        const friends = allFriendships.filter(f => f.status === "accepted");
        const requests = allFriendships.filter(f => f.status === "pending" && f.requesterId !== session.user.id);
        const sentRequests = allFriendships.filter(f => f.status === "pending" && f.requesterId === session.user.id);

        return NextResponse.json({
            success: true,
            data: {
                friends,
                requests,
                sentRequests
            }
        });
    } catch (error) {
        console.error("Failed to fetch friends:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch friends" }, { status: 500 });
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
        const { email } = await req.json();

        if (!email || typeof email !== 'string') {
            return NextResponse.json({ success: false, error: "Invalid email" }, { status: 400 });
        }

        if (email === session.user.email) {
            return NextResponse.json({ success: false, error: "Cannot add yourself" }, { status: 400 });
        }
        const [targetUser] = await db.select().from(user).where(eq(user.email, email));

        if (!targetUser) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }
        const existing = await db.select()
            .from(friend)
            .where(
                or(
                    and(eq(friend.userId, session.user.id), eq(friend.friendId, targetUser.id)),
                    and(eq(friend.userId, targetUser.id), eq(friend.friendId, session.user.id))
                )
            );

        if (existing.length > 0) {
            return NextResponse.json({ success: false, error: "Friendship already exists" }, { status: 400 });
        }

        const id = nanoid();
        await db.insert(friend).values({
            id,
            userId: session.user.id,
            friendId: targetUser.id,
            status: "pending",
        });

        try {
            await resend.emails.send({
                from: "MovieLogger <info@movielogger.adasrhanatia.xyz>",
                to: targetUser.email,
                subject: "New Friend Request",
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
                                            <img src="${session.user.image || 'https://movielogger.adasrhanatia.xyz/placeholder-user.jpg'}" alt="${session.user.name}" style="width: 80px; height: 80px; object-fit: cover; background-color: #333333; border: 2px solid #333333;">
                                        </div>
                                        <h1 style="font-size: 20px; font-weight: 600; color: #ffffff; margin: 0 0 12px 0; letter-spacing: -0.3px;">
                                            Connect with ${session.user.name}
                                        </h1>
                                        <p style="font-size: 15px; color: #888888; line-height: 1.5; margin: 0 0 24px 0;">
                                            ${session.user.name} has invited you to be friends on MovieLogger. Connect to see their suggestions.
                                        </p>
                                        <div>
                                            <a href="https://movie-logger-two.vercel.app/" style="background-color: #000000; color: #ffffff; padding: 12px 28px; border-radius: 9999px; font-weight: 600; font-size: 14px; text-decoration: none; display: inline-block; border: 1px solid #ffffff;">
                                                Open MovieLogger
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
        } catch (error) {
            console.error("Failed to send friend request email:", error);
        }

        return NextResponse.json({ success: true, message: "Request sent" });
    } catch (error) {
        console.error("Failed to add friend:", error);
        return NextResponse.json({ success: false, error: "Failed to add friend" }, { status: 500 });
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
        const { id, action } = await req.json();

        if (!id || action !== "accept") {
            return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
        }

        const request = await db.select()
            .from(friend)
            .where(
                and(
                    eq(friend.id, id),
                    eq(friend.friendId, session.user.id),
                    eq(friend.status, "pending")
                )
            );

        if (request.length === 0) {
            return NextResponse.json({ success: false, error: "Request not found" }, { status: 404 });
        }

        await db.update(friend)
            .set({ status: "accepted", updatedAt: new Date() })
            .where(eq(friend.id, id));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to accept friend:", error);
        return NextResponse.json({ success: false, error: "Failed to accept friend" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const friendId = searchParams.get("id");

        if (!friendId) {
            return NextResponse.json({ success: false, error: "Missing ID" }, { status: 400 });
        }

        await db.delete(friend)
            .where(
                and(
                    eq(friend.id, friendId),
                    or(eq(friend.userId, session.user.id), eq(friend.friendId, session.user.id))
                )
            );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to remove friend:", error);
        return NextResponse.json({ success: false, error: "Failed to remove friend" }, { status: 500 });
    }
}
