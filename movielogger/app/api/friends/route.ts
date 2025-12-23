import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import db from "@/db";
import { user, friend } from "@/db/schema";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import { eq, and, or, ne } from "drizzle-orm";

export async function GET(req: Request) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    try {
        // Find all friendships where current user is involved
        // This query fetches both confirmed friends and pending requests (where user is the recipient)
        const allFriendships = await db.select({
            id: friend.id,
            friendId: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            status: friend.status,
            requesterId: friend.userId, // needed to know who sent the request
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

        // Find the user by email
        const [targetUser] = await db.select().from(user).where(eq(user.email, email));

        if (!targetUser) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }

        // Check if friendship already exists
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

        // Create friendship (pending)
        const id = nanoid();
        await db.insert(friend).values({
            id,
            userId: session.user.id,
            friendId: targetUser.id,
            status: "pending",
        });

        // We don't return the full friend object here because it's just a request now
        // But the UI might expect some confirmation
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
        const { id, action } = await req.json(); // id is the friendship ID

        if (!id || action !== "accept") {
            return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
        }

        // Verify this request is intended for the current user
        const request = await db.select()
            .from(friend)
            .where(
                and(
                    eq(friend.id, id),
                    eq(friend.friendId, session.user.id), // Must be the recipient
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
        const friendId = searchParams.get("id"); // This expects the friend RELATIONSHIP id, or the FRIEND USER ID?
        // UI uses `handleRemoveFriend(friend.id)`. 
        // In GET, I returned `id` as `friend.id` (the relationship ID).

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
