export class RequestResult<V, E> {

    public isSuccess: boolean;
    public isFailure: boolean;
    private error: E;
    private data: V;
    public message: string;
  
    private constructor(isSuccess: boolean, data: V, error: E, message: string) {
      if (isSuccess && error) {
        throw new Error('Successful result must not contain an error');
      } else if (!isSuccess && data) {
        throw new Error('Unsuccessful error must not contain a value');
      }
  
      this.isSuccess = isSuccess;
      this.isFailure = !isSuccess;
      this.data = data;
      this.error = error;

      if(error !== undefined || error){
        if(error['message']){
          this.message =  error['message'];
        }
      }else if(message) {
        this.message =  message;
      }
    }
  
    public static ok<V>(value: V, message?: string): RequestResult<V, undefined> {
      return new RequestResult(true, value, undefined, message);
    }
  
    public static fail<E>(error: E, message?: string): RequestResult<undefined, E> {
      return new RequestResult(false, undefined, error, message);
    }

    public static message<V>(message: string,value: V): RequestResult<V, undefined> {
      return new RequestResult(true, value, undefined, message);
    }
  
    public getError(): E {
      if (this.isSuccess) {
        throw new Error('Successful result does not contain an error');
      }
  
      return this.error;
    }
  
    public getValue(): V {
      if (this.isFailure) {
        throw new Error('Unsuccessful result does not contain a value');
      }
  
      return this.data;
    }
  }
  
  type RepoErrorCode = 404 | 500;
  
  export class RepoError extends Error {
    public code: number;
    public message: string;
    constructor(message: string, code: number) {
      super(message);
      this.code = code;
      this.message = message;
    }
  }