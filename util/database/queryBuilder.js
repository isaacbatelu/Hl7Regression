module.exports = 
{
  // This is the function which will be called in the main file, which is dbfechData.js
  // The parameters 'server, username, password,database will be provided inside the function
  // when the function is called in the main file.
  query: function (table,fromDate, toDate, id1) 
  {
      if(table === 'dbo.RHAPSODY_INTERFACES') {
        return `select INTERFACEID, INTERFACENAME, INBOUND  from ${table} with (nolock)`;
      } else {
        return `select INTERFACEID, payload from ${table} with (nolock) where DATETIMESTAMP BETWEEN '${fromDate}' AND '${toDate}' and interfaceid = ${id1}`;
      }
    
  },
  userQuery: function (queryType, userData) 
  {
      if(queryType === 'insert') {
        return `insert into dbo.RT_USERS (EMAIL, FIRST_NAME, LAST_NAME, PASSWORD, ACCESS_LEVEL) values ('${userData.email}', '${userData.firstName}', '${userData.lastName}', '${userData.password}', ${userData.userAccess})`;
      } else if (queryType === 'select') {
        return `select email, password, access_level from dbo.RT_USERS where email = '${userData}'`
      } else if (queryType === 'update') {
        return `update dbo.RT_USERS set  PASSWORD = '${userData.password}' where EMAIL = '${userData.email}'`

      }   
  }
};