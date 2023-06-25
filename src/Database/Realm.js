import Realm from 'realm';


const realm = new Realm({
    path: 'Packing.realm',
    schema: [
      {
        name: 'Stock',
        properties: {
          StockId: { type: 'int', default: 0 },
          StockCode:'string',
          StockTitle:'string'
        },

      },
      {
        name: 'User',
        properties: {
          UserId: { type: 'int', default: 0 },
          UserCode:'string',
          UserTitle:'string',
          PINCode: 'string',
          Changed: 'int'
        },
      },
      {
        name: 'CountingHeader',
        properties: {
          CountingHeaderId: { type: 'int', default: 0 },
          UserCode:'string',
          UserTitle: 'string',
          StockCode: 'string',
          StockTitle: 'string',
          RegisterDate: 'string',
          NRegisterDate: 'string',
          PeriodTitle: 'string',
          PeriodCode: 'int',
          StatusCode: 'int'
        },
      },
      {
          name: 'CountingDetail',
          properties: {
            CountingDetailId: { type: 'int', default: 0 },
            CountingHeaderRef: 'int',
            SectionCode:'string',
            PartCode: 'string',
            Quantity: 'string',
            Description: 'string',
          },
      },
      {
        name: 'Connection',
        properties: {
          Server: 'string',
          Username:'string',
          Password: 'string',
          Database: 'string',
        },
    },
    {
      name: 'OnlineCheck',
      properties: {
        OnlineChecking: 'int'
      },
  },
    {
      name: 'AppSetting',
      properties: {
        Serial: 'string',
        Version:'string',
        ActiveDate: 'string'
      },
  },
    {
      name: 'Queries',
      properties: {
        QueryId: { type: 'int', default: 0 },
        Table: 'string',
        Param_C: 'string',
        // Param_C_Title: 'string',
        Param_1: 'string',
        // Param_1_Title: 'string',
        Param_2: 'string',
        // Param_2_Title: 'string',
        Param_3: 'string',
        // Param_3_Title: 'string',
        Param_4: 'string',
        // Param_4_Title: 'string',
        Param_5: 'string',
        // Param_5_Title: 'string',
        Param_6: 'string',
        // Param_6_Title: 'string',
      },
    },
    ],
  })


  export default realm;
