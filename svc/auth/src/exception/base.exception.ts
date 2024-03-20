// 추상 클래스를 JavaScript로 변환될 때 클래스를 생성하기 때문에 instanceof 연산자를 사용할 수 있다.
export abstract class BaseException extends Error {
  public abstract code: number;
  public abstract message: string;
  public abstract details: string | string[];
  public abstract stack?: string;

  constructor() {
    super();

    // 예외의 이름을 설정한다.
    this.name = this.constructor.name;

    // 대상 객체인 1번 인자에 stack 속성을 생성한다.
    // stack 속성에 접근하면 Error.captureStackTrace()가 호출된 코드의 위치를 나타내는 문자열이 반환된다.
    // 선택 사항인 1번 인자는 함수를 받는데 명시할 경우 함수를 포함하여 함수 위의 모든 스택 프레임이 생성된 스택 트레이스에서 제외된다.
    // 즉, 함수 A -> 함수 B, 함수 B -> 함수 C인 경우 함수 A를 호출하면 스택 프레임에 밑에서부터 A, B, C 순서로 쌓이는데 만약 B가 인자로 선택되면 함수  B와 함수 C가 스택 트레이스에서 제거된다.
    Error.captureStackTrace(this, this.constructor);
  }
}
