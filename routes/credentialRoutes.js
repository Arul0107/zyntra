const router = require("express").Router();
const ctl = require("../controllers/credentialController");

router.post("/", ctl.createCredential);
router.get("/:userId", ctl.getUserCredentials);
router.put("/:id", ctl.updateCredential);
router.delete("/:id", ctl.deleteCredential);

module.exports = router;
