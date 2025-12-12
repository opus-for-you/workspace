import { Router } from "express";
import { requireAuth } from "../auth";
import { storage } from "../storage";
import { insertKeyPersonSchema } from "../../shared/schema";

const router = Router();

// Get all key people for authenticated user
router.get("/", requireAuth, async (req, res) => {
  try {
    const keyPeople = await storage.getKeyPeople(req.user!.id);
    res.json({ keyPeople });
  } catch (error) {
    console.error("Error fetching key people:", error);
    res.status(500).json({ message: "Failed to fetch key people" });
  }
});

// Create single key person
router.post("/", requireAuth, async (req, res) => {
  try {
    const validated = insertKeyPersonSchema.parse(req.body);
    const keyPerson = await storage.createKeyPerson(req.user!.id, validated);
    res.status(201).json({ success: true, keyPerson });
  } catch (error) {
    console.error("Error creating key person:", error);
    res.status(400).json({ message: "Invalid key person data" });
  }
});

// Bulk create (for onboarding - create 3 at once)
router.post("/bulk", requireAuth, async (req, res) => {
  try {
    const { people } = req.body;

    if (!Array.isArray(people) || people.length === 0) {
      return res.status(400).json({ message: "Expected array of people" });
    }

    const created = [];
    for (const person of people) {
      const validated = insertKeyPersonSchema.parse(person);
      const keyPerson = await storage.createKeyPerson(req.user!.id, validated);
      created.push(keyPerson);
    }

    res.status(201).json({ success: true, keyPeople: created, count: created.length });
  } catch (error) {
    console.error("Error bulk creating key people:", error);
    res.status(400).json({ message: "Invalid key people data" });
  }
});

// Update key person
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updated = await storage.updateKeyPerson(id, req.user!.id, updates);

    if (!updated) {
      return res.status(404).json({ message: "Key person not found" });
    }

    res.json({ success: true, keyPerson: updated });
  } catch (error) {
    console.error("Error updating key person:", error);
    res.status(500).json({ message: "Failed to update key person" });
  }
});

// Delete key person
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await storage.deleteKeyPerson(id, req.user!.id);

    if (!deleted) {
      return res.status(404).json({ message: "Key person not found" });
    }

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting key person:", error);
    res.status(500).json({ message: "Failed to delete key person" });
  }
});

export default router;
