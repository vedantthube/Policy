const successResponse = (data, message = "Success", statusCode = 200) => {
  return {
    status: "success",
    statusCode,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
};

const errorResponse = (error, statusCode = 500, code = null) => {
  return {
    status: "error",
    statusCode,
    message: error,
    code,
    timestamp: new Date().toISOString(),
  };
};

const paginatedResponse = (data, currentPage, pageSize, totalRecords) => {
  return {
    status: "success",
    data,
    pagination: {
      currentPage,
      pageSize,
      totalRecords,
      totalPages: Math.ceil(totalRecords / pageSize),
    },
    timestamp: new Date().toISOString(),
  };
};

module.exports = {
  successResponse,
  errorResponse,
  paginatedResponse,
};
