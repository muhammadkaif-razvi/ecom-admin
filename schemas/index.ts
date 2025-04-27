import { z } from "zod";
import { UserRole } from "@prisma/client";

export const formSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be min 2 characters")
    .max(20, "Name cannot be longer than 20 characters"),
});

export const BillboardformSchema = z.object({
  label: z
    .string()
    .min(1, "Name must be min 2 characters")
    .max(45, "Name cannot be longer than 30 characters"),
  imageUrl: z.string().min(1),
});
export const ingredientFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name must be min 2 characters")
    .max(45, "Name cannot be longer than 30 characters"),
  image: z.string().min(1),
  description: z.string().min(10, "Description must be min 10 characters"),
});

export const CategoryformSchema = z.object({
  name: z
    .string()
    .min(1, "Name must be min 2 characters")
    .max(14, "Name cannot be longer than 14 characters"),
  billboardId: z.string().min(1),
});

export const SizeformSchema = z.object({
  name: z
    .string()
    .min(1, "Name must be min 2 characters")
    .max(25, "Name cannot be longer than 14 characters"),
  value: z.string().min(1, "Value must be min 2 characters"),
});
export const VehicleTypeformSchema = z.object({
  name: z
    .string()
    .min(1, "Name must be min 2 characters")
    .max(25, "Name cannot be longer than 14 characters"),
});

export const ColorformSchema = z.object({
  name: z
    .string()
    .min(1, "Name must be min 2 characters")
    .max(14, "Name cannot be longer than 14 characters"),
  value: z.string().min(3),
});
export const fuelTypeformSchema = z.object({
  name: z
    .string()
    .min(1, "Name must be min 2 characters")
    .max(14, "Name cannot be longer than 14 characters"),
});

export const ProductformSchema = z.object({
  name: z
    .string()
    .min(1, "Name must be min 2 characters")
    .max(80, "Name cannot be longer than 40 characters"),
  images: z
    .array(z.object({ url: z.string() }))
    .min(1, "At least one image is required")
    .max(6, "Maximum 6 images allowed"),
  description: z.string().min(10, "Description must be min 10 characters"),
  categoryId: z.string().min(1, "Category is required"),

  faceId: z.string().min(1, "Face is required").optional().or(z.literal("")),
  hairId: z
    .string()
    .min(1, "Hair Type is required")
    .optional()
    .or(z.literal("")),
  makeupId: z
    .string()
    .min(1, "Makeup Type is required")
    .optional()
    .or(z.literal("")),
  bodyId: z
    .string()
    .min(1, "Body Type is required")
    .optional()
    .or(z.literal("")),
  comboId: z.string().min(1, "Combos is required").optional().or(z.literal("")),
  ingredientId: z
    .string()
    .min(1, "Ingredient is required")
    .optional()
    .or(z.literal("")),
  fragranceId: z
    .string()
    .min(1, "Fragrance is required")
    .optional()
    .or(z.literal("")),
  priceId: z.string().min(1, "Price is required").optional().or(z.literal("")),

  isNewLaunch: z.boolean().default(false).optional(),
  isBestseller: z.boolean().default(false).optional(),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
});
export const variantformSchema = z.object({
  name: z
    .string()
    .min(1, "Name must be min 2 characters")
    .max(80, "Name cannot be longer than 40 characters"),
  images: z
    .array(z.object({ url: z.string() }))
    .min(1, "At least one image is required")
    .max(6, "Maximum 6 images allowed"),
  ingredients: z.array(z.string()).optional().default([]),
  variantsepQuant: z.string().min(1, "Quantity is required"),
  price: z.coerce.number().min(1, "Price is required"),
  inventory: z.coerce.number(),
  productId: z.string().min(1, "Product Type is required").optional(),
});

export const settingsSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters long")
      .max(50, "Name cannot be longer than 50 characters")
      .optional(),

    phonenumber: z
      .string()
      .regex(/^\+91\d{10}$/, "Invalid phone number format")
      .optional(),
    email: z.optional(z.string().email("Invalid email format")),
    password: z.optional(
      z.string().min(6, "Password must be at least 6 characters")
    ),
    newPassword: z.optional(
      z.string().min(6, "Password must be at least 6 characters")
    ),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([UserRole?.ADMIN, UserRole?.USER]).optional(),
  })
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }
      return true;
    },
    {
      message: "Current password is required",
      path: ["password"],
    }
  )
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }
      return true;
    },
    {
      message: "New password is required",
      path: ["newPassword"],
    }
  );

export const NewPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const ResetPasswordEnterSchema = z.object({
  emailOrPhone: z.string().refine(
    (val) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^\+91\d{10}$/;
      return emailRegex.test(val) || phoneRegex.test(val);
    },
    {
      message: "Invalid email or phone number",
    }
  ),
});

export const PhoneResetPassSchema = z.object({
  phonenumber: z.string().regex(/^\+91\d{10}$/, {
    message: "Please enter a valid phone number, e.g. +911234567890",
  }),
  phonenumberotp: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d{6}$/, "OTP must contain only numbers"),
});

export const LoginSchema = z.object({
  emailOrPhone: z.string().refine(
    (val) => {
      // Check if it's a valid email or phone number
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^\+91\d{10}$/; // Example: 10-digit phone number
      return emailRegex.test(val) || phoneRegex.test(val);
    },
    {
      message: "Invalid email or phone number",
    }
  ),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  code: z
    .string()
    .min(6, { message: "Please enter a valid OTP" })
    .max(6, { message: "Please enter a valid OTP" })
    .optional(),
});

export const Step1Schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
});

/**
 * Step 2: Email OTP Verification Schema
 * - User provides the email and the OTP sent to that email.
 */
export const Step2Schema = z.object({
  email: z.string().email("Invalid email format"),
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d{6}$/, "OTP must contain only numbers"),
});

/**
 * Step 3: Phone Registration Schema
 * - User provides their phone number.
 */
export const Step3Schema = z.object({
  email: z.string().email("Invalid email format"),
  phonenumber: z.string().regex(/^\+91\d{10}$/, {
    message: "Please enter a valid phone number, e.g. +911234567890",
  }),
});

/**
 * Step 4: Phone OTP Verification Schema
 * - User provides the phone number and the OTP sent to that phone.
 */
export const Step4Schema = z.object({
  phonenumber: z.string().regex(/^\+91\d{10}$/, {
    message: "Please enter a valid phone number, e.g. +911234567890",
  }),
  // In your form, the field is named "phonenumberotp"
  phonenumberotp: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d{6}$/, "OTP must contain only numbers"),
});

/**
 * Step 5: Complete Registration Schema (Set Password)
 * - After both email and phone have been verified, the user sets their password.
 */
export const Step5Schema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    // If you decide not to use a confirmation field in the UI, you can remove this.
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });
