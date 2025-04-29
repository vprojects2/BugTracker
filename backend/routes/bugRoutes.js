const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');


const {
  createBug,
  getAllBugs,
  updateBug,
  deleteBug,
  getMyCreatedBugs,
  getMyAssignedBugs,
  addCommentToBug,
  uploadBugFile,
  getBugStats,
  assignBug
} = require('../controllers/bugController');

const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

// Create + View All Bugs
router
  .route('/')
  .post(protect, authorizeRoles('tester', 'admin'), createBug)
  .get(protect, getAllBugs);

// Update + Delete Bug by ID
router
  .route('/:id')
  .put(protect, authorizeRoles('admin', 'developer'), updateBug)
  .delete(protect, authorizeRoles('admin'), deleteBug);

// ✅ View bugs created by logged-in user
router.get('/my-created', protect, authorizeRoles('admin', 'developer', 'tester'), getMyCreatedBugs);

// ✅ View bugs assigned to logged-in developer
router.get('/my-assigned', protect, authorizeRoles('developer'), getMyAssignedBugs);

router.post('/:id/comments', protect, addCommentToBug);

router.post('/:id/upload', protect, upload.single('file'), uploadBugFile);

router.get('/stats', protect, getBugStats);

router.put('/:id/assign', protect, authorizeRoles('admin'), assignBug);


module.exports = router;
