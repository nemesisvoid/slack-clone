import { convexAuthNextjsMiddleware, createRouteMatcher, isAuthenticatedNextjs, nextjsMiddlewareRedirect } from '@convex-dev/auth/nextjs/server';

const isPublic = createRouteMatcher(['/auth']);

export default convexAuthNextjsMiddleware(request => {
  if (!isPublic(request) && !isAuthenticatedNextjs()) {
    return nextjsMiddlewareRedirect(request, '/auth');
  }
  if (isPublic(request) && isAuthenticatedNextjs()) {
    return nextjsMiddlewareRedirect(request, '/');
  }
});

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
