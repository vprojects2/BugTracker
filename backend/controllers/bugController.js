const Bug = require('../models/Bug');
const User = require('../models/User');
const logActivity = require('../utils/logActivity');


// @desc    Create a bug
// @route   POST /api/bugs
// @access  Protected (tester, admin)
const createBug = async (req, res) => {
  try {
    const bug = await Bug.create({
      title: req.body.title,
      description: req.body.description,
      priority: req.body.priority,
      createdBy: req.user.id
    });
    res.status(201).json(bug);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

// @desc    Get all bugs
// @route   GET /api/bugs
// @access  Protected
// @desc Get all bugs with filters, search, sorting (Admin only)
// @route GET /api/bugs
// @access Protected (admin/dev/tester view filtered)
const getAllBugs = async (req, res) => {
    try {
      const queryObj = {};
      const { status, priority, createdBy, assignedTo, sortBy, order, page, limit } = req.query;
  
      // Filters
      if (status) queryObj.status = status;
      if (priority) queryObj.priority = priority;
      if (createdBy) queryObj.createdBy = createdBy;
      if (assignedTo) queryObj.assignedTo = assignedTo;
  
      // Pagination defaults
      const pageNumber = Number(page) || 1;
      const pageSize = Number(limit) || 10;
      const skip = (pageNumber - 1) * pageSize;
  
      // Sorting
      const sortField = sortBy || 'createdAt';
      const sortOrder = order === 'asc' ? 1 : -1;
  
      const bugs = await Bug.find(queryObj)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(pageSize)
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email');
  
      res.json(bugs);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server Error' });
    }
  };
  

// @desc    Update a bug
// @route   PUT /api/bugs/:id
// @access  Protected (admin/dev)
const updateBug = async (req, res) => {
  try {
    const bug = await Bug.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    res.json(bug);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

// @desc    Delete a bug
// @route   DELETE /api/bugs/:id
// @access  Protected (admin only)
const deleteBug = async (req, res) => {
  try {
    await Bug.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Bug deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// @desc Get bugs created by current user
// @route GET /api/bugs/my-created
// @access Protected
const getMyCreatedBugs = async (req, res) => {
    try {
      const bugs = await Bug.find({ createdBy: req.user.id });
      res.json(bugs);
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  };
  
  // @desc Get bugs assigned to current user
  // @route GET /api/bugs/my-assigned
  // @access Protected (devs)
  const getMyAssignedBugs = async (req, res) => {
    try {
      const bugs = await Bug.find({ assignedTo: req.user.id });
      res.json(bugs);
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  };

  // @desc Add a comment to a bug
// @route POST /api/bugs/:id/comments
// @access Protected
const addCommentToBug = async (req, res) => {
    const { message } = req.body;
  
    try {
      const bug = await Bug.findById(req.params.id);
      if (!bug) return res.status(404).json({ msg: 'Bug not found' });
  
      const newComment = {
        user: req.user.id,
        message
      };
  
      bug.comments.push(newComment);

      logActivity(bug, {
        action: 'Commented',
        message: `Added a comment: "${text.trim().slice(0, 30)}..."`,
        userId: req.user.id
      });
      await bug.save();
  
      res.status(201).json({ msg: 'Comment added', comments: bug.comments });
    } catch (err) {
      res.status(500).json({ msg: 'Server Error' });
    }
  };

// @desc Upload a screenshot to a bug
// @route POST /api/bugs/:id/upload
// @access Protected
const uploadBugFile = async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id);
    if (!bug) return res.status(404).json({ msg: 'Bug not found' });

    if (req.file) {
      bug.screenshot = req.file.path;
      await bug.save();
      res.status(200).json({ msg: 'File uploaded', path: bug.screenshot });
    } else {
      res.status(400).json({ msg: 'No file uploaded' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// @desc    Get bug statistics
// @route   GET /api/bugs/stats
// @access  Private (all roles)
const getBugStats = async (req, res) => {
  const userId = req.user.id;

  try {
    const totalBugs = await Bug.countDocuments();

    const openBugs = await Bug.countDocuments({ status: 'open' });

    const bugsByPriority = await Bug.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 },
        },
      },
    ]);

    const bugsAssignedToMe = await Bug.countDocuments({ assignedTo: userId });

    const formattedPriorities = {};
    bugsByPriority.forEach(p => {
      formattedPriorities[p._id] = p.count;
    });

    res.status(200).json({
      totalBugs,
      openBugs,
      bugsAssignedToMe,
      bugsByPriority: formattedPriorities,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error while fetching stats' });
  }
};

// @desc    Assign bug to a developer
// @route   PUT /api/bugs/:id/assign
// @access  Private (admin only)
const assignBug = async (req, res) => {
  const { developerId } = req.body;

  try {
    const bug = await Bug.findById(req.params.id);
    if (!bug) return res.status(404).json({ msg: 'Bug not found' });

    const devUser = await User.findById(developerId);
    if (!devUser || devUser.role !== 'developer') {
      return res.status(400).json({ msg: 'Invalid developer ID' });
    }

    bug.assignedTo = developerId;
    await bug.save();

    res.status(200).json({ msg: 'Bug assigned successfully', bug });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};



  
  

module.exports = { createBug, getAllBugs, updateBug, deleteBug, getMyCreatedBugs, getMyAssignedBugs, addCommentToBug, uploadBugFile, getBugStats, assignBug };
