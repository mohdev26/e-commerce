
import { diskStorage } from "multer";
import { extname } from "path";
import { existsSync, mkdirSync } from "fs";
import type { Request } from "express";

const uploadPath = "./uploads/categories";

if (!existsSync(uploadPath)) {
  mkdirSync(uploadPath, { recursive: true });
}

export const multerOptions = {
  storage: diskStorage({
    destination: uploadPath,
    filename: (
      req: Request,
      file: Express.Multer.File,
      callback: (error: Error | null, filename: string) => void,
    ) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

      callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
    },
  }),

  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      callback(null, false);
      return;
    }

    callback(null, true);
  },

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
};
