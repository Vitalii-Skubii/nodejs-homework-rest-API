const express = require("express");
const router = express.Router();
const Contacts = require("../../model/index");
const {
  validateAddContact,
  validateUpdateContact,
  validateUpdateStatusContact,
  // validateRemoveContact,
  // validateGetByIdContact,
} = require("./validation");
router.get("/", async (req, res, next) => {
  try {
    const contacts = await Contacts.listContacts();
    return res.json({ status: "success", code: 200, data: { contacts } });
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const contact = await Contacts.getContactById(req.params.contactId);
    console.log(contact.fullName);
    console.log(contact.id);
    if (contact) {
      return res
        .status(200)
        .json({ status: "success", code: 200, data: contact });
    }
    return res
      .status(404)
      .json({ status: "error", code: 404, message: "Not found" });
  } catch (error) {
    next(error);
  }
});

router.post("/", validateAddContact, async (req, res, next) => {
  try {
    const contacts = await Contacts.addContact(req.body);
    return res
      .status(201)
      .json({ status: "success", code: 201, data: { contacts } });
  } catch (error) {
    if (error.name === "ValidationError") {
      error.status = 400;
    }
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const contact = await Contacts.removeContact(req.params.contactId);

    if (contact) {
      return res
        .status(200)
        .json({ status: "success", code: 200, message: "contact was removed" });
    }
    return res
      .status(404)
      .json({ status: "error", code: 404, message: "contact was not removed" });
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", validateUpdateContact, async (req, res, next) => {
  try {
    const contact = await Contacts.updateContact(
      req.params.contactId,
      res.body
    );
    if (contact) {
      return res
        .status(200)
        .json({ status: "success", code: 200, data: { contact } });
    }
    return res
      .status(404)
      .json({ status: "error", code: 404, message: "Not found" });
  } catch (error) {
    next(error);
  }
});

router.patch(
  "/:contactId/favorite",
  validateUpdateStatusContact,
  async (req, res, next) => {
    try {
      if (!req.body) {
        return res.status(400).json({
          status: "error",
          code: 400,
          message: "missing field favorite",
        });
      }
      const contact = await Contacts.updateStatusContact(
        req.params.contactId,
        req.body
      );
      if (contact) {
        return res.status(200).json({
          status: "success",
          code: 200,
          data: { contact },
        });
      }

      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Not found",
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
