/* eslint-disable */
/** ********************************* Import URL ************************************* */
import { hostConfig } from "../config"; // env
import { URL_CONSTANTS } from "./urls";

/** ****************************** Response Handler *********************************** */

const token = localStorage.getItem("accessToken");
const reLogin = () => {
  if (!localStorage.getItem("loggedUser")) {
    return { error: "Invalid emaiId or password" };
  } else if (localStorage.getItem("accessExpiry")) {
    const accessExipryTime = new Date(localStorage.getItem("accessExipry"));
    const currentDate = new Date();
    if (accessExipryTime < currentDate) {
      const refreshToken = localStorage.getItem("refreshToken");
      const params = { refreshToken: refreshToken };
      return fetch(`${hostConfig.TEST_URL}${URL_CONSTANTS.refreshToken}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(params),
      })
        .then((response) => {
          return response;
        })
        .then(async (resp) => {
          const res = await resp.json();
          const accessToken = res.access.token;
          const refreshToken = res.refresh.token;
          const accessExpiry = res.access.expires;
          const refreshExpiry = res.refresh.expires;
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
          localStorage.setItem("accessExpiry", accessExpiry);
          localStorage.setItem("refreshExpiry", refreshExpiry);
          window.location.reload();
        })
        .catch((err) => {
          errorHandler(err);
        });
    }
  } else {
    localStorage.clear();
    window.location.href = "/";
  }
};

const handlePlanExpiration = async (response) => {
  try {
    const data = await response.json();

    // Check if the error message matches exactly
    if (
      data?.detail?.error ===
      "Your plan has expired. Please renew your plan to continue."
    ) {
      localStorage.clear(); // Clear local storage

      // Check if the current URL is not already the login page
      if (window.location.pathname !== "/") {
        window.location.href = "/"; // Redirect to login page
      }

      return { error: "Session expired. User logged out." };
    }

    // Return the response data if the error message doesn't match
    return { error: data?.detail?.error || "Unknown error occurred." };
  } catch (error) {
    return { error: "Failed to process response" };
  }
};

const responseStatusHandler = async (response) => {
  if (response.status === 403) {
    return await handlePlanExpiration(response);
  }
  switch (response.status) {
    case 400:
      return response;
    case 401:
    // return reLogin();
    // return false;
    case 402:
      return { error: "Payment Required" };
    // case 403:
    // return { error: "Forbidden" };
    // return reLogin();
    case 404:
      return { error: "Not Found" };
    case 405:
      return { error: "Method Not Allowed" };
    case 406:
      return { error: "Not Acceptable" };
    case 408:
      return { error: "Request Timeout" };
    case 409:
      return { error: "Request Already Exist" };
    case 410:
      return { error: "permanently deleted from server" };
    case 422:
      return response;
    case 500:
      return { error: "Internal Server Error" };
    case 501:
      return { error: "Not Implemented" };
    case 502:
      return { error: "Bad Gateway" };
    case 503:
      return { error: "Service Unavailable" };
    case 504:
      return { error: " Gateway Timeout" };
    case 511:
      return { error: " Network Authentication Required" };
    case 200:
    case 201:
      return response;
    default:
      return false;
  }
};

/** ****************************** Error Handler *********************************** */
const errorHandler = (error) => error;

/** ****************************** Import product Api *********************************** */
export const postImportDataApi = (
  requestUrl,
  requestUrlFlag,
  params,
  service = "API"
) => {
  const verifyFlag = requestUrlFlag ? `?${requestUrlFlag}` : ``;
  const url = `${
    service === "JSONSERVER" ? hostConfig.JSON_SERVER_URL : hostConfig.API_URL
  }${requestUrl}${verifyFlag}`;

  return fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`, // Ensure `token` is defined or passed correctly
    },
    body: params,
  })
    .then((response) => responseStatusHandler(response))
    .then((result) =>
      result.status === 200 || result.status === 201 || result.status === 400
        ? result.json()
        : result
    )
    .catch((err) => {
      errorHandler(err); // Ensure `errorHandler` is a defined function
      throw err; // Re-throw the error after handling
    });
};

