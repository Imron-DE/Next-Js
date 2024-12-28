import { NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request) {
  const { pathname } = request.nextUrl;
  const userToken = request.cookies.get("user_token");
  const isCookiesExist = !!userToken;
  const isAdminToken = userToken === "admin_token"; // Contoh validasi token admin
  const isLoginPage = pathname.startsWith("/login");
  const isRegisterPage = pathname.startsWith("/register");
  const isAdminPage = pathname.startsWith("/admin");

  // Allow only login and register pages if the user is not logged in
  if (!isCookiesExist && !(isLoginPage || isRegisterPage)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Prevent logged-in users from accessing the login or register page
  if (isCookiesExist && (isLoginPage || isRegisterPage)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Restrict access to admin pages for non-admin users
  if (isAdminPage && !isAdminToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
};
