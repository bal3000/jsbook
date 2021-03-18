import express, { Router } from 'express';
import fs from 'fs/promises';

export function createCellsRouter(filename: string, dir: string): Router {
  const router = express.Router();

  router.get('/cells', async (req, res) => {
    // Make sure the cell storage file exists
    // Create if not
    // Read the file
    // Get list of cells
    // Send back to browser
  });

  router.post('/cells', async (req, res) => {
    // Make sure the cell storage file exists
    // Create if not
    // save cells to file
  });

  return router;
}
