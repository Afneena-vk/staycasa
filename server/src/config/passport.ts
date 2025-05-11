// import passport from 'passport';
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// import dotenv from 'dotenv';
// import { findOrCreateUser, findUserById } from '../repositories/userRepository'; // You create this logic

// dotenv.config();

// passport.use(
//     new GoogleStrategy(
//       {
//         clientID: process.env.GOOGLE_CLIENT_ID!,
//         clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//         callbackURL: process.env.GOOGLE_CALLBACK_URL!, // e.g., http://localhost:3000/auth/google/callback
//         scope: ['profile', 'email'], 
//       },
//       async (accessToken, refreshToken, profile, done) => {
//         try {
//           // You implement this logic using your repository pattern
//           const user = await findOrCreateUser(profile);
//           return done(null, user);
//         } catch (error) {
//           console.error('Error in Google Strategy:', error);
//           return done(error, false);
//         }
//       }
//     )
//   );
//   passport.serializeUser((user: any, done) => {
//     done(null, user.id);
//   });
  
//   passport.deserializeUser(async (id: string, done) => {
//     try {
//       // Fetch user by ID from your DB
//       const user = await findUserById(id); // implement in repo
//       done(null, user);
//     } catch (error) {
//       done(error, null);
//     }
//   });
//   export default passport;
  
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import User from "../models/userModel";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({
          email: profile.emails?.[0].value,
        });

        if (existingUser) {
          if (!existingUser.googleId) {
            existingUser.googleId = profile.id;
            await existingUser.save();
          }
          return done(null, existingUser);
        }

        const newUser = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails?.[0].value,
          password: "",
          isVerified: true,
        });

        return done(null, newUser);
      } catch (error) {
        console.error("Google Strategy Error", error);
        return done(error as Error);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;