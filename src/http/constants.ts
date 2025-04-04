/**
 * HTTP Status Codes
 */

// 1xx: Informational responses
const HTTP_CONTINUE = 100;
const HTTP_SWITCHING_PROTOCOLS = 101;
const HTTP_PROCESSING = 102; // WebDAV
const HTTP_EARLY_HINTS = 103;

// 2xx: Successful responses
const HTTP_OK = 200;
const HTTP_CREATED = 201;
const HTTP_ACCEPTED = 202;
const HTTP_NON_AUTHORITATIVE_INFORMATION = 203;
const HTTP_NO_CONTENT = 204;
const HTTP_RESET_CONTENT = 205;
const HTTP_PARTIAL_CONTENT = 206;
const HTTP_MULTI_STATUS = 207; // WebDAV
const HTTP_ALREADY_REPORTED = 208; // WebDAV
const HTTP_IM_USED = 226; // HTTP Delta encoding

// 3xx: Redirection messages
const HTTP_MULTIPLE_CHOICES = 300;
const HTTP_MOVED_PERMANENTLY = 301;
const HTTP_FOUND = 302;
const HTTP_SEE_OTHER = 303;
const HTTP_NOT_MODIFIED = 304;
const HTTP_USE_PROXY = 305; // Deprecated
const HTTP_RESERVED = 306; // No longer used
const HTTP_TEMPORARY_REDIRECT = 307;
const HTTP_PERMANENT_REDIRECT = 308;

// 4xx: Client error responses
const HTTP_BAD_REQUEST = 400;
const HTTP_UNAUTHORIZED = 401;
const HTTP_PAYMENT_REQUIRED = 402;
const HTTP_FORBIDDEN = 403;
const HTTP_NOT_FOUND = 404;
const HTTP_METHOD_NOT_ALLOWED = 405;
const HTTP_NOT_ACCEPTABLE = 406;
const HTTP_PROXY_AUTHENTICATION_REQUIRED = 407;
const HTTP_REQUEST_TIMEOUT = 408;
const HTTP_CONFLICT = 409;
const HTTP_GONE = 410;
const HTTP_LENGTH_REQUIRED = 411;
const HTTP_PRECONDITION_FAILED = 412;
const HTTP_PAYLOAD_TOO_LARGE = 413;
const HTTP_URI_TOO_LONG = 414;
const HTTP_UNSUPPORTED_MEDIA_TYPE = 415;
const HTTP_RANGE_NOT_SATISFIABLE = 416;
const HTTP_EXPECTATION_FAILED = 417;
const HTTP_IM_A_TEAPOT = 418; // RFC 2324, April Fools' joke
const HTTP_MISDIRECTED_REQUEST = 421;
const HTTP_UNPROCESSABLE_ENTITY = 422; // WebDAV
const HTTP_LOCKED = 423; // WebDAV
const HTTP_FAILED_DEPENDENCY = 424; // WebDAV
const HTTP_TOO_EARLY = 425;
const HTTP_UPGRADE_REQUIRED = 426;
const HTTP_PRECONDITION_REQUIRED = 428;
const HTTP_TOO_MANY_REQUESTS = 429;
const HTTP_REQUEST_HEADER_FIELDS_TOO_LARGE = 431;
const HTTP_UNAVAILABLE_FOR_LEGAL_REASONS = 451;

// 5xx: Server error responses
const HTTP_INTERNAL_SERVER_ERROR = 500;
const HTTP_NOT_IMPLEMENTED = 501;
const HTTP_BAD_GATEWAY = 502;
const HTTP_SERVICE_UNAVAILABLE = 503;
const HTTP_GATEWAY_TIMEOUT = 504;
const HTTP_VERSION_NOT_SUPPORTED = 505;
const HTTP_VARIANT_ALSO_NEGOTIATES = 506;
const HTTP_INSUFFICIENT_STORAGE = 507; // WebDAV
const HTTP_LOOP_DETECTED = 508; // WebDAV
const HTTP_NOT_EXTENDED = 510;
const HTTP_NETWORK_AUTHENTICATION_REQUIRED = 511;

/**
 * Human readable translations for each HTTP status code.
 */
