import express, { Router } from 'express';
import { promises as fsp } from 'fs';
import path from 'path';

interface Cell {
  id: string;
  content: string;
  type: 'text' | 'code';
}

export function createCellsRouter(filename: string, dir: string): Router {
  const router = express.Router();
  router.use(express.json());

  const fullPath = path.join(dir, filename);

  router.get('/cells', async (req, res) => {
    try {
      // Read the file
      const file = await fsp.readFile(fullPath, { encoding: 'utf-8' });
      // Get list of cells
      // Send back to browser
      res.status(200).send(JSON.parse(file));
    } catch (err) {
      if (err.code === 'ENOENT') {
        // If file does not exist, create
        await fsp.writeFile(fullPath, '[]', 'utf-8');
        res.status(200).send([]);
      } else {
        throw err;
      }
    }
  });

  router.post('/cells', async (req, res) => {
    // save cells to file
    const { cells }: { cells: Cell[] } = req.body;
    const data = JSON.stringify(cells);

    await fsp.writeFile(fullPath, data, 'utf-8');

    res.send({ status: 'ok' });
  });

  return router;
}
