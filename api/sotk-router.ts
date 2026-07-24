import { Router } from 'express';
import { db } from './context';
import { sotkTable } from '../db/schema';
import { eq, asc } from 'drizzle-orm';

export const sotkRouter = Router();

/**
 * GET /api/sotk
 * Retrieves all SOTK nodes ordered by hierarchy
 */
sotkRouter.get('/api/sotk', async (req, res) => {
  try {
    const nodes = await db
      .select()
      .from(sotkTable)
      .where(eq(sotkTable.status, 'active'))
      .orderBy(asc(sotkTable.urutan_tampil));

    res.json(nodes);
  } catch (error) {
    console.error('Error fetching SOTK data:', error);
    res.status(500).json({
      error: 'Failed to fetch SOTK data',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/sotk/:id
 * Retrieves a specific SOTK node by ID
 */
sotkRouter.get('/api/sotk/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const nodeId = parseInt(id, 10);

    if (isNaN(nodeId)) {
      return res.status(400).json({ error: 'Invalid node ID' });
    }

    const node = await db
      .select()
      .from(sotkTable)
      .where(eq(sotkTable.id, nodeId))
      .limit(1);

    if (node.length === 0) {
      return res.status(404).json({ error: 'Node not found' });
    }

    res.json(node[0]);
  } catch (error) {
    console.error('Error fetching SOTK node:', error);
    res.status(500).json({
      error: 'Failed to fetch SOTK node',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/sotk/tree
 * Retrieves SOTK data structured as a tree
 */
sotkRouter.get('/api/sotk/tree', async (req, res) => {
  try {
    // Fetch all active nodes
    const flatNodes = await db
      .select()
      .from(sotkTable)
      .where(eq(sotkTable.status, 'active'))
      .orderBy(asc(sotkTable.urutan_tampil));

    // Build tree structure
    const nodeMap = new Map<number, any>();
    const roots: any[] = [];

    // Create all nodes
    flatNodes.forEach((node) => {
      nodeMap.set(node.id, {
        ...node,
        children: [],
      });
    });

    // Establish parent-child relationships
    flatNodes.forEach((node) => {
      const treeNode = nodeMap.get(node.id);
      
      if (node.parent_id === null || node.parent_id === 0) {
        roots.push(treeNode);
      } else {
        const parent = nodeMap.get(node.parent_id);
        if (parent) {
          parent.children.push(treeNode);
        } else {
          roots.push(treeNode);
        }
      }
    });

    // Sort children by urutan_tampil
    const sortChildren = (node: any) => {
      node.children.sort((a: any, b: any) => a.urutan_tampil - b.urutan_tampil);
      node.children.forEach(sortChildren);
    };

    roots.forEach(sortChildren);

    res.json(roots);
  } catch (error) {
    console.error('Error building SOTK tree:', error);
    res.status(500).json({
      error: 'Failed to build SOTK tree',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});