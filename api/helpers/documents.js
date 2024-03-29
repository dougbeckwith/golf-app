const isDocumentOwner = (document, id) => {
  return document.user.equals(id);
};

const isDocumentsOwner = (documents, id) => {
  let isOwnerOfAllDocuments = true;

  documents.forEach((document) => {
    if (!document.user.equals(id)) {
      isOwnerOfAllDocuments = false;
      return;
    }
  });
  return isOwnerOfAllDocuments ? true : false;
};

module.exports = {
  isDocumentOwner,
  isDocumentsOwner
};
