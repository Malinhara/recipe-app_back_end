const authorizeAdmin = (userRole) => {
  if (userRole !== 'admin') {
    return {
      success: false,
      statusCode: 403,
      message: 'Access denied. Admins only.',
    };
  }
  return {
    success: true,
    statusCode: 200,
    message: 'Access granted.',
  };
};

module.exports = authorizeAdmin;
