declare namespace NodeJS {
  interface ProcessEnv {
    readonly zesty: {
      readonly stage: string;
      readonly instance_zuid: string;
      readonly production: string;
    }
  };
}