/** ****************************** Create Api *********************************** */
export const postDataApi = (requestUrl, params, service) => {
  return fetch(
    `${
      service === "JSONSERVER" ? hostConfig.JSON_SERVER_URL : hostConfig.API_URL
    }${requestUrl}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(params),
    }
  )
    .then((response) => {
      return responseStatusHandler(response);
    })
    .then((result) =>
      result.status === 200 ||
      result.status === 201 ||
      result.status === 400 ||
      result.status === 422
        ? result.json()
        : result
    )
    .catch((err) => {
      errorHandler(err);
    });
};

export const postDataApiByParams = (requestUrl, params) => {
  let getParams = "?";
  // Append the 'credit' param if available
  if (params?.credit) {
    getParams += `&credit=${params.credit}`;
  }
  return fetch(`${hostConfig.API_URL}${requestUrl}${getParams}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(params), // Sending other params in the body if needed
  })
    .then((response) => responseStatusHandler(response))
    .then((result) =>
      result.status === 200 || result.status === 201 || result.status === 400
        ? result.json()
        : result
    )
    .catch((error) => {
      errorHandler(error);
    });
};

export const postDataApiByID = (requestUrl, params, paramId) => {
  let getParams = "?";
  if (params?.type) {
    getParams += `&type=${params.type}`;
  }
  return fetch(`${hostConfig.API_URL}${requestUrl}/${paramId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(params),
  })
    .then((response) => responseStatusHandler(response))
    .then((result) =>
      result.status === 200 || result.status === 201 || result.status === 400
        ? result.json()
        : result
    )
    .catch((error) => {
      errorHandler(error);
    });
};
/****************************product multi image upload**************** */
export const MultiuploadFileFG = async (requestUrl, params, id, slider) => {
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${token}`);

  const formData = new FormData();
  const formData2 = new FormData();
  if (params?.MultiImages?.length > 1) {
    params?.MultiImages?.forEach((file) => {
      formData.append(`images`, file);
    });
  } else {
    if (params?.MultiImages?.length == 1) {
      formData.append(`images`, params?.MultiImages[0]);
    }
  }
  if (params?.descriptionImages?.length > 1) {
    params?.descriptionImages?.forEach((file) => {
      formData.append(`desc_images`, file);
    });
  } else {
    if (params?.descriptionImages?.length == 1) {
      formData.append(`desc_images`, params?.descriptionImages[0]);
    }
  }
  for (let pair of formData2.entries()) {
    if (pair[1] !== undefined) {
      formData.append(pair[0], pair[1]);
    }
  }

  return fetch(`${hostConfig.API_URL}${requestUrl}?product_id=${id}`, {
    method: "POST",
    headers,
    body: formData,
  })
    .then(async (response) => {
      const data = responseStatusHandler(response);
      return data;
    })
    .then((result) => {
      if (!result.error) return result.json();
      else return result;
    })
    .catch((err) => {
      errorHandler(err);
    });
};
/** ****************************** View with query Api *********************************** */

