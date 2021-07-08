const AccessControl = require('accesscontrol');
const ac = new AccessControl();
const { REDACTOR, EDITOR, DEV, DEV_JUNIOR, ADMIN, API_CONSUMER } = require('./roles');

const roleGrands = () => {
  ac.grant(API_CONSUMER)
    .readAny('pageDetails')
    .readAny('menu');

  ac.grant(EDITOR)
    .readOwn('user')
    .readAny('pageType')
    .readAny('fieldType')
    .readAny('field')
    .readAny('definition')
    .readAny('country')
    .readAny('pageTemplate')
    .readAny('page')
    .readAny('siteInfo')
    .readAny('pageAttributeType')
    .updateAny('page')
    .updateAny('pageDetails')
    .readAny('menu')
    .updateAny('menu');

  ac.grant(REDACTOR)
    .readOwn('user')
    .readAny('pageType')
    .readAny('fieldType')
    .readAny('field')
    .readAny('definition')
    .readAny('country')
    .readAny('pageTemplate')
    .readAny('page')
    .readAny('siteInfo')
    .readAny('pageAttributeType')
    .createAny('page')
    .updateAny('page')
    .deleteAny('page')
    .createAny('pageDetails')
    .readAny('pageDetails')
    .updateAny('pageDetails')
    .deleteAny('pageDetails')
    .readAny('menu')
    .updateAny('menu');

  ac.grant(DEV_JUNIOR)
    .extend(REDACTOR)
    .readAny('componentPattern')

  ac.grant(DEV)
    .extend(DEV_JUNIOR)
    .createAny('menu')
    .deleteAny('menu')
    .createAny('componentPattern')
    .updateAny('componentPattern')
    .deleteAny('componentPattern');

  ac.grant(ADMIN)
    .extend(DEV)
    .createAny('field')
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
    .updateAny('pageTemplate')
    .deleteAny('pageTemplate')
    .createAny('pageAttributeType')
    .updateAny('pageAttributeType')
    .deleteAny('pageAttributeType')
    .createAny('fieldType')
    .updateAny('fieldType')
    .deleteAny('fieldType')
    .createAny('country')
    .updateAny('country')
    .deleteAny('country')
    .createOwn('definition')
    .updateAny('definition')
    .deleteAny('definition')
    .createOwn('siteInfo')
    .updateAny('siteInfo');

  return ac;
};

exports.roles = roleGrands();
