// ─────────────────────────────────────────────────────────────
// CredChain Backend — API router
// All 14 endpoints mounted under "/api".
// Auth / Users / Issuing / Validation / Chat return mock 200 JSON.
// AI endpoints proxy to the local FastAPI microservices via axios.
// ─────────────────────────────────────────────────────────────

const express = require('express');
const axios = require('axios');

const router = express.Router();

// Downstream AI microservice base URLs.
const AI_CV_ENGINE_URL = process.env.AI_CV_ENGINE_URL || 'http://localhost:8001';
const AI_INSIGHTS_ENGINE_URL = process.env.AI_INSIGHTS_ENGINE_URL || 'http://localhost:8002';

// ── AUTH ─────────────────────────────────────────────────────

// POST /api/auth/register — register a new user (student / issuer / employer).
router.post('/auth/register', (req, res) => {
  const { name, email, role } = req.body || {};
  res.status(200).json({
    success: true,
    message: 'User registered successfully (mock).',
    user: {
      id: 'usr_mock_0001',
      name: name || 'New User',
      email: email || 'user@example.com',
      role: role || 'student',
      credchainId: 'cc_mock_0001',
      createdAt: new Date().toISOString(),
    },
    token: 'mock.jwt.token',
  });
});

// POST /api/auth/login — login and receive a JWT.
router.post('/auth/login', (req, res) => {
  const { email } = req.body || {};
  res.status(200).json({
    success: true,
    message: 'Login successful (mock).',
    user: {
      id: 'usr_mock_0001',
      email: email || 'user@example.com',
      role: 'student',
      credchainId: 'cc_mock_0001',
    },
    token: 'mock.jwt.token',
    expiresIn: '7d',
  });
});

// ── USERS / STUDENTS ─────────────────────────────────────────

// GET /api/student/:id — get a student's profile and credentials.
router.get('/student/:id', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Student profile fetched (mock).',
    student: {
      id: req.params.id,
      name: 'Mock Student',
      credchainId: 'cc_mock_0001',
      bio: 'Aspiring blockchain developer.',
      skills: ['JavaScript', 'Solana', 'React'],
      credentials: [
        {
          id: 'cred_mock_0001',
          title: 'Full-Stack Web Development',
          issuer: 'Mock University',
          status: 'accepted',
          txSignature: 'mockSignature1111',
        },
      ],
    },
  });
});

// PUT /api/student/profile — update bio, skills, links.
router.put('/student/profile', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Profile updated successfully (mock).',
    updated: req.body || {},
  });
});

// GET /api/student/profile/:credchainId — public profile page (QR link target).
router.get('/student/profile/:credchainId', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Public profile fetched (mock).',
    profile: {
      credchainId: req.params.credchainId,
      name: 'Mock Student',
      headline: 'Verified on CredChain',
      skills: ['JavaScript', 'Solana', 'React'],
      credentials: [
        {
          id: 'cred_mock_0001',
          title: 'Full-Stack Web Development',
          issuer: 'Mock University',
          status: 'accepted',
          txSignature: 'mockSignature1111',
          explorerUrl: 'https://explorer.solana.com/tx/mockSignature1111?cluster=devnet',
        },
      ],
    },
  });
});

// ── ISSUING ──────────────────────────────────────────────────

// POST /api/issuer/verify — submit issuer organisation for verification.
router.post('/issuer/verify', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Issuer verification request submitted (mock).',
    issuer: {
      id: 'iss_mock_0001',
      organisation: (req.body && req.body.organisation) || 'Mock Organisation',
      status: 'pending',
    },
  });
});

// POST /api/issuer/issueCredential — issue a credential to a student.
router.post('/issuer/issueCredential', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Credential issued successfully (mock).',
    credential: {
      id: 'cred_mock_0002',
      title: (req.body && req.body.title) || 'Mock Credential',
      issuer: (req.body && req.body.issuer) || 'Mock University',
      studentId: (req.body && req.body.studentId) || 'usr_mock_0001',
      status: 'pending',
      createdAt: new Date().toISOString(),
    },
  });
});

// ── VALIDATION (accept / reject) ─────────────────────────────

// POST /api/credential/accept/:id — student accepts → hash written to Solana.
router.post('/credential/accept/:id', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Credential accepted and recorded on Solana (mock).',
    credential: {
      id: req.params.id,
      status: 'accepted',
      hash: 'a'.repeat(64),
      txSignature: 'mockSignature2222',
      explorerUrl: 'https://explorer.solana.com/tx/mockSignature2222?cluster=devnet',
    },
  });
});

// POST /api/credential/reject/:id — student rejects credential.
router.post('/credential/reject/:id', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Credential rejected (mock).',
    credential: {
      id: req.params.id,
      status: 'rejected',
    },
  });
});

// ── CHAT ─────────────────────────────────────────────────────

// POST /api/chat/send — send a chat message (also relayed via Socket.io).
router.post('/chat/send', (req, res) => {
  const { from, to, text } = req.body || {};
  const message = {
    id: 'msg_mock_0001',
    from: from || 'usr_mock_0001',
    to: to || 'usr_mock_0002',
    text: text || 'Hello from CredChain (mock).',
    createdAt: new Date().toISOString(),
  };

  // Relay in realtime if a Socket.io instance is available.
  const io = req.app.get('io');
  if (io && message.to) {
    io.to(String(message.to)).emit('chat:message', message);
  }

  res.status(200).json({
    success: true,
    message: 'Message sent (mock).',
    data: message,
  });
});

// GET /api/chat/history/:userId — load previous messages.
router.get('/chat/history/:userId', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Chat history fetched (mock).',
    userId: req.params.userId,
    messages: [
      {
        id: 'msg_mock_0001',
        from: 'usr_mock_0002',
        to: req.params.userId,
        text: 'Welcome to CredChain!',
        createdAt: new Date().toISOString(),
      },
    ],
  });
});

// ── AI PROXY ENDPOINTS ───────────────────────────────────────

// POST /api/ai/generateCV — forward to the CV engine (FastAPI, port 8001).
router.post('/ai/generateCV', async (req, res) => {
  try {
    const { data } = await axios.post(
      `${AI_CV_ENGINE_URL}/generate-cv`,
      req.body || {},
      { headers: { 'Content-Type': 'application/json' }, timeout: 30000 }
    );
    res.status(200).json({ success: true, source: 'ai-cv-engine', data });
  } catch (err) {
    const status = err.response?.status || 502;
    console.error('[proxy:generateCV]', err.message);
    res.status(status).json({
      success: false,
      message: 'Failed to reach ai-cv-engine.',
      error: err.response?.data || err.message,
    });
  }
});

// POST /api/ai/analyzeSkills — forward to the insights engine (FastAPI, port 8002).
router.post('/ai/analyzeSkills', async (req, res) => {
  try {
    const { data } = await axios.post(
      `${AI_INSIGHTS_ENGINE_URL}/analyze-skills`,
      req.body || {},
      { headers: { 'Content-Type': 'application/json' }, timeout: 30000 }
    );
    res.status(200).json({ success: true, source: 'ai-insights-engine', data });
  } catch (err) {
    const status = err.response?.status || 502;
    console.error('[proxy:analyzeSkills]', err.message);
    res.status(status).json({
      success: false,
      message: 'Failed to reach ai-insights-engine.',
      error: err.response?.data || err.message,
    });
  }
});

module.exports = router;
