import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../auth";
import { storage } from "../storage";
import { generatePurposeSummary } from "../lib/ai-mvp";

const router = Router();

// Save purpose prompts and generate summary
router.post("/purpose", requireAuth, async (req, res) => {
  try {
    const schema = z.object({
      prompt1: z.string().min(10, "Prompt 1 must be at least 10 characters"),
      prompt2: z.string().min(10, "Prompt 2 must be at least 10 characters"),
      prompt3: z.string().min(10, "Prompt 3 must be at least 10 characters"),
    });

    const { prompt1, prompt2, prompt3 } = schema.parse(req.body);

    // Generate AI summary
    const purposeSummary = await generatePurposeSummary(prompt1, prompt2, prompt3);

    // Update user with prompts and summary
    const updatedUser = await storage.updateUser(req.user!.id, {
      purposePrompt1: prompt1,
      purposePrompt2: prompt2,
      purposePrompt3: prompt3,
      purposeSummary,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return user without password
    const { password, ...safeUser } = updatedUser;

    res.json({
      success: true,
      purposeSummary,
      user: safeUser,
      message: "Purpose saved and summary generated",
    });
  } catch (error: any) {
    console.error("Error saving purpose:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    res.status(400).json({ message: "Failed to save purpose" });
  }
});

// Save method/workstyle profile
router.post("/method", requireAuth, async (req, res) => {
  try {
    const schema = z.object({
      workstyleBest: z.string().min(1, "Please select how you work best"),
      workstyleStuck: z.string().optional(),
    });

    const { workstyleBest, workstyleStuck } = schema.parse(req.body);

    // Update user with workstyle profile
    const updatedUser = await storage.updateUser(req.user!.id, {
      workstyleBest,
      workstyleStuck: workstyleStuck || null,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return user without password
    const { password, ...safeUser } = updatedUser;

    res.json({
      success: true,
      user: safeUser,
      message: "Workstyle profile saved",
    });
  } catch (error: any) {
    console.error("Error saving method:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    res.status(400).json({ message: "Failed to save workstyle" });
  }
});

export default router;