const HTTP_STATUS_MESSAGES = {
  // 1xx: Informational
  100: 'Continue',
  101: 'Switching Protocols',
  102: 'Processing',
  103: 'Early Hints',
  
  // 2xx: Successful
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  203: 'Non-Authoritative Information',
  204: 'No Content',
  205: 'Reset Content',
  206: 'Partial Content',
  207: 'Multi-Status',
  208: 'Already Reported',
  226: 'IM Used',
  
  // 3xx: Redirection
  300: 'Multiple Choices',
  301: 'Moved Permanently',
  302: 'Found',
  303: 'See Other',
  304: 'Not Modified',
  305: 'Use Proxy',
  306: 'Reserved',
  307: 'Temporary Redirect',
  308: 'Permanent Redirect',
  
  // 4xx: Client Error
  400: 'Bad Request',
  401: 'Unauthorized',
  402: 'Payment Required',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  406: 'Not Acceptable',
  407: 'Proxy Authentication Required',
  408: 'Request Timeout',
  409: 'Conflict',
  410: 'Gone',
  411: 'Length Required',
  412: 'Precondition Failed',
  413: 'Payload Too Large',
  414: 'URI Too Long',
  415: 'Unsupported Media Type',
  416: 'Range Not Satisfiable',
  417: 'Expectation Failed',
  418: "I'm a teapot",
  421: 'Misdirected Request',
  422: 'Unprocessable Entity',
  423: 'Locked',
  424: 'Failed Dependency',
  425: 'Too Early',
  426: 'Upgrade Required',
  428: 'Precondition Required',
  429: 'Too Many Requests',
  431: 'Request Header Fields Too Large',
  451: 'Unavailable For Legal Reasons',
  
  // 5xx: Server Error
  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
  505: 'HTTP Version Not Supported',
  506: 'Variant Also Negotiates',
  507: 'Insufficient Storage',
  508: 'Loop Detected',
  510: 'Not Extended',
  511: 'Network Authentication Required',
};

export {
  // 1xx
  HTTP_CONTINUE,
  HTTP_SWITCHING_PROTOCOLS,
  HTTP_PROCESSING,
  HTTP_EARLY_HINTS,
  // 2xx
  HTTP_OK,
  HTTP_CREATED,
  HTTP_ACCEPTED,
  HTTP_NON_AUTHORITATIVE_INFORMATION,
  HTTP_NO_CONTENT,
  HTTP_RESET_CONTENT,
  HTTP_PARTIAL_CONTENT,
  HTTP_MULTI_STATUS,
  HTTP_ALREADY_REPORTED,
  HTTP_IM_USED,
  // 3xx
  HTTP_MULTIPLE_CHOICES,
  HTTP_MOVED_PERMANENTLY,
  HTTP_FOUND,
  HTTP_SEE_OTHER,
  HTTP_NOT_MODIFIED,
  HTTP_USE_PROXY,
  HTTP_RESERVED,
  HTTP_TEMPORARY_REDIRECT,
  HTTP_PERMANENT_REDIRECT,
  // 4xx
  HTTP_BAD_REQUEST,
  HTTP_UNAUTHORIZED,
  HTTP_PAYMENT_REQUIRED,
  HTTP_FORBIDDEN,
  HTTP_NOT_FOUND,
  HTTP_METHOD_NOT_ALLOWED,
  HTTP_NOT_ACCEPTABLE,
  HTTP_PROXY_AUTHENTICATION_REQUIRED,
  HTTP_REQUEST_TIMEOUT,
  HTTP_CONFLICT,
  HTTP_GONE,
  HTTP_LENGTH_REQUIRED,
  HTTP_PRECONDITION_FAILED,
  HTTP_PAYLOAD_TOO_LARGE,
  HTTP_URI_TOO_LONG,
  HTTP_UNSUPPORTED_MEDIA_TYPE,
  HTTP_RANGE_NOT_SATISFIABLE,
  HTTP_EXPECTATION_FAILED,
  HTTP_IM_A_TEAPOT,
  HTTP_MISDIRECTED_REQUEST,
  HTTP_UNPROCESSABLE_ENTITY,
  HTTP_LOCKED,
  HTTP_FAILED_DEPENDENCY,
  HTTP_TOO_EARLY,
  HTTP_UPGRADE_REQUIRED,
  HTTP_PRECONDITION_REQUIRED,
  HTTP_TOO_MANY_REQUESTS,
  HTTP_REQUEST_HEADER_FIELDS_TOO_LARGE,
  HTTP_UNAVAILABLE_FOR_LEGAL_REASONS,
  // 5xx
  HTTP_INTERNAL_SERVER_ERROR,
  HTTP_NOT_IMPLEMENTED,
  HTTP_BAD_GATEWAY,
  HTTP_SERVICE_UNAVAILABLE,
  HTTP_GATEWAY_TIMEOUT,
  HTTP_VERSION_NOT_SUPPORTED,
  HTTP_VARIANT_ALSO_NEGOTIATES,
  HTTP_INSUFFICIENT_STORAGE,
  HTTP_LOOP_DETECTED,
  HTTP_NOT_EXTENDED,
  HTTP_NETWORK_AUTHENTICATION_REQUIRED,
  // Translations
  HTTP_STATUS_MESSAGES,
};