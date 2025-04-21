import { type NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth";

// Define public routes that dont't require authentication
const publicRoutes = ["/", "/login", "/register"];
// Rediect to home for any onther unrecognized routes
const validRoutes = ["/", "/profile", "/proposal", "/result", "/final"]

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = await auth();

  // Check if the path is a public route
  const isPublicRoute = publicRoutes.includes(pathname);

  // For unauthenticated users trying to access protected routes
  if (!session?.user && !isPublicRoute) {
    // Redirect to login
    const response = NextResponse.redirect(new URL("/login", req.url), { status: 303 });
    response.headers.set('x-middleware-cache', 'no-cache');
    return response;
  }

  // Check if the path is a valid route
  const isValidRoute = validRoutes.includes(pathname);

  // For authenticated users trying to access invalid routes
  if (session?.user && !isValidRoute) {
    // Redirect to home
    const response = NextResponse.redirect(new URL("/", req.url), { status: 303 });
    response.headers.set('x-middleware-cache', 'no-cache');
    return response;
  }

  const progress = session?.user.progress;

  // Handle specific page based on progress
  // Prevent all access when profile is incomplete except profile
  if (session?.user && pathname === "/" && !progress?.completeProfile) {
    const response = NextResponse.redirect(new URL("/profile", req.url), { status: 303});
    response.headers.set('x-middleware-cache', 'no-cache');
    return response;
  }

  // Prevent access to proposal if profile incomplete
  if (pathname === "/proposal" && !progress?.completeProfile) {
    const response = NextResponse.redirect(new URL("/profile", req.url), { status: 303});
    response.headers.set('x-middleware-cache', 'no-cache');
    return response;
  }

  // Prevent aeccess to result if proposal not completed
  if (pathname === "/result" && !progress?.canAccessResult) {
    const response = NextResponse.redirect(new URL("/proposal", req.url), { status: 303});
    response.headers.set('x-middleware-cache', 'no-cache');
    return response;
  }

  // Prevent access to final if result not completed
  if (pathname === "/final" && !progress?.canAccessFinal) {
    const response = NextResponse.redirect(new URL("/result", req.url), { status: 303});
    response.headers.set('x-middleware-cache', 'no-cache');
    return response;
  }
  

  return NextResponse.next();
}

// Configuration matcher for routes that need protection
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|assets|favicon.ico).*)',
  ]
};