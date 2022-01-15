const superagent = require('superagent');
const apiKey = 'Bearer zfwzhrbe2kf9agg58n3h'; 
const companyId = 554303;
const baseUrl = 'https://api.yclients.com/api/v1/';
const comment = "Приложение";




export default class Api {
  getServices(success, fail) {
    superagent
    .get(`${baseUrl}book_services/${companyId}`)
    .set('Authorization', apiKey)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/vnd.yclients.v2+json')
    .end((err, res) => {
      if (res.body.success) {
        success(res.body.data.services);
      } else {
        fail(res.body.meta.message);
      }
      
    });
  }
  
  getStaff(serviceId, success, fail) {
    superagent
    .get(`${baseUrl}book_staff/${companyId}?service_ids=${serviceId}`)
    .set('Authorization', apiKey)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/vnd.yclients.v2+json')
    .end((err, res) => {
      if (res.body.success) {
        success(res.body.data);
      } else {
        fail(res.body.meta.message);
      }
      
    });
  }
  
  getDates(serviceId, staffId, success, fail) {
    superagent
    .get(`${baseUrl}book_dates/${companyId}?service_ids=${serviceId}&staff_id=${staffId}`)
    .set('Authorization', apiKey)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/vnd.yclients.v2+json')
    .end((err, res) => {
      if (res.body.success) {
        success(res.body.data.booking_dates);
      } else {
        fail(res.body.meta.message);
      }
      
    });
  }
  
  getTimes(serviceId, staffId, date, success, fail) {
    superagent
    .get(`${baseUrl}book_times/${companyId}/${staffId}/${date}?service_ids=${serviceId}`)
    .set('Authorization', apiKey)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/vnd.yclients.v2+json')
    .end((err, res) => {
      if (res.body.success) {
        success(res.body.data);
      } else {
        fail(res.body.meta.message);
      }
      
    });
  }

  record(serviceId, staffId, datetime, phone, name, email, success, fail) {
    superagent
    .post(`${baseUrl}book_record/${companyId}`)
    .set('Authorization', apiKey)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/vnd.yclients.v2+json')
    .send({ 
      'phone': phone, 
      'fullname': name,
      'email': email,
      'api_id': 554303,
      'comment': comment,
      'notify_by_sms' : 2,
      'appointments': [
        {
          'id':1,
          "services":[serviceId],
          "staff_id": staffId,
          "datetime": datetime
        }
      ]
    })
    .end((err, res) => {
      if (res.body.success) {
        success();
      } else {
        fail(res.body.meta.message);
      }
    });
  }
  
  
  sendCode(number, name, success, fail) {
    superagent
    .post(`${baseUrl}book_code/${companyId}`)
    .set('Authorization', apiKey)
    .set('Content-Type', 'application/json')
    .send({ 'phone': number, 'fullname': name })
    .end((err, res) => {
      if (res.body.success) {
        success(res.body.meta.message);
      } else {
        fail(res.body.errors.message);
      }
    });
  }
  
  authorize(number, code, success, fail) {
    superagent
    .post(`${baseUrl}user/auth`)
    .set('Authorization', apiKey)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/vnd.yclients.v2+json')
    .send({ 'phone': number, 'code': code })
    .end((err, res) => {
      if (res.body.success) {
        success(res.body.data.user_token);
      } else {
        fail(res.body.meta.message);
      }
    });
  }
  
  getUserRecords(userToken, success, fail) {
    superagent
    .get(`${baseUrl}user/records/`)
    .set('Authorization', `${apiKey}, User ${userToken}`)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/vnd.yclients.v2+json')
    .end((err, res) => {
      if (res.body.success) {
        success(res.body);
      } else {
        fail(res.body.meta.message);
      }
    });
  }
  
  deleteRecord(userToken, id, success, fail) {
    superagent
    .delete(`${baseUrl}user/records/${id}`)
    .set('Authorization', `${apiKey}, User ${userToken}`)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/vnd.yclients.v2+json')
    .end((err, res) => {
      if (res.ok) {
        success();
      } else {
        fail('Не удалось удалить запись');
      }
    });
  }
}

