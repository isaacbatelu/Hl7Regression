module.exports = {
  // This is the function which will be called in the main file, which is dbfechData.js
  // The parameters 'server, username, password,database will be provided inside the function
  // when the function is called in the main file.

  configTest: function () 
  {
     return  {
      user: 'RhapsodyTestSQL_User',
      password: '2RhapsodyTestSQL_User003',
      server: 'rhapsodytest-hv', // You can use 'localhost\\instance' to connect to named instance
      database: 'Rhapsody_Test',
      requestTimeout: 250000
   }
  },
  configStg: function () 
  {
   return  {
      user: 'RhapsodyTestSQL_User',
      password: '2RhapsodyTestSQL_User003',
      server: 'rhapsodytest-hv', // You can use 'localhost\\instance' to connect to named instance
      database: 'Rhapsody_Stg',
      requestTimeout: 250000
   }
  },
  configProd: function () 
  {
   return  {
      user: 'RhapsodyPRODSQL_User',
      password: '2RhapsodyProdSQL_User003',
      server: 'rhapsodyprod-vm', // You can use 'localhost\\instance' to connect to named instance
      database: 'Rhapsody_Prod',
      requestTimeout: 250000
   }
  },
  configDev: function () 
  {
     return {
      user: 'RhapsodyTestSQL_User',
      password: '2RhapsodyTestSQL_User003',
      server: 'rhapsodytest-hv', // You can use 'localhost\\instance' to connect to named instance
      database: 'Rhapsody_Dev',
      requestTimeout: 250000
   }
  },
  configRTUser: function () 
  {
   return {
    user: 'RhapsodyTestSQL_User',
    password: '2RhapsodyTestSQL_User003',
    server: 'rhapsodytest-hv', // You can use 'localhost\\instance' to connect to named instance
    database: 'RT_Tool',
    requestTimeout: 250000
 }
}
};


