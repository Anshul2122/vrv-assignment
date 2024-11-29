import { Router } from "express";
import {
    changeCurrentPassword,
    deleteUser,
    getCurrentUser,
    loginUser,
    logOutUser,
    refreshAccessToken,
    registerUser,
    updateAccountDetails,
    updateUserAvatar,
} from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {isModerator, isAdmin} from "../middleware/role.middleware.js";

const router = Router();

router.use(isModerator);

router.route("/register").post(
    upload.fields([
        {name:"avatar",
            maxCount:1
        },
    ]),
    RoleAuthorization,
    registerUser);


router.route("/login").post(
    loginUser
)

//secured route
router.route("/logout").post(verifyJWT, logOutUser)

router.route("/refresh-token").post(refreshAccessToken);

router.route("/change-password").post(verifyJWT, changeCurrentPassword);

router.route("/current-user").get(verifyJWT, getCurrentUser);

router.route("/update-account").patch(verifyJWT, updateAccountDetails);

router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

router.route('/delete/:id').delete(isAdmin, isModerator, deleteUser);

export default router;