export const getListByApi = (requestUrl, params, service) => {
  let getParams = "?";
  if (
    params &&
    params.stock_status &&
    params.stock_status !== null &&
    params.stock_status !== undefined
  ) {
    getParams += `stock_status=${params.stock_status}`;
  }
  if (
    params &&
    params.customer_id &&
    params.customer_id !== null &&
    params.customer_id !== undefined
  ) {
    getParams += `customer_id=${params.customer_id}`;
  }

  if (
    params &&
    params.orderLimit &&
    params.orderLimit !== null &&
    params.orderLimit !== undefined
  ) {
    getParams += `&limit=${params.orderLimit}`;
  }
  if (
    params &&
    params.product_ids &&
    params.product_ids !== null &&
    params.product_ids !== undefined &&
    params.product_ids?.length > 0
  ) {
    getParams += `&product_ids=${params.product_ids}`;
  }
  if (
    params &&
    params.category_ids &&
    params.category_ids !== null &&
    params.category_ids !== undefined
  ) {
    getParams += `&category_ids=${params.category_ids}`;
  }
  if (
    params &&
    params.selling_price &&
    params.selling_price !== null &&
    params.selling_price !== undefined
  ) {
    getParams += `&selling_price=${params.selling_price}`;
  }
  if (
    params &&
    params.current_stock &&
    params.current_stock !== null &&
    params.current_stock !== undefined
  ) {
    getParams += `&current_stock=${params.current_stock}`;
  }
  if (
    params &&
    params.child_category_ids &&
    params.child_category_ids !== null &&
    params.child_category_ids !== undefined
  ) {
    getParams += `&child_category_ids=${params.child_category_ids}`;
  }
  if (
    params &&
    params.is_export &&
    params.is_export !== null &&
    params.is_export !== undefined
  ) {
    getParams += `&is_export=${params.is_export}`;
  }

  if (
    params &&
    params.order_ids &&
    params.order_ids !== null &&
    params.order_ids !== undefined
  ) {
    getParams += `&order_ids=${params.order_ids}`;
  }

  if (
    params &&
    params.limit &&
    params.limit !== null &&
    params.limit !== undefined
  ) {
    getParams += `&limit=${params.limit}`;
  }
  if (
    params &&
    params.text &&
    params.text !== null &&
    params.text !== undefined
  ) {
    getParams += `text=${params.text}`;
  }
  if (
    params &&
    params.product_id &&
    params.product_id !== null &&
    params.product_id !== undefined
  ) {
    getParams += `&product_id=${params.product_id}`;
  }
  if (
    params &&
    params.undo_id &&
    params.undo_id !== null &&
    params.undo_id !== undefined
  ) {
    getParams += `&undo_id=${params.undo_id}`;
  }

  if (
    params &&
    params.brand_ids &&
    params.brand_ids !== null &&
    params.brand_ids !== undefined
  ) {
    getParams += `&brand_ids=${params.brand_ids}`;
  }

  if (params && params.assignTo) {
    getParams += `&assignTo=${params.assignTo}`;
  }
  if (params && params.taskType) {
    getParams += `&taskType=${params.taskType}`;
  }

  if (params?.status) {
    getParams += `&status=${params.status}`;
  }
  if (params && params.workLocation) {
    getParams += `&workLocation=${params.workLocation}`;
  }
  if (params && params.contact_us_id) {
    getParams += `&contact_us_id=${params.contact_us_id}`;
  }
  if (params && params.candidateId) {
    getParams += `candidateId=${params.candidateId}`;
  }
  if (params && params.category) {
    getParams += `&category=${params.category}`;
  }
  if (params && params.details) {
    getParams += `&details=${params.details}`;
  }
  if (params && params.export_option) {
    getParams += `&export_option=${params.export_option}`;
  }
  if (params && params.from_date) {
    getParams += `&from_date=${params.from_date}`;
  }
  if (params && params.to_date) {
    getParams += `&to_date=${params.to_date}`;
  }
  if (params && params.category_path) {
    getParams += `&category_path=${params.category_path}`;
  }
  if (params && params.category_type) {
    getParams += `&category_type=${params.category_type}`;
  }
  if (params && params.price) {
    getParams += `&price=${params.price}`;
  }
  if (params && params.survey_id) {
    getParams += `&survey_id=${params.survey_id}`;
  }

  if (
    params &&
    params.token &&
    params.token !== null &&
    params.token !== undefined
  ) {
    getParams += `token=${params.token}`;
  }
  if (
    params &&
    params.address_id &&
    params.address_id !== null &&
    params.address_id !== undefined
  ) {
    getParams += `address_id=${params.address_id}`;
  }

  if (
    params &&
    params.activePage &&
    params.activePage !== null &&
    params.activePage !== undefined
  ) {
    getParams += `&page=${params.activePage}`;
  }

  if (
    params &&
    params.rowsPerPage &&
    params.rowsPerPage !== null &&
    params.rowsPerPage !== undefined
  ) {
    getParams += `&limit=${params.rowsPerPage}`;
  }

  if (
    params &&
    params.organizationName !== null &&
    params.organizationName !== undefined
  ) {
    getParams += `&organizationName=${params.organizationName}`;
  }

  if (
    params &&
    params.sortBy &&
    params.sortBy !== null &&
    params.sortBy !== undefined
  ) {
    getParams += `&sortBy=${params.sortBy}`;
  }
  if (
    params &&
    params.category_id &&
    params.category_id !== null &&
    params.category_id !== undefined
  ) {
    getParams += `&category_id=${params.category_id}`;
  }
  if (params && params._id && params._id !== null && params._id !== undefined) {
    getParams += `&_id=${params._id}`;
  }

  if (
    params &&
    params.user_id &&
    params.user_id !== null &&
    params.user_id !== undefined
  ) {
    getParams += `&user_id=${params.user_id}`;
  }
  if (
    params &&
    params.order_id &&
    params.order_id !== null &&
    params.order_id !== undefined
  ) {
    getParams += `&order_id=${params.order_id}`;
  }
  if (
    params &&
    params.product_price &&
    params.product_price !== null &&
    params.product_price !== undefined
  ) {
    getParams += `&product_price=${params.product_price}`;
  }
  if (
    params &&
    params.search &&
    params.search !== null &&
    params.search !== undefined
  ) {
    getParams += `&search=${params.search}`;
  }
  if (
    params &&
    params.isActive !== null &&
    params.isActive !== "" &&
    params.isActive !== undefined
  ) {
    getParams += `&isActive=${params.isActive}`;
  }

  if (params && params.role !== null && params.role !== undefined) {
    getParams += `&role=${params.role}`;
  }

  if (
    params &&
    params.action !== null &&
    params.action !== "" &&
    params.action !== undefined
  ) {
    getParams += `&action=${params.action}`;
  }
  if (
    params &&
    params.lastkey !== null &&
    params.lastkey !== "" &&
    params.lastkey !== undefined
  ) {
    getParams += `&lastkey=${params.lastkey}`;
  }

  if (
    params &&
    params.orderStatus !== null &&
    params.orderStatus !== "" &&
    params.orderStatus !== undefined
  ) {
    getParams += `&orderStatus=${params.orderStatus}`;
  }
  if (
    params &&
    params.productType !== null &&
    params.productType !== "" &&
    params.productType !== undefined
  ) {
    getParams += `&productType=${params.productType}`;
  }
  if (
    params &&
    params.order_status !== null &&
    params.order_status !== "" &&
    params.order_status !== undefined
  ) {
    getParams += `&order_status=${params.order_status}`;
  }

  if (
    params &&
    params.shipped_status !== null &&
    params.shipped_status !== "" &&
    params.shipped_status !== undefined
  ) {
    getParams += `&shipped_status=${params.shipped_status}`;
  }

  if (
    params &&
    params.outForDelivery_status !== null &&
    params.outForDelivery_status !== "" &&
    params.outForDelivery_status !== undefined
  ) {
    getParams += `&outForDelivery_status=${params.outForDelivery_status}`;
  }

  if (
    params &&
    params.delivered_status !== null &&
    params.delivered_status !== "" &&
    params.delivered_status !== undefined
  ) {
    getParams += `&delivered_status=${params.delivered_status}`;
  }

  if (
    params &&
    params.sort !== null &&
    params.sort !== "" &&
    params.sort !== undefined
  ) {
    getParams += `&sort=${params.sort}`;
  }
  if (
    params &&
    params.min_price !== null &&
    params.min_price !== "" &&
    params.min_price !== undefined
  ) {
    getParams += `&min_price=${params.min_price}`;
  }

  if (
    params &&
    params.max_price !== null &&
    params.max_price !== "" &&
    params.max_price !== undefined
  ) {
    getParams += `&max_price=${params.max_price}`;
  }

  if (
    params &&
    params.min_quantity !== null &&
    params.min_quantity !== "" &&
    params.min_quantity !== undefined
  ) {
    getParams += `&min_quantity=${params.min_quantity}`;
  }

  if (
    params &&
    params.max_quantity !== null &&
    params.max_quantity !== "" &&
    params.max_quantity !== undefined
  ) {
    getParams += `&max_quantity=${params.max_quantity}`;
  }
  if (
    params &&
    params.attribute_type !== null &&
    params.attribute_type !== "" &&
    params.attribute_type !== undefined
  ) {
    getParams += `&attribute_type=${params.attribute_type}`;
  }

  if (
    params &&
    params.is_active !== null &&
    params.is_active !== "" &&
    params.is_active !== undefined
  ) {
    getParams += `&is_active=${params.is_active}`;
  }

  if (
    params &&
    params.parent_attribute_id !== null &&
    params.parent_attribute_id !== "" &&
    params.parent_attribute_id !== undefined
  ) {
    getParams += `&parent_attribute_id=${params.parent_attribute_id}`;
  }
  // if (
  //   params &&
  //   params.category_path !== null &&
  //   params.category_path !== "" &&
  //   params.category_path !== undefined
  // ) {
  //   getParams += `&category_path=${params.category_path}`;
  // }
  if (
    params &&
    params.latest !== null &&
    params.latest !== "" &&
    params.latest !== undefined
  ) {
    getParams += `&latest=${params.latest}`;
  }
  if (
    params &&
    params.alphabetsort !== null &&
    params.alphabetsort !== "" &&
    params.alphabetsort !== undefined
  ) {
    getParams += `&alphabetsort=${params.alphabetsort}`;
  }
  if (
    params &&
    params.quantity_sort !== null &&
    params.quantity_sort !== "" &&
    params.quantity_sort !== undefined
  ) {
    getParams += `&quantity_sort=${params.quantity_sort}`;
  }
  if (
    params &&
    params.searchvalue !== null &&
    params.searchvalue !== "" &&
    params.searchvalue !== undefined
  ) {
    getParams += `&searchvalue=${params.searchvalue}`;
  }
  if (
    params &&
    params.search_value !== null &&
    params.search_value !== "" &&
    params.search_value !== undefined
  ) {
    getParams += `&search_value=${params.search_value}`;
  }
  if (
    params &&
    params.year !== null &&
    params.year !== "" &&
    params.year !== undefined
  ) {
    getParams += `&year=${params.year}`;
  }
  if (
    params &&
    params.orderyear !== null &&
    params.orderyear !== "" &&
    params.orderyear !== undefined
  ) {
    getParams += `&orderyear=${params.orderyear}`;
  }

  if (
    params &&
    params.off_percentage !== null &&
    params.off_percentage !== "" &&
    params.off_percentage !== undefined
  ) {
    getParams += `&off_percentage=${params.off_percentage}`;
  }
  if (
    params &&
    params.min_off_percentage !== null &&
    params.min_off_percentage !== "" &&
    params.min_off_percentage !== undefined
  ) {
    getParams += `&min_off_percentage=${params.min_off_percentage}`;
  }
  if (
    params &&
    params.max_off_percentage !== null &&
    params.max_off_percentage !== "" &&
    params.max_off_percentage !== undefined
  ) {
    getParams += `&max_off_percentage=${params.max_off_percentage}`;
  }

  // if (
  //   params &&
  //   params.currentPage !== null &&
  //   params.currentPage !== "" &&
  //   params.currentPage !== undefined
  // ) {
  //   getParams += `&currentPage=${params.currentPage}`;
  // }
  // if (
  //   params &&
  //   params.limit !== null &&
  //   params.limit !== "" &&
  //   params.limit !== undefined
  // ) {
  //   getParams += `&limit=${params.limit}`;
  // }
  if (
    params &&
    params.rating !== null &&
    params.rating !== "" &&
    params.rating !== undefined
  ) {
    getParams += `&rating=${params.rating}`;
  }
  if (
    params &&
    params.searchuser !== null &&
    params.searchuser !== "" &&
    params.searchuser !== undefined
  ) {
    getParams += `&searchuser=${params.searchuser}`;
  }

  if (
    params &&
    params.sort_by_column &&
    params.sort_by_column !== null &&
    params.sort_by_column !== undefined
  ) {
    getParams += `&sort_by_column=${params.sort_by_column}`;
  }

  if (
    params &&
    params.sort_by &&
    params.sort_by !== null &&
    params.sort_by !== undefined
  ) {
    getParams += `&sort_by=${params.sort_by}`;
  }

  if (
    params &&
    params.page &&
    params.page !== null &&
    params.page !== undefined
  ) {
    getParams += `&page=${params.page}`;
  }
  if (
    params &&
    params.type &&
    params.type !== null &&
    params.type !== undefined
  ) {
    getParams += `&type=${params.type}`;
  }

  if (
    params &&
    params.faq_question &&
    params.faq_question !== null &&
    params.faq_question !== undefined
  ) {
    getParams += `&faq_question=${params.faq_question}`;
  }

  if (
    params &&
    params.cms_id &&
    params.cms_id !== null &&
    params.cms_id !== undefined
  ) {
    getParams += `&cms_id=${params.cms_id}`;
  }

  if (
    params &&
    params.custom_date &&
    params.custom_date !== null &&
    params.custom_date !== undefined
  ) {
    getParams += `&custom_date=${params.custom_date}`;
  }

  if (
    params &&
    params.is_listed &&
    params.is_listed !== null &&
    params.is_listed !== undefined
  ) {
    getParams += `&is_listed=${params.is_listed}`;
  }

  if (
    params &&
    params.country_code &&
    params.country_code !== null &&
    params.country_code !== undefined
  ) {
    getParams += `&country_code=${params.country_code}`;
  }

  if (
    params &&
    params.state_code &&
    params.state_code !== null &&
    params.state_code !== undefined
  ) {
    getParams += `&state_code=${params.state_code}`;
  }

  if (
    params &&
    params.is_expected_delivery &&
    params.is_expected_delivery !== null &&
    params.is_expected_delivery !== undefined
  ) {
    getParams += `&is_expected_delivery=${params.is_expected_delivery}`;
  }

  if (
    params &&
    params.is_abandoned &&
    params.is_abandoned !== null &&
    params.is_abandoned !== undefined
  ) {
    getParams += `&is_abandoned=${params.is_abandoned}`;
  }

  return fetch(
    `${
      service === "JSONSERVER" ? hostConfig.JSON_SERVER_URL : hostConfig.API_URL
    }${requestUrl}${getParams}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  )
    .then((response) => responseStatusHandler(response))
    .then((result) =>
      result.status === 200 || result.status === 201 || result.status === 400
        ? result.json()
        : result
    )
    .catch((error) => {
      errorHandler(error);
    });
};
/** ****************************** List Api *********************************** */

export const getZipFile = (requestUrl, params) => {
  let getParams = "?";

  if (
    params &&
    params.customer_id &&
    params.customer_id !== null &&
    params.customer_id !== undefined
  ) {
    getParams += `customer_id=${params.customer_id}`;
  }

  if (
    params &&
    params.is_invoice_download &&
    params.is_invoice_download !== null &&
    params.is_invoice_download !== undefined
  ) {
    getParams += `&is_invoice_download=${params.is_invoice_download}`;
  }

  if (
    params &&
    params.custom_date &&
    params.custom_date !== null &&
    params.custom_date !== undefined
  ) {
    getParams += `&custom_date=${params.custom_date}`;
  }

  if (
    params &&
    params.is_export &&
    params.is_export !== null &&
    params.is_export !== undefined
  ) {
    getParams += `&is_export=${params.is_export}`;
  }
  if (
    params &&
    params.order_ids &&
    params.order_ids !== null &&
    params.order_ids !== undefined
  ) {
    getParams += `&order_ids=${params.order_ids}`;
  }
  return fetch(`${hostConfig.API_URL}${requestUrl}${getParams}`, {
    method: "GET",
    headers: {
      Accept: "application/zip",
      "Content-Type": "application/zip",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => responseStatusHandler(response))
    .then((result) => result)
    .catch((error) => {
      errorHandler(error);
    });
};
/********************************* NEWS LETTERS ****************************************/
export const downloadContacts = (requestUrl, params) => {
  let getParams = "?";
  if (
    params &&
    params.is_export &&
    params.is_export !== null &&
    params.is_export !== undefined
  ) {
    getParams += `&is_export=${params.is_export}&custom_date=${params?.custom_date}`;
  }

  return fetch(`${hostConfig.API_URL}${requestUrl}${getParams}`, {
    method: "POST",
    headers: {
      Accept: "application/zip",
      "Content-Type": "application/zip",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => responseStatusHandler(response))
    .then((result) => result)
    .catch((error) => {
      errorHandler(error);
    });
};
/** ****************************** View Api *********************************** */
export const viewDataByApi = (requestUrl, dataId, params) => {
  let getParams = "?";
  if (
    params &&
    params.category_type !== null &&
    params.category_type !== "" &&
    params.category_type !== undefined
  ) {
    getParams += `category_type=${params.category_type}`;
  }
  if (
    params &&
    params.limit &&
    params.limit !== null &&
    params.limit !== undefined
  ) {
    getParams += `&limit=${params.limit}`;
  }
  if (
    params &&
    params.currentPage &&
    params.currentPage !== null &&
    params.currentPage !== undefined
  ) {
    getParams += `&page=${params.currentPage}`;
  }

  if (
    params &&
    params.activePage &&
    params.activePage !== null &&
    params.activePage !== undefined
  ) {
    getParams += `&page=${params.activePage}`;
  }

  if (
    params &&
    params.rowsPerPage &&
    params.rowsPerPage !== null &&
    params.rowsPerPage !== undefined
  ) {
    getParams += `&limit=${params.rowsPerPage}`;
  }

  if (
    params &&
    params.sort_by_column &&
    params.sort_by_column !== null &&
    params.sort_by_column !== undefined
  ) {
    getParams += `&sort_by_column=${params.sort_by_column}`;
  }

  if (
    params &&
    params.sort_by &&
    params.sort_by !== null &&
    params.sort_by !== undefined
  ) {
    getParams += `&sort_by=${params.sort_by}`;
  }

  if (
    params &&
    params.search !== null &&
    params.search !== "" &&
    params.search !== undefined
  ) {
    getParams += `&search=${params.search}`;
  }
  if (
    params &&
    params.search_size_color !== null &&
    params.search_size_color !== "" &&
    params.search_size_color !== undefined
  ) {
    getParams += `&search_size_color=${params.search_size_color}`;
  }
  if (
    params &&
    params.variant_id !== null &&
    params.variant_id !== "" &&
    params.variant_id !== undefined
  ) {
    getParams += `&variant_id=${params.variant_id}`;
  }
  if (
    params &&
    params.searchvalue !== null &&
    params.searchvalue !== "" &&
    params.searchvalue !== undefined
  ) {
    getParams += `&searchvalue=${params.searchvalue}`;
  }
  if (
    params &&
    params.is_active !== null &&
    params.is_active !== "" &&
    params.is_active !== undefined
  ) {
    getParams += `&is_active=${params.is_active}`;
  }
  return fetch(`${hostConfig.API_URL}${requestUrl}/${dataId}${getParams}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => responseStatusHandler(response))
    .then((result) =>
      result.status === 200 || result.status === 201 || result.status === 400
        ? result.json()
        : result
    )
    .catch((error) => {
      errorHandler(error);
    });
};

