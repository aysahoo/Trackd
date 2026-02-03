"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { GoogleLogo, Spinner } from "@phosphor-icons/react";
import { useTheme } from "next-themes";

export default function SignInPage() {
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();
    const { resolvedTheme } = useTheme();
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!isPending && session) {
            router.push("/app");
        }
    }, [session, isPending, router]);

    const handleSignIn = async () => {
        setIsSigningIn(true);
        await authClient.signIn.social({
            provider: "google",
            callbackURL: "/app",
        });
    };

    if (isPending || !mounted) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Spinner className="animate-spin text-zinc-400" size={24} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
            <div className="flex flex-col items-center">
                {/* Logo */}
                <div className="w-12 h-12 mb-6 relative">
                    <Image
                        src={resolvedTheme === 'dark' ? '/logo_dark.png' : '/logo_light.png'}
                        alt="Trackd"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>



                {/* Google Sign-in button */}
                <button
                    onClick={handleSignIn}
                    disabled={isSigningIn}
                    className="flex items-center justify-center gap-2.5 px-5 py-2.5 min-w-[140px] bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 rounded-lg text-sm hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
                >
                    {isSigningIn ? (
                        <Spinner className="animate-spin" size={18} />
                    ) : (
                        <GoogleLogo size={18} weight="bold" />
                    )}
                    <span>{isSigningIn ? 'Signing in...' : 'Sign in'}</span>
                </button>
            </div>
        </div>
    );
}
