const express = require("express");
const router = express.Router();
const controllers = require("../../../controllers/contacts");
const guard = require("../../../helpers/guard");
const {
  validateAddContact,
  validateUpdateContact,
  validateUpdateStatusContact,
  // validateRemoveContact,
  // validateGetByIdContact,
} = require("./validation");
router.get("/", guard, controllers.listContacts);

router.get("/:contactId", guard, controllers.getContactById);

router.post("/", guard, validateAddContact, controllers.addContact);

router.delete("/:contactId", guard, controllers.removeContact);

router.put(
  "/:contactId",
  guard,

  validateUpdateContact,
  controllers.updateContact
);

router.patch(
  "/:contactId/favorite",
  guard,
  validateUpdateStatusContact,
  controllers.updateContact
);

module.exports = router;
