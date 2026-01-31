const ForumTopic = require('../models/ForumTopic');
const ForumReply = require('../models/ForumReply');

const ALLOWED_CATEGORIES = ['geopolitics', 'monetary_policy', 'trade', 'energy', 'commodities', 'macro'];

async function listTopics(req, res) {
  try {
    const { category, page = 1, limit = 20 } = req.query;
    const query = { deleted: false };
    if (category && ALLOWED_CATEGORIES.includes(category)) {
      query.category = category;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const topics = await ForumTopic.find(query)
      .sort({ pinned: -1, lastReplyAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('author', 'username role');

    const total = await ForumTopic.countDocuments(query);

    res.json({ ok: true, items: topics, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ ok: false, message: 'Failed to fetch topics' });
  }
}

async function createTopic(req, res) {
  try {
    const { title, content, category } = req.body;
    if (!title || !content || !category) {
      return res.status(400).json({ ok: false, message: 'Title, content, and category are required' });
    }
    if (!ALLOWED_CATEGORIES.includes(category)) {
      return res.status(400).json({ ok: false, message: 'Invalid category' });
    }
    const topic = await ForumTopic.create({ title, content, category, author: req.user._id });
    res.status(201).json({ ok: true, item: await topic.populate('author', 'username role') });
  } catch (err) {
    res.status(500).json({ ok: false, message: 'Failed to create topic' });
  }
}

async function getTopic(req, res) {
  try {
    const { id } = req.params;
    const topic = await ForumTopic.findById(id).populate('author', 'username role');
    if (!topic || topic.deleted) {
      return res.status(404).json({ ok: false, message: 'Topic not found' });
    }
    const replies = await ForumReply.find({ topic: id, deleted: false })
      .sort({ createdAt: 1 })
      .populate('author', 'username role');
    res.json({ ok: true, item: topic, replies });
  } catch (err) {
    res.status(500).json({ ok: false, message: 'Failed to fetch topic' });
  }
}

async function addReply(req, res) {
  try {
    const { id } = req.params; // topic id
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ ok: false, message: 'Reply content is required' });
    }
    const topic = await ForumTopic.findById(id);
    if (!topic || topic.deleted) {
      return res.status(404).json({ ok: false, message: 'Topic not found' });
    }
    if (topic.locked) {
      return res.status(403).json({ ok: false, message: 'Topic is locked' });
    }

    const reply = await ForumReply.create({ topic: id, author: req.user._id, content });
    topic.replyCount += 1;
    topic.lastReplyAt = new Date();
    await topic.save();

    res.status(201).json({ ok: true, item: await reply.populate('author', 'username role') });
  } catch (err) {
    res.status(500).json({ ok: false, message: 'Failed to add reply' });
  }
}

async function pinTopic(req, res) {
  try {
    const { id } = req.params;
    const topic = await ForumTopic.findById(id);
    if (!topic || topic.deleted) {
      return res.status(404).json({ ok: false, message: 'Topic not found' });
    }
    topic.pinned = !topic.pinned;
    await topic.save();
    res.json({ ok: true, item: topic });
  } catch (err) {
    res.status(500).json({ ok: false, message: 'Failed to toggle pin' });
  }
}

async function lockTopic(req, res) {
  try {
    const { id } = req.params;
    const topic = await ForumTopic.findById(id);
    if (!topic || topic.deleted) {
      return res.status(404).json({ ok: false, message: 'Topic not found' });
    }
    topic.locked = !topic.locked;
    await topic.save();
    res.json({ ok: true, item: topic });
  } catch (err) {
    res.status(500).json({ ok: false, message: 'Failed to toggle lock' });
  }
}

async function deleteTopic(req, res) {
  try {
    const { id } = req.params;
    const topic = await ForumTopic.findById(id);
    if (!topic) return res.status(404).json({ ok: false, message: 'Topic not found' });

    const isOwner = topic.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin' || req.user.role === 'superadmin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ ok: false, message: 'Not allowed to delete this topic' });
    }

    topic.deleted = true;
    await topic.save();
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, message: 'Failed to delete topic' });
  }
}

async function deleteReply(req, res) {
  try {
    const { id, replyId } = req.params;
    const reply = await ForumReply.findById(replyId);
    if (!reply || reply.topic.toString() !== id) {
      return res.status(404).json({ ok: false, message: 'Reply not found' });
    }

    const isOwner = reply.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin' || req.user.role === 'superadmin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ ok: false, message: 'Not allowed to delete this reply' });
    }

    reply.deleted = true;
    await reply.save();

    // Update counters
    const topic = await ForumTopic.findById(id);
    if (topic) {
      topic.replyCount = Math.max(0, topic.replyCount - 1);
      await topic.save();
    }

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, message: 'Failed to delete reply' });
  }
}

module.exports = {
  listTopics,
  createTopic,
  getTopic,
  addReply,
  pinTopic,
  lockTopic,
  deleteTopic,
  deleteReply,
};