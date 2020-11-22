type GeneralConfigType = {
  database: {
    host: string;
    database: string;
    user: string;
    password: string;
  };
  chat: {
    range: {
      status: boolean;
      distance: number;
    };
  };
};

const config: GeneralConfigType = {
  database: {
    host: 'localhost',
    database: 'drp',
    user: 'root',
    password: '',
  },
  chat: {
    range: {
      status: false,
      distance: 15,
    },
  },
};

export default config;
