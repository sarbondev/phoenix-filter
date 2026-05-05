import { Schema, model } from "mongoose";
import { z } from "zod";
import { IUser } from "./user.entity";

// ─── Mongoose Schema ──────────────────────────────────────────────────────────

const userMongoSchema = new Schema<IUser>(
  {
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
    name: { type: String, required: true, trim: true },
    role: {
      type: String,
      enum: ["ADMIN", "CALL_MANAGER", "CLIENT"],
      default: "CLIENT",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userMongoSchema.index({ phoneNumber: 1 });

export const UserModel = model<IUser>("User", userMongoSchema);

// ─── Zod Validation Schemas ───────────────────────────────────────────────────

// Public registration — role is NEVER accepted from the client.
export const createUserSchema = z.object({
  phoneNumber: z
    .string()
    .regex(/^\+\d{12}$/, "Phone number must be like +998901234567"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[0-9]/, "Must contain a number"),
  name: z.string().min(2).max(100),
}).strict();

export type CreateUserDto = z.infer<typeof createUserSchema>;

// Admin-only user creation — accepts role; mounted under POST /api/users
// behind authenticate + authorize('ADMIN').
export const adminCreateUserSchema = createUserSchema.extend({
  role: z.enum(["ADMIN", "CALL_MANAGER", "CLIENT"]).default("CLIENT"),
}).strict();
export type AdminCreateUserDto = z.infer<typeof adminCreateUserSchema>;

export const updateUserSchema = createUserSchema
  .partial()
  .omit({ password: true });
export type UpdateUserDto = z.infer<typeof updateUserSchema>;

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phoneNumber: z
    .string()
    .regex(/^\+\d{12}$/, "Phone number must be like +998901234567")
    .optional(),
  // Required when phoneNumber changes; ignored otherwise. Prevents account
  // takeover via stolen session by re-verifying possession of the password.
  currentPassword: z.string().min(1).optional(),
}).strict();
export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[0-9]/, "Must contain a number"),
});
export type ChangePasswordDto = z.infer<typeof changePasswordSchema>;

export const loginSchema = z.object({
  phoneNumber: z
    .string()
    .regex(/^\+\d{12}$/, "Phone number must be like +998901234567"),
  password: z.string().min(1, "Password is required"),
});
export type LoginDto = z.infer<typeof loginSchema>;
