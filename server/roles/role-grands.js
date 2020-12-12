const AccessControl = require('accesscontrol');
const ac = new AccessControl();
const { REDACTOR, EDITOR, DEV, ADMIN } = require('./roles');

const roleGrands = () => {
  ac.grant(EDITOR)
    .readOwn('user')
    .readAny('page')
    .readAny('pageType')
    .readAny('fieldType')
    .updateAny('page')
    .updateAny('pageDetails')
    .readAny('menu')
    .updateAny('menu');

  ac.grant(REDACTOR)
    .readOwn('user')
    .readAny('pageType')
    .readAny('fieldType')
    .createAny('page')
    .readAny('page')
    .updateAny('page')
    .deleteAny('page')
    .createAny('pageDetails')
    .readAny('pageDetails')
    .updateAny('pageDetails')
    .deleteAny('pageDetails')
    .readAny('menu')
    .updateAny('menu');

  ac.grant(DEV)
    .extend(REDACTOR)
    .createAny('menu')
    .deleteAny('menu')
    .createAny('componentPattern')
    .readAny('componentPattern')
    .updateAny('componentPattern')
    .deleteAny('componentPattern');

  ac.grant(ADMIN)
    .extend(DEV)
    .createAny('field')
    .readAny('field')
    .updateAny('field')
    .deleteAny('field')
    .createAny('user')
    .readAny('user')
    .updateAny('user')
    .deleteAny('user')
    .createAny('pageType')
    .updateAny('pageType')
    .deleteAny('pageType')
    .createAny('pageTemplate')
    .readAny('pageTemplate')
    .updateAny('pageTemplate')
    .deleteAny('pageTemplate')
    .createAny('pageAttributeType')
    .readAny('pageAttributeType')
    .updateAny('pageAttributeType')
    .deleteAny('pageAttributeType')
    .createAny('fieldType')
    .readAny('fieldType')
    .updateAny('fieldType')
    .deleteAny('fieldType')
    .createAny('country')
    .readAny('country')
    .updateAny('country')
    .deleteAny('country')
    .readAny('definition')
    .createOwn('definition')
    .updateAny('definition')
    .deleteAny('definition')
    .readAny('siteInfo')
    .createOwn('siteInfo')
    .updateAny('siteInfo');

  return ac;
};

exports.roles = roleGrands();
