const Contact = require("./schemas/contact");
const listContacts = async (userId, query) => {
  try {
    const {
      limit = 5,
      offset = 0,
      sortBy,
      sortByDesc,
      filter,
      favorite = null,
    } = query;
    const optionSearch = { owner: userId };
    if (favorite !== null) {
      optionSearch.favorite = favorite;
    }
    const result = await Contact.paginate(optionSearch, {
      limit,
      offset,
      select: filter ? filter.split("|").join("") : "",
      sort: {
        ...(sortBy ? { [`${sortBy}`]: 1 } : {}),
        ...(sortByDesc ? { [`${sortByDesc}`]: -1 } : {}),
      },
    });
    const { docs: contacts, totalDocs: total } = result;
    return { contacts, total, limit, offset };
  } catch (error) {
    return error.message;
  }
};

const getContactById = async (userId, contactId) => {
  try {
    const result = await Contact.findOne({
      _id: contactId,
      owner: userId,
    }).populate({ path: "owner", select: " email subscription -_id " });

    return result;
  } catch (error) {
    return error.message;
  }
};

const removeContact = async (userId, contactId) => {
  try {
    const result = await Contact.findByIdAndRemove({
      _id: contactId,
      owner: userId,
    });
    return result;
  } catch (error) {
    return error.message;
  }
};

const addContact = async (body) => {
  if (body) {
    try {
      const { favorite } = body;

      if (!favorite) {
        const newContact = {
          ...body,
          favorite: false,
        };
        return await Contact.create(newContact);
      }

      return await Contact.create(body);
    } catch (error) {
      return error.message;
    }
  }
};

const updateContact = async (userId, contactId, body) => {
  try {
    const result = await Contact.findOneAndUpdate(
      {
        _id: contactId,
        owner: userId,
      },
      { ...body },
      { new: true }
    );

    return result;
  } catch (error) {
    return error.message;
  }
};

const updateStatusContact = async (contactId, body,userId) => {
  try {
    if (contactId && body) {
      const result = await Contact.findByIdAndUpdate(
        { _id: contactId },
        { ...body },
        { new: true }
      );
      return result;
    }
  } catch (error) {
    return error.message;
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
