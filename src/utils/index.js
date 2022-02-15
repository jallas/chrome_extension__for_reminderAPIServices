const crypto = require("crypto")

exports.cleanPhoneNumber = (phone = "") => {
  const ext = "234"
  if (phone.indexOf(ext) === 0 && phone.length > 11) {
    phone = phone.substr(ext.length);
  }
  if (phone.indexOf("0") === 0) phone = phone.substr(1);
  if (isNaN(Number(phone)) || phone.length !== 10) {
    return null;
  }
  return ext + phone;
}

exports.generateReferralCode = (length = 6) => {
  length = Math.min(10, length);
  return Math.round(Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))
    .toString(36)
    .slice(1)
    .toUpperCase();
};

exports.generateReference = (pre = '', length = 13) => {
  const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    pre += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
  }
  return pre;
}

exports.generateOTP = (length = 6) => {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[(Math.floor(Math.random() * digits.length))];
  }
  return otp;
}

exports.invertObject = (obj) => {
  return Object.keys(obj).reduce((ret, key) => {
    ret[obj[key]] = key;
    return ret;
  }, {});
}

exports.sha512 = (text) => {
  const hash = crypto.createHmac('sha512', process.env.AWS_S3_HASH_KEY);
  const data = hash.update(text, 'utf-8');
  return data.digest('hex');
};

exports.toDays = (number, type = "days") => {
  type = type.toLowerCase()
  switch (type) {
    case "weeks":
      return +number * 7
    case "months":
      return +number * 30
    case "years":
      return +number * 365
    default:
      return +number
  }
}

exports.toNearest = (number, n = 2) => Math.round((number + Number.EPSILON) * 10 ** n) / 10 ** n


exports.pagination = async (Model, search = "", search_fields = "", page = 1, limit = 10, sortBy = '', sortDir = 'DESC', graph = {}) => {
  page = Number(page);
  limit = Number(limit);
  let data = Model.orderBy(sortBy, sortDir).page(page > 0 ? page - 1 : 0, limit);
  search_fields = search_fields.split(",")
  if (search_fields.length > 0 && search) {
    if (graph) {
      data = data.whereIn(graph?.first_id, function () {
        let sub_data = this.select(graph?.second_id).from(graph?.second_db);
        sub_data = sub_data.where(search_fields[0], 'like', `%${search}%`)
        if (search_fields.length > 1) {
          const [, ...rest] = search_fields;
          for (const field of rest) {
            sub_data = sub_data.orWhere(field, 'like', `%${search}%`)
          }
        }
        return sub_data;
      })
    } else {
      data = data.where(search_fields[0], 'like', `%${search}%`)
      if (search_fields.length > 1) {
        const [, ...rest] = search_fields;
        for (const field of rest) {
          data = data.orWhere(field, 'like', `%${search}%`)
        }
      }
    }
  }
  
  data = await data;
  return { results: data.results, page_info: { page, limit, total: data.total, total_pages: Math.ceil(Number(data.total) / Number(limit)) } };
}