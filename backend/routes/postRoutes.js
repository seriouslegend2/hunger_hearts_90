import express from 'express';
import { createPost , getPosts , getAllPosts} from "../controllers/postController.js";

const router = express.Router();

router.get('/getPosts', getPosts);
router.get('/getAllPosts', getAllPosts);

router.post('/createPost',createPost);

export default router;