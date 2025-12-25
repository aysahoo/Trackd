"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignInPage() {
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();

    useEffect(() => {
        if (!isPending && session) {
            router.push("/");
        }
    }, [session, isPending, router]);
    const handleSignIn = async () => {
        await authClient.signIn.social({
            provider: "google",
            callbackURL: "/",
        });
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
                <button
                    onClick={handleSignIn}
                    className="flex items-center gap-3 px-6 py-3 bg-gray-900"
                >
                    <span>Sign in with Google</span>
                </button>
            </div>
    );
}
