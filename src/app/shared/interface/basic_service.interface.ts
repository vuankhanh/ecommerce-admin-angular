import { Observable } from "rxjs";

export interface IBasicService<T> {
  get(): Observable<T>;

  create(
    alternateName: string,
    description: string,
    file: Blob | Array<Blob>
  ): Observable<T>;

  update(
    alternateName: string,
    description: string,
    file?: Blob | Array<Blob>,
    filesWillRemove?: Array<string>
  ): Observable<T>;

  delete(): Observable<T>;
}