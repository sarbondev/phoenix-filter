import { z } from "zod";

export const oemSearchSchema = z.object({
  query: z.string().min(1).max(200),
  page: z.number().int().min(1).default(1).optional(),
  limit: z.number().int().min(1).max(60).default(24).optional(),
});

export const analogSearchSchema = z.object({
  query: z.string().min(1).max(200),
  manufacturer: z.string().max(100).optional(),
  page: z.number().int().min(1).default(1).optional(),
  limit: z.number().int().min(1).max(60).default(24).optional(),
});

export const sizeSearchSchema = z.object({
  height: z.number().min(0).optional(),
  outerDiameter: z.number().min(0).optional(),
  innerDiameter: z.number().min(0).optional(),
  threadSize: z.string().max(40).optional(),
  /** Tolerance in mm applied to numeric size fields. */
  tolerance: z.number().min(0).max(50).default(5).optional(),
  page: z.number().int().min(1).default(1).optional(),
  limit: z.number().int().min(1).max(60).default(24).optional(),
});

export const machineSearchSchema = z.object({
  machineBrand: z.string().min(1).max(100),
  model: z.string().max(100).optional(),
  engine: z.string().max(100).optional(),
  year: z.string().max(10).optional(),
  page: z.number().int().min(1).default(1).optional(),
  limit: z.number().int().min(1).max(60).default(24).optional(),
});

export const photoSearchSchema = z.object({
  phoneNumber: z.string().min(5).max(30),
  name: z.string().max(200).optional(),
  note: z.string().max(2000).optional(),
  imageUrl: z.string().min(1).max(500),
  locale: z.string().max(8).optional(),
});

export type OemSearchDto = z.infer<typeof oemSearchSchema>;
export type AnalogSearchDto = z.infer<typeof analogSearchSchema>;
export type SizeSearchDto = z.infer<typeof sizeSearchSchema>;
export type MachineSearchDto = z.infer<typeof machineSearchSchema>;
export type PhotoSearchDto = z.infer<typeof photoSearchSchema>;
