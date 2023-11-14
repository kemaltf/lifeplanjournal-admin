// types/next-auth.d.ts

import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    id: string;
    user: {
      username: string;
      firstname: string; // Add the firstName property
      lastname: string; // Add the lastname property
    };
  }

  interface User {
    id: string;
    username: string;
    first_name: string; // Add the firstName property
    last_name: string; // Add the lastname property
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    username: string;
    firstname: string; // Add the firstName property
    lastname: string; // Add the lastname property
  }
}
// types/next-auth.d.ts
