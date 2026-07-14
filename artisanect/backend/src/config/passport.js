import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { prisma } from "../lib/prisma.js";

/**
 * Google OAuth Strategy
 *
 * Flow:
 *  1. User clicks "Login with Google" → GET /api/auth/google
 *  2. Passport redirects to Google consent screen
 *  3. Google redirects back to /api/auth/google/callback with a code
 *  4. Passport exchanges the code for a profile
 *  5. We find or create a User row in the database
 *  6. Auth controller generates a JWT and redirects to the frontend
 */
passport.use(
  new GoogleStrategy(
    {
      clientID:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:  process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/api/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email    = profile.emails?.[0]?.value;
        const googleId = profile.id;
        const name     = profile.displayName || email?.split("@")[0] || "Google User";

        if (!email) {
          return done(new Error("No email returned from Google. Make sure your Google account has an email."), null);
        }

        // 1. Try to find by googleId first (returning user)
        let user = await prisma.user.findUnique({ where: { googleId } });

        if (!user) {
          // 2. Try to find by email (user registered normally, now linking Google)
          user = await prisma.user.findUnique({ where: { email } });

          if (user) {
            // Link the Google ID to the existing account
            user = await prisma.user.update({
              where: { id: user.id },
              data:  { googleId },
            });
          } else {
            // 3. Brand new user — create an account (CUSTOMER by default)
            user = await prisma.user.create({
              data: {
                name,
                email,
                googleId,
                password: null, // Google users don't have a password
                role:     "CUSTOMER",
              },
            });
          }
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Passport requires serialize/deserialize even if we don't use sessions
// for the main auth flow — we just need it to not crash.
passport.serializeUser((user, done)   => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
