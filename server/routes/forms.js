const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all participants (admin only)
router.get('/participants', auth, async (req, res) => {
  try {
    // Check if user is admin
    const userResult = await pool.query(
      'SELECT role FROM users WHERE id = $1',
      [req.userId]
    );

    if (userResult.rows.length === 0 || userResult.rows[0].role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const result = await pool.query(`
      SELECT 
        u.id, u.email, u.first_name, u.last_name, u.created_at,
        p.ndis_number, p.plan_start_date, p.plan_end_date, p.support_category
      FROM users u
      LEFT JOIN participants p ON u.id = p.user_id
      WHERE u.role = 'participant'
      ORDER BY u.created_at DESC
    `);

    res.json({ participants: result.rows });
  } catch (error) {
    console.error('Get participants error:', error);
    res.status(500).json({ error: 'Failed to get participants' });
  }
});

// Get worker applications (admin only)
router.get('/worker-applications', auth, async (req, res) => {
  try {
    // Check if user is admin
    const userResult = await pool.query(
      'SELECT role FROM users WHERE id = $1',
      [req.userId]
    );

    if (userResult.rows.length === 0 || userResult.rows[0].role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const result = await pool.query(`
      SELECT 
        u.id, u.email, u.first_name, u.last_name, u.created_at,
        sw.application_status, sw.qualifications, sw.experience_years,
        sw.availability, sw.preferred_locations
      FROM users u
      LEFT JOIN support_workers sw ON u.id = sw.user_id
      WHERE u.role = 'support_worker'
      ORDER BY u.created_at DESC
    `);

    res.json({ applications: result.rows });
  } catch (error) {
    console.error('Get worker applications error:', error);
    res.status(500).json({ error: 'Failed to get worker applications' });
  }
});

// Create form submission/assignment
router.post('/submissions', auth, [
  body('participant_id').isUUID(),
  body('form_type').isIn(['service_agreement', 'risk_assessment']),
  body('priority').isIn(['low', 'medium', 'high']).optional(),
  body('due_date').isISO8601().optional()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { participant_id, form_type, priority = 'medium', due_date } = req.body;

    // Check if user is admin
    const userResult = await pool.query(
      'SELECT role FROM users WHERE id = $1',
      [req.userId]
    );

    if (userResult.rows.length === 0 || userResult.rows[0].role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const result = await pool.query(`
      INSERT INTO form_submissions (
        participant_id, form_type, assigned_by, priority, due_date, 
        status, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING *
    `, [participant_id, form_type, req.userId, priority, due_date, 'assigned']);

    res.status(201).json({ submission: result.rows[0] });
  } catch (error) {
    console.error('Create form submission error:', error);
    res.status(500).json({ error: 'Failed to create form submission' });
  }
});

module.exports = router;