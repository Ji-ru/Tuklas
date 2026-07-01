import { Router } from 'express';
import { query } from '../db/index.js';
import crypto from 'crypto';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const { region } = req.query;
    
    let sql = 'SELECT * FROM destinations';
    const params = [];
    
    if (region) {
      sql += ' WHERE LOWER(island_group) = LOWER($1)';
      params.push(region);
    }
    
    sql += ' ORDER BY island_group, region_name, hub_name';
    
    const result = await query(sql, params);
    
    // Generate ETag for conditional caching (SHA-256 for strength)
    const dataString = JSON.stringify(result.rows);
    const etag = crypto.createHash('sha256').update(dataString).digest('hex');
    
    // Check if client has the same ETag
    if (req.headers['if-none-match'] === etag) {
      return res.status(304).end();
    }
    
    // Cache destination data for 5 minutes (relatively static data)
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.setHeader('ETag', etag);
    res.json(result.rows);
    
  } catch (error) {
    next(error);
  }
});

export default router;