/** ****************************** Update by Id Api *********************************** */
export const putDataByIdApi = (
  requestUrl,
  params,
  id,
  roleId,
  role,
  service,
  method
) => {
  let getParams = "";
  if (roleId && roleId && roleId !== null && roleId !== undefined) {
    getParams += `/${roleId}`;
  }

  if (role && role !== null && role !== "" && role !== undefined) {
    getParams += `?role=${role}`;
  }

  if (method && method !== null && method !== "" && method !== undefined) {
    getParams += `&method=${method}`;
  }
  return fetch(
    `${
      service === "JSONSERVER" ? hostConfig.JSON_SERVER_URL : hostConfig.API_URL
    }${requestUrl}/${id}${getParams}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(params),
    }
  )
    .then((response) => responseStatusHandler(response))
    .then((result) =>
      result.status === 200 || result.status === 201 || result.status === 400
        ? result.json()
        : result
    )
    .catch((error) => {
      errorHandler(error);
    });
};

/** ****************************** Update Api *********************************** */

export const putApi = (requestUrl, params) =>
  fetch(`${hostConfig.API_URL}${requestUrl}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(params),
  })
    .then((response) => responseStatusHandler(response))
    .then((result) =>
      result.status === 200 || result.status === 201 || result.status === 400
        ? result.json()
        : result
    )
    .catch((error) => {
      errorHandler(error);
    });

