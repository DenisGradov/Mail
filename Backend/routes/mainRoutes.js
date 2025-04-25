const express = require('express');
const axios = require('axios');
const router = express.Router();
const { getUserByToken } = require('../DataBase/functions/getUserByToken');
const { getUserDomains, addDomain, deleteDomain } = require('../DataBase/functions/domainFunctions');

router.post('/check-domains', async (req, res) => {
  const token = req.cookies?.auth_token;
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const user = await getUserByToken(token);
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (user.status !== 2) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { domains } = req.body;
    if (!Array.isArray(domains) || domains.length === 0) {
      return res.status(400).json({ error: 'Invalid or empty domains list' });
    }

    const results = await Promise.all(
      domains.map(async (domain) => {
        try {
          const response = await axios.get(`http://${domain}/health`, {
            timeout: 5000,
            validateStatus: (status) => status < 500,
          });
          if (response.status === 200 && response.data) {
            return { domain, status: 'online', error: null };
          } else {
            return {
              domain,
              status: 'problems',
              error: `Invalid response: ${JSON.stringify(response.data)}`,
            };
          }
        } catch (error) {
          if (error.code === 'ENOTFOUND' || error.message.includes('getaddrinfo')) {
            return { domain, status: 'offline', error: 'Domain not found' };
          }
          return {
            domain,
            status: 'problems',
            error: error.message,
          };
        }
      })
    );

    const resultMap = results.reduce((acc, result) => {
      acc[result.domain] = { status: result.status, error: result.error };
      return acc;
    }, {});

    res.status(200).json({ results: resultMap });
  } catch (error) {
    console.error('Error checking domains:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/add-domain', async (req, res) => {
  const token = req.cookies?.auth_token;
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const user = await getUserByToken(token);
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (user.status !== 2) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { domain } = req.body;
    if (!domain || typeof domain !== 'string' || !domain.match(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      return res.status(400).json({ error: 'Invalid domain format' });
    }

    await addDomain(user.id, domain);
    res.status(201).json({ success: true, domain });
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT') {
      return res.status(400).json({ error: 'Domain already exists' });
    }
    console.error('Error adding domain:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/delete-domain', async (req, res) => {
  const token = req.cookies?.auth_token;
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const user = await getUserByToken(token);
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (user.status !== 2) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { domain } = req.body;
    if (!domain || typeof domain !== 'string') {
      return res.status(400).json({ error: 'Invalid domain' });
    }

    const changes = await deleteDomain(user.id, domain);
    if (changes === 0) {
      return res.status(404).json({ error: 'Domain not found' });
    }
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error deleting domain:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/domains', async (req, res) => {
  const token = req.cookies?.auth_token;
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const user = await getUserByToken(token);
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (user.status !== 2) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const domains = await getUserDomains(user.id);
    res.status(200).json({ domains });
  } catch (err) {
    console.error('Error fetching domains:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;