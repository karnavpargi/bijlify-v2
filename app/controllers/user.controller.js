const userService = require('../services/user.service');

const userController = {
  profile: async (payload, decoded) => {
    const { mobile, email } = payload;
    let message = 'Please verify your:';
    if (mobile && mobile.length < 10) return { message: 'Mobile number invalid' };
    if (email) message += ' email';
    if (mobile) message = email ? `${message} and mobile.` : `${message} mobile.`;
    if (!mobile && !email) message = 'Data updated.';

    const uuid = await userService.profile({ decoded, ...payload });
    return { uuid, message };
  },
  getProfile: async (_payload, decoded) => {
    const data = await userService.getProfile({ ...decoded });
    return { data: data[0] };
  }
};

module.exports = userController;