export const putDataApi = (requestUrl, params, paramId) => {
  let getParams = "?";
  if (params?.type) {
    getParams += `&type=${params.type}`;
  }
  if (params?.is_active) {
    getParams += `&is_active=${params.is_active}`;
  }
  if (params?.shipping_price) {
    getParams += `&shipping_price=${params.shipping_price}`;
  }
  if (params?.start_price) {
    getParams += `&start_price=${params.start_price}`;
  }
  if (params?.end_price) {
    getParams += `&end_price=${params.end_price}`;
  }
  if (params?.payment_id) {
    getParams += `payment_id=${params.payment_id}`;
  }

  return fetch(
    `${hostConfig.API_URL}${requestUrl}${
      paramId ? `/${paramId}` : ""
    }${getParams}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(params),
    }
  )
    .then((response) => responseStatusHandler(response))
    .then((result) =>
      result.status === 200 ||
      result.status === 201 ||
      result.status === 400 ||
      result.status === 422
        ? result.json()
        : result
    )
    .catch((error) => {
      errorHandler(error);
    });
};

/** ****************************** Put form data Api *********************************** */
export const putFormDataImageDataApi = (requestUrl, formData, dataId) =>
  fetch(`${hostConfig.API_URL}${requestUrl}/${dataId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })
    .then((response) => responseStatusHandler(response))
    .then((result) =>
      result.status === 200 || result.status === 201 || result.status === 400
        ? result.json()
        : result
    )
    .catch((error) => {
      errorHandler(error);
    });

/** ****************************** Patch form data Api *********************************** */
export const patchDataApi = (requestUrl, params, paramId) => {
  let getParams = "?";
  if (params?.otp) {
    getParams += `email=${params.email}&otp=${params.otp}`;
  }

  if (params?.type) {
    getParams += `&type=${params.type}`;
  }
  if (params?.shipping_price) {
    getParams += `&shipping_price=${params.shipping_price}`;
  }
  if (params?.start_price) {
    getParams += `&start_price=${params.start_price}`;
  }
  if (params?.end_price) {
    getParams += `&end_price=${params.end_price}`;
  }
  if (params?.mark_as_all_read) {
    getParams += `mark_as_all_read=${params.mark_as_all_read}`;
  }

  return fetch(
    paramId
      ? `${hostConfig.API_URL}${requestUrl}/${paramId}${getParams}`
      : `${hostConfig.API_URL}${requestUrl}${getParams}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(params),
    }
  )
    .then((response) => responseStatusHandler(response))
    .then((result) =>
      result.status === 200 || result.status === 201 || result.status === 400
        ? result.json()
        : result
    )
    .catch((error) => {
      errorHandler(error);
    });
};

/** ****************************** Change password Api *********************************** */
export const changePasswordDataApi = (
  requestUrl,
  params,
  id,
  service,
  changePasswordToken
) => {
  return fetch(
    `${
      service === "JSONSERVER" ? hostConfig.JSON_SERVER_URL : hostConfig.API_URL
    }${requestUrl}/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${changePasswordToken}`,
      },
      body: JSON.stringify(params),
    }
  )
    .then((response) => responseStatusHandler(response))
    .then((result) =>
      result.status === 200 || result.status === 201 || result.status === 400
        ? result.json()
        : result
    )
    .catch((error) => {
      errorHandler(error);
    });
};

/** ****************************** Delete by Id Api *********************************** */
export const deleteDataByIdApi = (requestUrl, dataId, service) =>
  fetch(
    `${
      service === "JSONSERVER" ? hostConfig.JSON_SERVER_URL : hostConfig.API_URL
    }${requestUrl}/${dataId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  )
    .then((response) => responseStatusHandler(response))
    .then((result) =>
      result.status === 200 || result.status === 201 || result.status === 400
        ? result.json()
        : result
    )
    .catch((error) => {
      errorHandler(error);
    });

/** ****************************** Delete Api *********************************** */
export const deleteDataApi = (requestUrl, params, service) =>
  fetch(
    `${
      service === "JSONSERVER" ? hostConfig.JSON_SERVER_URL : hostConfig.API_URL
    }${requestUrl}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(params),
    }
  )
    .then((response) => responseStatusHandler(response))
    .then((result) =>
      result.status === 200 || result.status === 201 || result.status === 400
        ? result.json()
        : result
    )
    .catch((error) => {
      errorHandler(error);
    });

/** ****************************** Download Api *********************************** */
export const downloadApi = (requestUrl, params) => {
  let getParams = "?";
  if (
    params &&
    params.candidateId &&
    params.candidateId !== null &&
    params.candidateId !== undefined
  ) {
    getParams += `candidateId=${params.candidateId}`;
  }
  return fetch(
    `${
      service === "JSONSERVER" ? hostConfig.JSON_SERVER_URL : hostConfig.API_URL
    }${requestUrl}${getParams}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/pdf",
      },
      responseType: "arraybuffer",
    }
  )
    .then((response) => responseStatusHandler(response))
    .then((result) =>
      result.status === 200 || result.status === 201 || result.status === 400
        ? result.json()
        : result
    )
    .catch((error) => {
      errorHandler(error);
    });
};
