import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export default clerkMiddleware({
  afterAuth(auth, req) {
    const publicRoutes = ['/', '/sign-in', '/sign-up', '/about', '/contact']; // Add your actual public routes

    const isPublicRoute = publicRoutes.some(route => req.nextUrl.pathname === route || req.nextUrl.pathname.startsWith(`${route}/`));

    // If the user is not signed in and tries to access a protected route,
    // redirect them to the sign-in page.
    // Use auth.redirectToSignIn() which is available within the auth object
    if (!auth.userId && !isPublicRoute) {
      return auth.redirectToSignIn({ returnBackUrl: req.url });
    }

    // --- Role-based access control for /admin routes ---
    if (req.nextUrl.pathname.startsWith("/admin")) {
      if (auth.userId && auth.sessionClaims?.public_metadata?.role !== 'admin') {
        const url = new URL(req.nextUrl.origin);
        return NextResponse.redirect(url);
      }
    }

    return NextResponse.next();
  },
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};